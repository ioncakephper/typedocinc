# typedocinc

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

