# FARE Python Online
[![Build Status](https://travis-ci.org/Free-Polito/fare-python-online.svg?branch=master)](https://travis-ci.org/Open-Education-Polito/oep-python-online)
[![conduct](https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-green.svg?style=flat-square)](http://contributor-covenant.org/version/1/4/)
[![AGPL License](http://img.shields.io/badge/license-AGPL%20v3-red.svg?style=flat-square)](https://www.gnu.org/licenses/agpl-3.0.en.html) 
[![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts")
[![Maintainability](https://api.codeclimate.com/v1/badges/6fd5305f516d8ecc8da1/maintainability)](https://codeclimate.com/github/Free-Polito/fare-python-online/maintainability)
## What

FARE Python Online is a web application to run Python 3.x by means of a web
browser interface.
It presents a menu and two columns, one for inserting the source code and the
other one to see the results. 
If errors occur, a notice is shown and the relative line is underlined in red.

### How to install
1. Download and unpack the latest release
   [here](https://github.com/Free-Polito/fare-python-online/releases)
2. Enter the folder and install the dependencies:  
   `npm install`.   
   This will automagically also create the `bundle.js` file by running `npm run
   build`.
   It also runs the `postinstall.sh` BASH script which clones the
   [exercises](https://github.com/Open-Education-Polito/oep-esercizi-python)
   repository allowing to have the complete experience. 
   repo.
4. Open the HTML file `dist/index.html` in a browser.  
5. Enjoy!

## Licensing
The whole project is licensed under a GNU AGPL v3.0 license. See `LICENSE` file
for more details. 

### Dependencies
This project uses a set of libraries as depicted below:
* Skulpt
* Codemirror
* Bootstrap
* jQuery
* Tether
* Blob
* File-saver 
* Webpack  

Their relative licenses are listed below.

#### Third Party Licensing
```
The MIT License (MIT)

Copyright (c) 2011-2017 Twitter, Inc. (Bootstrap)
Copyright (c) 2011-2017 The Bootstrap Authors (Bootstrap)
Copyright (C) 2017 by Marijn Haverbeke <marijnh@gmail.com> and others
(Codemirror)
Copyright JS Foundation and other contributors, https://js.foundation/ (jQuery,
Webpack)
Copyright (c) 2014-2017 HubSpot, Inc. (Tether)
Copyright © 2016 Eli Grey (File-Saver, Blob)
Copyright (c) 2009-2016 Scott Graham and contributors to the Skulpt Project
(Skulpt)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Contributing
This project follows the [Contributor
Covenant](https://www.contributor-covenant.org/) code of conduct.

For any request or problem file an issue on GitHub. 

Please check `CONTRIBUTING.md` file to know how to contribute.

## TODO
* Refactor code into different files
* Write consistent tests

### Author and Maintainer
libremente: <surf [AT] libremente [DOT] eu>
