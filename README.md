# typedocinc

Insert files content in documentation pages generated with `typedoc`.

With this tool, API documentation writers will insert their own content before and after the original content of a typedoc-generated documentation. For every `.html` file in the original documentation, the tool creates the `<basename>_before.md` and `<basename>_after.md` files. Next, the documentation writer adds content in these files. Finally, the tool merges the original documentation and the `before` and `after` files, and saves the new documentation.

## Install

Install `typedocinc` as `global`:

```bash
npm i typedocinc -g
```

Check it works:

```bash
typedocinc -h
```

```txt
Usage: typedocin [options] [command]

Includes files in documentation generated with typedoc

Options:
  -V, --version               output the version number
  -v, --verbose               show detail messages during execution. (default: false)
  -h, --help                  display help for command

Commands:
  prepare|p [options] <path>  prepare original documentation in <path> by creating its before and after files
  build|b [options] <path>    enhance original documentation in <path> by mergind before and after files in the original documentation.     
  help [command]              display help for command
```

## Usage

**Get basic help information**

```bash
// short option name
typedocinc -h

// or the long option name
typedocinc --help

// or the help command
typedocinc help [command]
```

**Get help for `prepare | p` command**

```bash
typedocinc help prepare
```

```txt
Usage: typedocin prepare|p [options] <path>

prepare original documentation in <path> by creating its before and after files

Options:
  -i, --includes <path>         Path where before and after files will be created.
  -c, --clear                   Override before and after files (default: false)
  -d, --defaultIncludes <path>  Path to file with default content for includes files
  -b, --beforeIncludes <path>   Path to file with default before content for includes files
  -a, --afterIncludes <path>    Path to file with default after content for includes files
  -h, --help                    display help for command
```

**Get help for `build | b` command**

```bash
typedocinc help build
```

```txt
Usage: typedocin build|b [options] <path>

enhance original documentation in <path> by mergind before and after files in the original documentation.

Options:
  -i, --includes <path>  Path where before and after files already exist.
  -t, --target <path>    Path where enhanced documentation is saved into.
  -h, --help             display help for command
```

**Get help for `generate | g` command**

```bash
typedocinc help generate
```

```txt
Usage: typedocin generate|g [options] <path>

prepare before and after files, enhance original documentation in <path> by mergind before and after files in the original documentation.   

Options:
  -i, --includes <path>         Path where before and after files already exist.
  -t, --target <path>           Path where enhanced documentation is saved into.
  -c, --clear                   Override before and after files (default: false)
  -d, --defaultIncludes <path>  Path to file with default content for includes files
  -b, --beforeIncludes <path>   Path to file with default before content for includes files
  -a, --afterIncludes <path>    Path to file with default after content for includes files
  -h, --help                    display help for command
```

## Functions

<dl>
<dt><a href="#createIncludes">createIncludes(source, includes, options)</a></dt>
<dd><p>Create includes files for an original typedoc documentation.</p>
</dd>
<dt><a href="#buildIncludes">buildIncludes(source, includes, destination, options)</a></dt>
<dd><p>Merge includes files into original documentation.</p>
<p>Creates a copy of the source documentation containing the includes
file for each source file as indicated in the specified folder.
Saves resulting documentation in provided folder.</p>
</dd>
<dt><a href="#getDefaultIncludesContent">getDefaultIncludesContent(options)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Load default includes files as specified in provided keys.</p>
</dd>
</dl>

<a name="createIncludes"></a>

## createIncludes(source, includes, options)
Create includes files for an original typedoc documentation.

**Kind**: global function  

| Param    | Type                | Description                                                                           |
| -------- | ------------------- | ------------------------------------------------------------------------------------- |
| source   | <code>string</code> | Path of source (original) documentation.                                              |
| includes | <code>string</code> | Path to includes folder. Create before and after includes files for each source file. |
| options  | <code>object</code> | Object with key-value pairs                                                           |

<a name="buildIncludes"></a>

## buildIncludes(source, includes, destination, options)
Merge includes files into original documentation.

Creates a copy of the source documentation containing the includes
file for each source file as indicated in the specified folder.
Saves resulting documentation in provided folder.

**Kind**: global function  

| Param       | Type                | Description                                                        |
| ----------- | ------------------- | ------------------------------------------------------------------ |
| source      | <code>string</code> | Path to source documentation.                                      |
| includes    | <code>string</code> | Path to folder with includes files.                                |
| destination | <code>string</code> | Path to resulting documentation, with original and includes files. |
| options     | <code>object</code> | Object with options for building files.                            |

<a name="getDefaultIncludesContent"></a>

## getDefaultIncludesContent(options) ⇒ <code>string</code> \| <code>undefined</code>
Load default includes files as specified in provided keys.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - If file exists, the content of the file, or `undefined` otherwise.  

| Param   | Type                | Description                                                                                                       |
| ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| options | <code>object</code> | Object whose keys are role for files and values are filenames {'beforeIncludes: 'path/to/file/to/include/before'} |

