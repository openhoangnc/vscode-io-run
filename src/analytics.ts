'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

var visitor = null;
var enable = false;

(() => {
    var ua = require('universal-analytics');
    var nmi = require('node-machine-id');
    const mid = nmi.machineIdSync(true);
    const uaid = 'UA-106099545-2';

    visitor = ua(uaid, mid, { https: true });
})()

export function updateConfig(config: vscode.WorkspaceConfiguration) {
    enable = config.get<boolean>('enableAnalytic');
}

export function send(label, value) {
    if (enable) {
        visitor.event(label, value).send();
    }
}

