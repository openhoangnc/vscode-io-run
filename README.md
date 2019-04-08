# IO Run

 [![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/hoangnc.io-run.svg)](https://marketplace.visualstudio.com/items?itemName=hoangnc.io-run) [![Installs](https://vsmarketplacebadge.apphb.com/installs/hoangnc.io-run.svg)](https://marketplace.visualstudio.com/items?itemName=hoangnc.io-run) [![Rating](https://vsmarketplacebadge.apphb.com/rating/hoangnc.io-run.svg)](https://marketplace.visualstudio.com/items?itemName=hoangnc.io-run) [![Build Status](https://travis-ci.org/openhoangnc/vscode-io-run.svg?branch=master)](https://travis-ci.org/openhoangnc/vscode-io-run)

Support tool for running and testing your Competitive Programming solutions in multiple programming languages i.e **C, C++, D, Dart, Go, Groovy, Haskell, Java, JavaScript, Kotlin, Lua, OCaml, Pascal, Perl, PHP, Python, R, Ruby, Rust, Scala, Swift**

## Donation

If you like this extension, you could donate via **[PayPal](https://paypal.me/tohoangnc)** or AliPay or Momo. Any amount is welcome. It will encourage me to make this extension better and better!

![Donate via AliPay](images/donate_alipay.jpg)　![Donate via Momo](images/donate_momo.png)

## Features

* Run code file
* Run in Terminal
* Run with multiple input files
* Compare output files with accepted output files
* Trace run time error by gdb or lldb
* Cleanup after run

## Usages

* In the Text Editor, use shortcut `Ctrl+Enter (Cmd+Enter)` or right click the Text Editor and then click `IORun Run` in editor context menu, or click ![RunIcon](images/run-16.png) button in editor title menu, the code will be run.
  * If there is no input file, the code will be run in TERMINAL.
  * If there are one or more input files, the code will be run with each input files. Input file will be redirect to Standard Input, the Standard Output will be redirect to output file.
* To stop the running code, use shortcut `Shift+Enter` or right click the Output Channel and then click `IORun Stop` in context menu.

![Usage](images/usage.gif)
## Configuration

**Make sure the executor PATH of each language is set in the environment variable.**
You could also add entry into 
* `io-run.executorMap.common` (Common/Linux)
* or `io-run.executorMap.darwin` (MacOS) 
* or `io-run.executorMap.win32` (Windows)

to set the compile/run/cleanup command of your executor.

e.g. To set the executor PATH for C++, Java and Python:
```json
"io-run.executorMap.common": {
    ".cpp": {
      "compileCmd": "g++ -g -O2 -std=gnu++11 -Wfatal-errors ${codeFile} -o ${codeFileNoExt}",
      "runCmd": "${dirCodeFileNoExt} <${inputFile} >${outputFile}",
      "cleanupCmd": "rm ${codeFileNoExt}",
      "errorTracer": "gdb"
    },
    ".java": {
      "compileCmd": "javac -encoding UTF-8 ${codeFile}",
      "runCmd": "java ${codeFileNoExt} <${inputFile} >${outputFile}",
      "cleanupCmd": "rm ${codeFileNoExt.class}"
    },
    ".py": {
      "runCmd": "python ${codeFile} <${inputFile} >${outputFile}"
    }
}
```
**Supported customized parameters**
  * $dir: The directory of the code file being run
  * $dirCodeFile: The full name of the code file being run
  * $dirCodeFileNoExt: The full name of the code file being run without its extension
  * $codeFile: The base name of the code file being run, that is the file without the directory
  * $codeFileNoExt: The base name of the code file being run without its extension

**Please take care of the back slash and the space in file path of the executor**
  * Back slash: please use `\\`

## Note
  * [Install MinGW](https://github.com/openhoangnc/vscode-io-run/wiki/Install-GNU-C%EF%BC%8B%EF%BC%8B---Compiler-and-config-for-VS-Code-in-Windows) to run C/C++ on Windows 

## Telemetry data
By default, telemetry data collection is turned on to understand user behavior to improve this extension. To disable it, update the settings.json as below:
```json
{
    "io-run.enableAnalytics": false
}
```

## Change Log
See Change Log [here](CHANGELOG.md)

## Issues
Submit the [issues](https://github.com/openhoangnc/vscode-io-run/issues) if you find any bug or have any suggestion.

## Contribution
Fork the [repo](https://github.com/openhoangnc/vscode-io-run) and submit pull requests.
