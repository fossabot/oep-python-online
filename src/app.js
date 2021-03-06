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

// Load CSS files
require('./style.css');
require('codemirror/lib/codemirror.css');

// eslint-disable-next-line no-undef
if (typeof (fare) !== 'undefined' && fare === false) {
  require('bootstrap');
  require('bootstrap/dist/css/bootstrap.min.css');
}

// Load python.js file
require('codemirror/mode/python/python.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/edit/closebrackets.js');

// Wait for jQuery
$(function () {
  // Preliminary operations
  // Get variables from config.js
  // eslint-disable-next-line no-undef
  var book_var = book;
  // eslint-disable-next-line no-undef
  var save_var = saveit;
  // eslint-disable-next-line no-undef
  var ex_var = exercises;
  // eslint-disable-next-line no-undef
  var turtle_var = turtle;
  // eslint-disable-next-line no-undef
  var robot_var = robot;
  // General purpose vars.
  var errorLineMarked = '';
  var pdfEnabled = false;
  // Enable CodeMirror
  var area = document.getElementById('pythonInput');
  var editor = CodeMirror.fromTextArea(area, {
    lineNumbers: true,
    mode: 'python',
    matchBrackets: true,
    autoCloseBrackets: true
  });

  // Function to clear the input
  function clean () {
    editor.setValue('# Inserire il codice sorgente.\n');
    $('#message')
      .removeClass('alert alert-danger alert-success w-100')
      .html('');
    $('#pythonOutput').html('');
  }

  // Function save to save the file
  function save () {
    var prelude = '# Nome: Programma\n# Autore:www.fare.polito.it\n#'
            + 'Descrizione: aggiungi qui la descrizione\n';
    var text = prelude + editor.getValue();
    var filename = 'Programma';
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, filename + '.py');
  }

  // Function to load a Python file into the code area
  function openPython (fileNumber) {
    var xhttp = new XMLHttpRequest();
    var filePath = 'Programmi_v3/' + fileNumber + '.py';

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        editor.setValue(this.responseText);
      }
    };

    xhttp.open('GET', filePath, true);
    xhttp.send();
  }

  // Function to style the output of Skulpt.
  function outf (text) {
    var resultArea = document.getElementById('pythonOutput');

    resultArea.innerHTML += text;
  }

  // Function to output messages.
  function outputMessage (result, message) {
    if (result === 'OK') {
      $('#message')
        .html(message)
        .addClass('alert alert-success w-100')
        .removeClass('alert-danger');
    } else if (result === 'KO') {
      $('#message')
        .html(message)
        .addClass('alert alert-danger w-100')
        .removeClass('alert-success');
    }
  }
  // Function to output the result.
  function outputResultSuccess (resArea) {
    var result;

    if (!resArea) {
      result = 'Sembra che non ci sia nulla in output.\n'
      + 'Controlla di avere almeno una print!';
    } else {
      result = 'Risultato: \n' + resArea;
    }
    errorLineMarked = '';

    return result;
  }

    // Function to read the file
  function builtinRead (x) {
    if (typeof Sk.builtinFiles === 'undefined' || typeof
      Sk.builtinFiles.files[x] === 'undefined') {
      throw new Error('File not found: ' + x);
    }

    return Sk.builtinFiles.files[x];
  }

  // Function to check illegal functions.
  function checkLegal (line) {
    var inputRegExp = /input/;

    if (line.search(inputRegExp) !== -1) {
      return true;
    }

    return false;
  }

  // Function to check line marked.
  function checkLineMarked () {
    // Check if there is a line marked
    if (errorLineMarked !== '') {
      editor.removeLineClass(errorLineMarked, 'background', 'line-error');
    }
  }

  // Function to handle the error case.
  function outputResultError (resultArea, errorMessage, sourceCode) {
    // Grab the error line
    var result = '';
    var error = errorMessage.toString();
    var regExp = /line [0-9]/;
    var errorLine = error.substring(error.search(regExp),
      error.length);
    // Extract tokens array[0] = "line", array[1] = <my_number>
    var errorArray = errorLine.split(' ');
    var errorLineNumber
          = Number(errorArray[1].replace(/(\r\n|\n|\r|\^)/gm, ''))
          - 1;
    var defErrorText = '';

    // Setting background color to red on the line with error
    while (sourceCode.getLine(errorLineNumber) === null) {
      errorLineNumber -= errorLineNumber;
    }
    errorLineMarked = sourceCode.addLineClass(errorLineNumber,
        'background', 'line-error');

    if (checkLegal(sourceCode.getLine(errorLineNumber))) {
      defErrorText = 'Forse hai utilizzato la funzione <input()> che '
        + 'non è ancora supportata.\n';
    }
    defErrorText += 'Errore riscontrato nel codice a linea ';
    result = defErrorText + (errorLineNumber + 1) + '.\n' + error;

    return result;
  }

  // Function to make a POST request to the REST API server
  function postJS () {
    var resultArea = document.getElementById('pythonOutput');
    var http = new XMLHttpRequest();
    // eslint-disable-next-line no-undef
    var post_url = postUrl;

    $('#frame').css('visibility', 'visible');
    // Change URL
    if (typeof (post_url) !== 'undefined') {
      // Get textarea value
      var params = editor.getValue();

      http.open('POST', post_url, true);

      // Send the proper header information along with the request
      http.setRequestHeader(
        'Content-type', 
        'application/x-www-form-urlencoded'
      );

      http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
          console.log(http.responseText);
          resultArea.innerText += http.responseText;
        }
      };
      http.send(params);
    } else {
      console.log('Configure proper url in the config.json file and rebuild');
    }
  }

  function openPdf () {
    if (!pdfEnabled) {
      // Creating div to prepend.
      $('#main-zone').prepend(
        $('<div><embed id="pdf" src="../files/example.pdf"></div>')
        .attr('id', 'divPdf')
        .addClass('col-md-8')
      );
      $('#pdf').css({
        width: '750px',
        height: '700px'
      });
      $('#main-col').append($('#divOutput'));
      $('#divOutput')
        .addClass('mt-3')
        .css('height', '300px');
      $('#btn-pdf').text('Rimuovi libro');
      pdfEnabled = true;
    } else {
      $('#divPdf').remove();
      $('#main-zone').append($('#divOutput'));
      $('#divOutput').removeClass('mt-3');
      $('#btn-pdf').text('Sfoglia libro');
      pdfEnabled = false;
    }
  }

  // Function to run Skulpt called by the "run" button in the HTML
  function runit () {
    var prog = editor.getValue();
    var resultArea = document.getElementById('pythonOutput');
    // Vars for the results.
    var myPromise;

    checkLineMarked();
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

    // Promise 'then'.
    myPromise.then(
      function () {
        // Success case.
        outputMessage('OK', 'Programma senza errori! Controlla il risultato.');
        resultArea.innerText = outputResultSuccess(resultArea.innerText);
      },

      function (err) {
        // Error case.
        outputMessage('KO', 'Il programma presenta errori! Correggili.');
        resultArea.innerText = outputResultError(resultArea.innerText, err,
          editor);
      });
  }

  // Button event handler
  // Standard ones
  document.getElementById('btn-runit').onclick = runit;
  document.getElementById('btn-clean').onclick = clean;

  // Depend on config. Have to add the es-linter exclusion rule
  // eslint-disable-next-line no-undef
  if (typeof (book_var) !== 'undefined') {
    var btn_pdf = document.getElementById('btn-pdf');

    // Check that element exists in the page.
    if (btn_pdf !== null) {
      if (book_var === true) {
        btn_pdf.onclick = openPdf;
      } else {
        document.getElementById('btn-pdf').style.display = 'none';
      }
    }
  }

  if (typeof (robot_var) !== 'undefined') {
    var btn_post = document.getElementById('btn-post');
    var div_camera = document.getElementById('camera-output');

    if (btn_post !== null && div_camera !== null) {
      if (robot_var === true) {
        btn_post.onclick = postJS;
      } else {
        btn_post.style.display = 'none';
        div_camera.style.display = 'none';
      }
    }
  }

  if (typeof (turtle_var) !== 'undefined') {
    var div_turtle = document.getElementById('turtle-output');

    if (div_turtle !== null) {
      if (turtle_var === true) {
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
      } else {
        div_turtle.style.display = 'none';
      }
    }
  }


  if (typeof (save_var) !== 'undefined') {
    var btn_save = document.getElementById('btn-save');

    if (btn_save !== null) {
      if (save_var === true) {
        btn_save.onclick = save;
      } else {
        btn_save.style.display = 'none';
      }
    }
  }

  if (typeof (ex_var) !== 'undefined') {
    if (ex_var === true) {
      // Check which button has been fired
      $('button').click(function () {
        // eslint-disable-next-line no-invalid-this
        var fired_button = $(this).val();

        if (fired_button.indexOf('Modulo') !== -1) {
          openPython(fired_button);
        }
      });
    } else {
      var drop_down = document.getElementById('dropDown');

      if (drop_down !== null) {
        drop_down.style.display = 'none';
      }
    }
  }
});
