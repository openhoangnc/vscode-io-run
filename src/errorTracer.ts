'use strict';

let debuggers = {
    "lldb": lldbTrace,
    "gdb": gdbTrace
};


export function TraceError(debuggerName: string, runCmd: string, codeDir: string, path: string, onDone: Function): boolean {
    let d = debuggers[debuggerName]
    if (!d) return false;
    return d(runCmd, codeDir, path, onDone);
}

function replaceVar(cmd: string, files: any): string {
    cmd = cmd.replace(/\$\{exec\}/g, files.execFile);
    cmd = cmd.replace(/\$\{inputFile\}/g, files.inputFile);
    cmd = cmd.replace(/\$\{outputFile\}/g, files.outputFile);
    return cmd;
}

function parseRunCmd(runCmd: string): any {
    let matchExecFile = runCmd.match(/^(("([^"]|\\")+")|([^ ]+)) (.+$)/);
    if (matchExecFile) {
        let execFile = matchExecFile[1];
        let inoutFiles = matchExecFile[5];

        let matchInputFile = inoutFiles.match(/< ?(("([^"]|\\")+")|([^ ]+))( |$)/);
        let matchOutputFile = inoutFiles.match(/> ?(("([^"]|\\")+")|([^ ]+))( |$)/);
        if (matchInputFile && matchOutputFile) {
            let inputFile = matchInputFile[1];
            let outputFile = matchOutputFile[1];
            return {
                execFile: execFile,
                inputFile: inputFile,
                outputFile: outputFile
            };
        }
    }

    return null;
}

function lldbTrace(runCmd: string, codeDir: string, path: string, onDone: Function): boolean {
    let files = parseRunCmd(runCmd);
    if (runCmd == null) return false;


    let launch = replaceVar("lldb ${exec}", files);
    let run = replaceVar("process launch -i ${inputFile} -o ${outputFile}", files);

    let process = require('child_process').exec(launch, { cwd: codeDir, env: { PATH: path } }, (err, stdout, stderr) => {
        let output = stdout.toString();
        let m = output.match(/Process \d+ stopped([\S\s]+)$/);
        const lineEnd = "(lldb) q";
        if (m && m.length > 1) {
            let traceInfo = m[1].trim();
            if (traceInfo.endsWith(lineEnd)) {
                traceInfo = traceInfo.slice(traceInfo.length - lineEnd.length);
            }
            onDone("\n" + traceInfo + "\n");
        } else {
            onDone(output);
        }
    });

    let runCmdSent = false;
    let quitCmdSent = false;
    let stopped = false;

    process.stdout.on("data", (data) => {
        // console.log(data);
        if (!stopped && (data.match(/Process \d+ stopped/) || data.match(/\(process \d+\) exited/))) {
            stopped = true;
        }
        if (!runCmdSent) {
            runCmdSent = true;
            process.stdin.write(run + "\n");
        } else if (!quitCmdSent) {
            quitCmdSent = true;
            process.stdin.write("q\n\y\n");
        } else {
            if (stopped) {
                process.kill();
            }
        }
    });


    return true;
}

function getFreePort(port, onFound) {
    var net = require('net');

    var server = net.createServer(function (socket) { });

    server.listen(port, '127.0.0.1');
    server.on('error', function (e) {
        getFreePort(port + 1, onFound);
    });
    server.on('listening', function (e) {
        server.close();
        onFound(port);
    });
}

function gdbTrace(runCmd: string, codeDir: string, path: string, onDone: Function): boolean {
    let files = parseRunCmd(runCmd);
    if (runCmd == null) return false;
    getFreePort(23456, function (port) {
        let gdbserverCmd = replaceVar("gdbserver :" + port + " ${exec} <${inputFile} >${outputFile}", files);
        let gdbCmd = replaceVar("gdb -q ${exec}", files);
        let targetRemote = "target remote :" + port;

        let gdbTargetRemoteSent = false;
        let runCmdSent = false;
        let quitCmdSent = false;
        let stopped = false;

        let processGdbServer = require('child_process').exec(gdbserverCmd, { cwd: codeDir, env: { PATH: path } });

        processGdbServer.stderr.on("data", (data) => {
            // console.log(data);
            if (data.match(/Listening on port \d+/)) {
                let processGdb = require('child_process').exec(gdbCmd, { cwd: codeDir, env: { PATH: path } }, (err, stdout, stderr) => {
                    // console.log(stdout);
                    let m = stdout.match(/(Program received signal [\S\s]+)$/);
                    if (m && m.length > 0) {
                        let traceInfo = m[1].trim();
                        let m2 = traceInfo.match(/([\S\s]+?)\(gdb\) A debugging session is active./);
                        if (m2 && m2.length > 0) {
                            traceInfo = m2[1].trim();
                            onDone("\n" + traceInfo + "\n");
                        } else {
                            onDone(traceInfo);
                        }
                    } else {
                        onDone(stdout);
                    }
                });
                processGdb.stdout.on("data", (data) => {
                    // console.log(data);
                    if (data.match(/Program received signal /)) {
                        stopped = true;
                    }
                    if (!gdbTargetRemoteSent) {
                        gdbTargetRemoteSent = true;
                        processGdb.stdin.write(targetRemote + "\n");
                    } else if (!runCmdSent) {
                        runCmdSent = true;
                        processGdb.stdin.write("c\n");
                    } else if (!quitCmdSent) {
                        quitCmdSent = true;
                        processGdb.stdin.write("q\ny\n");
                    } else {
                        if (stopped) {
                            processGdb.kill();
                        }
                    }
                });
            }
        });
    });

    return true;
}
