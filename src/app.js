/*
 *  FARE Python Online - Write and execute Python scripts online
 *   Copyright (C) 2018 libremente <surf@libremente.eu>

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.

 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// Use Strict
'use strict';

// General imports
var $ = require('jquery');
var CodeMirror = require('codemirror');
var FileSaver = require('file-saver');
var Sk = require('skulpt');

global.Tether = require('tether');
require('blob');
require('bootstrap');

// Load CSS files
require('./style.css');
require('codemirror/lib/codemirror.css');
require('bootstrap/dist/css/bootstrap.min.css');

// Load python.js file
require('codemirror/mode/python/python.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/edit/closebrackets.js');

// Wait for jQuery
$(function () {
  // Preliminary operations
  // Globals
  var errorLineMarked = '';
  // Enable CodeMirror
  var area = document.getElementById('pythonInput');
  var editor = CodeMirror.fromTextArea(area, {
    lineNumbers: true,
    mode: 'python',
    matchBrackets: true,
    autoCloseBrackets: true
  });

  // Function to output messages.
  function outputMessage (result, message) {
    if (result === 'OK') {
      $('#message').html(message);
      $('#message').addClass('alert alert-success w-100')
        .removeClass('alert-danger');
    } else if (result === 'KO') {
      $('#message').html(message);
      $('#message').addClass('alert alert-danger w-100')
        .removeClass('alert-success');
    }
  }

  // Function to clear the input
  function clean () {
    editor.setValue('# Inserire il codice sorgente.\n');
    $('#message').removeClass('alert alert-danger alert-success w-100')
      .html('');
    $('#pythonOutput').html('');
  }

  // Function save to save the file
  function save () {
    // var text = $("#yourcode").val();
    var prelude = '# Nome: Programma\n# Autore:www.fare.polito.it\n#'
            + 'Descrizione: aggiungi qui la descrizione\n';
    var text = prelude + editor.getValue();
    var filename = 'Programma';
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, filename + '.py');
  }

  // Function to style the output of Skulpt
  function outf (text) {
    var resultArea = document.getElementById('pythonOutput');

    resultArea.innerHTML += text;
  }

    // Function to read the file
  function builtinRead (x) {
    if (typeof Sk.builtinFiles === 'undefined' || typeof
      Sk.builtinFiles.files[x] === 'undefined') {
      throw new Error('File not found: ' + x);
    }

    return Sk.builtinFiles.files[x];
  }

  // Function to run Skulpt called by the "run" button in the HTML
  function runit () {
    var prog = editor.getValue();
    var resultArea = document.getElementById('pythonOutput');
    // Vars for the results.
    var myPromise;

    // Check if there is a line marked
    if (errorLineMarked !== '') {
      editor.removeLineClass(errorLineMarked, 'background', 'line-error');
    }

    resultArea.innerHTML = '';
    // Skulpt configuration
    Sk.pre = 'pythonOutput';
    Sk.configure({
      output: outf,
      read: builtinRead,
      python3: true,
      inputfunTakesPrompt: true
    });

    // Run promise
    myPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody('<stdin>', false, prog, true);
    });

    // Promise 'then'
    myPromise.then(
      function () {
        // Success case
        outputMessage('OK', 'Programma senza errori! Controlla il risultato.');
        // Check if result is blank
        if (resultArea.innerHTML === '') {
          resultArea.innerHTML = 'Sembra che non ci sia nulla in output.\n'
          + 'Controlla di avere almeno una <i>print</i>!';
        } else {
          resultArea.innerText = 'Risultato: \n' + resultArea.innerText;
        }
        errorLineMarked = '';
      },

      function (err) {
        // Error case
        var error = err.toString();
        // Get "line #" from error
        var regExp = /line [0-9]/;
        var errorLine = error.substring(error.search(regExp),
          error.length);
        // Extract tokens array[0] = "line", array[1] = <my_number>
        var errorArray = errorLine.split(' ');
        var errorLineNumber
              = Number(errorArray[1].replace(/(\r\n|\n|\r|\^)/gm, ''))
              - 1;
        var defErrorText = '';
        var inputRegExp = /input/;

        outputMessage('KO', 'Il programma presenta errori! Correggili.');

        // Setting background color to red on the line with error
        while (editor.getLine(errorLineNumber) === null) {
          errorLineNumber -= errorLineNumber;
        }

        errorLineMarked = editor.addLineClass(errorLineNumber,
            'background', 'line-error');
        // Check if illegal function are used as e.g. "input"
        if (editor.getLine(errorLineNumber).search(inputRegExp) !== -1) {
          defErrorText = 'Forse hai utilizzato la funzione <input()> che '
            + 'non è ancora supportata.\n';
        }
        // Print error
        defErrorText += 'Errore riscontrato nel codice a linea ';
        resultArea.innerText = defErrorText + (errorLineNumber + 1)
              + '.\n' + error;
      });
  }
  // Button event handler
  document.getElementById('btn-runit').onclick = runit;
  document.getElementById('btn-save').onclick = save;
  document.getElementById('btn-clean').onclick = clean;
});
