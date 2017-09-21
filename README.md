# Node Modules Manager
Use this context menu to quickly hide node_module dependencies. This also provides the option to only show the dependencies listed in a package.json file.

## Usage
Right click on any `node_modules/` directory in the Visual Studio Code Explorer for the available options.

### Hide Folder
Select this option to hide the entire `node_modules/` directory and all of its sub-directories.

### Hide non-named dependencies
Select this option to hide any sub-directories under the `node_modules` directory if they are not listed under `dependencies` and `devDependencies` in the `package.json` file.

#### Example
If the only dependency you have listed in package.json is `express`, then `chalk` will be hidden.

```
my-app-dir/
 |- src/
 |- node_modules/
 |   |- chalk/     <- will be hidden
 |   `- express/
 |
 `- package.json
```
