'use strict';
import * as vscode from 'vscode';
import { IORunManager } from './ioRunManager';
import * as analytics from './analytics';

export function activate(context: vscode.ExtensionContext) {
    console.log('"io-run" is now active!');
    let config = vscode.workspace.getConfiguration('io-run');

    analytics.updateConfig(config);
    analytics.send("Extension", "activate");
    analytics.send("Platform", process.platform);

    let ioRunManager = new IORunManager(config);

    vscode.workspace.onDidChangeConfiguration(() => {
        config = vscode.workspace.getConfiguration('io-run');
        ioRunManager.updateConfig(config);
        analytics.updateConfig(config);
    });

    let run = vscode.commands.registerCommand('io-run.run', () => {
        ioRunManager.run();
    });
    let run1input = vscode.commands.registerCommand('io-run.run-1-input', () => {
        ioRunManager.run(false);
    });

    let stop = vscode.commands.registerCommand('io-run.stop', () => {
        ioRunManager.stop();
    });

    let addInputOutput = vscode.commands.registerCommand('io-run.add-input-output', () => {
        ioRunManager.addInputOutput();
    });

    context.subscriptions.push(run);
    context.subscriptions.push(run1input);
    context.subscriptions.push(stop);
    context.subscriptions.push(addInputOutput);
}

export function deactivate() {
}