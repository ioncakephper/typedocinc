#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
});

const version = require('../package.json').version;

program
    .passCommandToAction(false)

program
    .name('typedocin')
    .description('Includes files in documentation generated with typedoc')
    .version(version)
    .option('-v, --verbose', 'show detail messages during execution.', false)

program
    .command('prepare <path>')
    .alias('p')
    .description('prepare original documentation in <path> by creating its before and after files')
    .requiredOption('-i, --includes <path>', 'Path where before and after files will be created.')
    .option('-c, --clear', 'Override before and after files', false)
    .option('-d, --defaultIncludes <path>', 'Path to file with default content for includes files')
    .option('-b, --beforeIncludes <path>', 'Path to file with default before content for includes files')
    .option('-a, --afterIncludes <path>', 'Path to file with default after content for includes files')
    .action((path, options) => {
        createIncludes(path, options.includes, options)
    })

program
    .command('build <path>')
    .alias('b')
    .description('enhance original documentation in <path> by mergind before and after files in the original documentation.')
    .requiredOption('-i, --includes <path>', 'Path where before and after files already exist.')
    .requiredOption('-t, --target <path>', 'Path where enhanced documentation is saved into.')
    .action((path, options) => {
        buildIncludes(path, options.includes, options.target, options)
    })

program.parse()

/**
 * Create includes files for an original typedoc documentation.
 * 
 * @param {string} source Path of source (original) documentation. 
 * @param {string} includes Path to includes folder. Create before and after includes files for each source file. 
 * @param {object} options Object with key-value pairs
 */
function createIncludes(source, includes, options) {

    if (fs.existsSync(path.resolve(source))) {
        let items = fs.readdirSync(source);

        let files = items.filter((item) => {
            let stats = fs.statSync(path.join(source, item));
            return stats.isFile();
        }).filter((item) => {
            let ext = path.extname(path.join(source, item));
            return ext.endsWith('.html')
        })

        files.forEach((file) => {
            let sourceFile = path.join(source, file);

            let rel = path.relative(source, sourceFile);
            let basename = path.basename(sourceFile, path.extname(sourceFile));

            // Create before and after includes file for each source file

            ['_before', '_after'].forEach((stage) => {
                let includes_folder = path.join(includes, path.dirname(rel));
                let filename = path.join(includes_folder, basename + stage + '.md');

                // Load default includes file based on stage and program options
                // Convert result from Markdown to HTML
                let content = getDefaultIncludesContent(Object.assign({}, options, { 'stage': stage })) || '<!-- Your custom ' + stage + ' goes here' + ' -->';
                content = md.render(content);

                // Generate the includes file for stage and source file.
                let d = path.dirname(filename);
                if (!fs.existsSync(d)) {
                    fs.mkdirSync(d, { 'recursive': true })
                }

                if (!fs.existsSync(filename) || (options.clear === true)) {
                    fs.writeFileSync(filename, content, 'utf8');
                }
            })
        })

        let folders = items.filter((item) => {
            let stats = fs.statSync(path.join(source, item));
            return stats.isDirectory();
        })

        folders.forEach((folder) => {
            let newSource = path.join(source, folder);
            let newDestination = path.join(includes, folder);

            createIncludes(newSource, newDestination, options);
        })
    }
}

/**
 * Merge includes files into original documentation.
 * 
 * Creates a copy of the source documentation containing the includes
 * file for each source file as indicated in the specified folder.
 * Saves resulting documentation in provided folder.
 * 
 * @param {string} source Path to source documentation.
 * @param {string} includes Path to folder with includes files.
 * @param {string} destination Path to resulting documentation, with original and includes files.
 * @param {object} options Object with options for building files.  
 */
function buildIncludes(source, includes, destination, options) {
    if (fs.existsSync(source)) {

        // First, make sure we copy the original to destination
        fs.copySync(source, destination);

        let items = fs.readdirSync(source);

        // Get .html files in the source folder
        let files = items.filter((item) => {
            let stats = fs.statSync(path.join(source, item));
            return stats.isFile();
        }).filter((item) => {
            let ext = path.extname(path.join(source, item));
            return ext.endsWith('.html')
        })

        // Find places in source file where includes files will be merged in.

        files.forEach((file) => {
            let sourceFile = path.join(source, file);

            let rel = path.relative(source, sourceFile);

            let basename = path.basename(sourceFile, path.extname(sourceFile));
            let parts = ['_before', '_after'].map((stage) => {
                let includes_folder = path.join(includes, path.dirname(rel));
                let filename = path.join(includes_folder, basename + stage + '.md');

                let result = (fs.existsSync(filename)) ? "Exists" : "Strange! Why not there?"

                // Convert included content from markdown into html
                let content = fs.readFileSync(filename, 'utf-8');
                return md.render(content);
            })

            let sourceText = fs.readFileSync(sourceFile, 'utf8')
            let regex = /(.*doctype.*container\-main\"\>)(.*)(\<\/div\>.*\<footer.*)/is;
            let matches = sourceText.match(regex);

            let destination_folder = path.join(destination, path.dirname(rel));
            let outputFilename = path.join(destination_folder, file);

            if (matches) {
                let outputContent = matches[1] + parts[0] + matches[2] + parts[1] + matches[3];
                fs.writeFileSync(outputFilename, outputContent, 'utf8');
            } else {
                console.log('Mathes not found for:', outputFilename);
            }
        })

        let folders = items.filter((item) => {
            let stats = fs.statSync(path.join(source, item));
            return stats.isDirectory();
        })

        folders.forEach((folder) => {
            let newSource = path.join(source, folder);
            let newIncludes = path.join(includes, folder)
            let newDestination = path.join(destination, folder);

            buildIncludes(newSource, newIncludes, newDestination, options);
        })

    }
}

/**
 * Load default includes files as specified in provided keys.
 * 
 * @param {object} options Object whose keys are role for files and values are filenames {'beforeIncludes: 'path/to/file/to/include/before'}
 * @returns {string|undefined} If file exists, the content of the file, or `undefined` otherwise.
 */
function getDefaultIncludesContent(options) {

    let filename = options.defaultIncludes;

    if (options.stage) {
        if (options.stage === '_before') {
            filename = options.beforeIncludes || filename;
        }
        if (options.stage === '_after') {
            filename = options.afterIncludes || filename;
        }
    }

    let ext = path.extname(filename);
    if (ext.length == 0)
        filename += '.md';

    if (filename) {
        if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf-8')
        }
    }
    return undefined;
}