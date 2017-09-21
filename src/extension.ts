'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";
import * as nodePath from "path";

function resolvePath(filepath) {
    let root = vscode.workspace.rootPath;
    let path = filepath.replace(root, "").replace(/\\/g, "/");
    path = ((path[0] == "/") ? path.substr(1) : path);
    return path;
}

function hidePaths(paths) {
    let config = vscode.workspace.getConfiguration();
    let excluded = config.get("files.exclude", {});
    paths.forEach(path => {
        excluded[path] = true;
    });
    config.update("files.exclude", excluded);
}

export function activate(context) {
    let hideItem = vscode.commands.registerCommand('extension.hideItem', (data) => {
        if (!data) {
            return false;
        }
        let path = resolvePath(data.fsPath);
        hidePaths([path]);
    });
    
    let nodeModulesConfig = vscode.commands.registerCommand('extension.nodeModulesConfig', (data) => {
        let nodeModules = fs.readdirSync(data.fsPath);

        let path = data.fsPath.replace("node_modules", "package.json").replace(/\\/g, "/");
        vscode.workspace.openTextDocument(path).then(doc => {
            let packageJson = JSON.parse(doc.getText());
            let mapHighestDep = (dep) => (dep.indexOf("/") > -1) ? dep.substr(0, dep.indexOf("/")) : dep;
            let libs = [];

            if (packageJson.hasOwnProperty('dependencies')) {
                let deps = Object.keys(packageJson['dependencies']).map(mapHighestDep);
                libs.push(...deps);
            }

            if (packageJson.hasOwnProperty('devDependencies')) {
                let devDeps = Object.keys(packageJson['devDependencies']).map(mapHighestDep);
                libs.push(...devDeps);
            }

            nodeModules = nodeModules.filter(m => libs.indexOf(m) === -1).map(m => resolvePath(nodePath.join(data.fsPath, m)));
            hidePaths(nodeModules);
            vscode.window.showInformationMessage(`'${data.fsPath}' dependencies have been hidden. To unhide them, open workspace configuration. (Keyboard Shortcut: [CTRL] + ,)`);
        }, err => console.log(err));
    });

    context.subscriptions.push(hideItem, nodeModulesConfig);
}

export function deactivate() {

}