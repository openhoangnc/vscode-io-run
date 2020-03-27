import * as vscode from 'vscode';
import { IORunManager } from './ioRunManager';
import { Analytics } from './analytics';

let config: vscode.WorkspaceConfiguration;
let analytics = Analytics();

export function activate(context: vscode.ExtensionContext) {
    console.log('"io-run" is now active!');

    config = vscode.workspace.getConfiguration('io-run');

    analytics.updateConfig(config);
    analytics.send("Extension", "activate");
    analytics.send("Platform", process.platform);

    const ioRunManager = new IORunManager(config, analytics);

    const run = vscode.commands.registerCommand('io-run.run', () => {
        ioRunManager.run();
    });

    const run1input = vscode.commands.registerCommand('io-run.run-1-input', () => {
        ioRunManager.run(false);
    });

    const stop = vscode.commands.registerCommand('io-run.stop', () => {
        ioRunManager.stop();
    });

    const addInputOutput = vscode.commands.registerCommand('io-run.add-input-output', () => {
        ioRunManager.addInputOutput();
    });

    context.subscriptions.push(run);
    context.subscriptions.push(run1input);
    context.subscriptions.push(stop);
    context.subscriptions.push(addInputOutput);

    vscode.workspace.onDidChangeConfiguration(() => {
        config = vscode.workspace.getConfiguration('io-run');
        ioRunManager.updateConfig(config);
        analytics.updateConfig(config);
    });
}

export function deactivate() {
    analytics.send("Extension", "deactivate");
}