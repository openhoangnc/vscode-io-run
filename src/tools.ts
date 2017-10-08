'use strict';

export function getFileNoExtension(filePath: string): string {
    let index = filePath.lastIndexOf(".");
    if (index !== -1) {
        return filePath.substr(0, index);
    } else {
        return filePath;
    }
}

export function quoteFileName(filePath: string): string {
    if (filePath.match(/\s/)) {
        filePath = '"' + filePath.replace(/"/g, '\"') + '"'
    }
    return filePath;
}


export function replaceVar(originalStr: string, varName: string, value: string): string {
    let regx = new RegExp("\\$\\{" + varName + "([\\W][^ }]+)?\\}", "g");

    if (value.match(/\s/)) {
        value = value.replace(/"/g, '\\"');
        return originalStr.replace(regx, '"' + value + '$1"');
    }

    return originalStr.replace(regx, value + '$1');
}
