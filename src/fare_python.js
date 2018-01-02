// File: farePython.js
// Author: libremente
// Description: This is the webpack's entry point. 

// General imports
var $ = require("jquery");
var CodeMirror = require("codemirror");
global.Tether = require("tether");
require("skulpt");
require("blob");
var FileSaver = require("file-saver");
require("bootstrap");

// Load CSS files
require ('./style.css');
require ('codemirror/lib/codemirror.css');
require ('bootstrap/dist/css/bootstrap.min.css');

// Load python.js file
require ('codemirror/mode/python/python.js');
require ('codemirror/addon/edit/matchbrackets.js');
require ('codemirror/addon/edit/closebrackets.js');

// Wait for jQuery
$(function(){
    // Preliminary operations
    // Globals
    var errorLineMarked = "";
    // Enable CodeMirror
    var area = document.getElementById("pythonInput");
    var editor = CodeMirror.fromTextArea(area, {
        lineNumbers: true,
        mode: "python",
        matchBrackets: true,
        autoCloseBrackets: true
    });

    // Function to style the output of Skulpt 
    function outf(text) { 
        var resultArea = document.getElementById("pythonOutput"); 
        resultArea.innerHTML = resultArea.innerHTML + text; 
    } 

    // Function to read the file
    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }

    // Button event handler
    document.getElementById("btn-runit").onclick = runit;
    document.getElementById("btn-save").onclick = save;
    document.getElementById("btn-clean").onclick = clean;
    
       // Function to run Skulpt called by the "run" button in the HTML
    function runit() { 
        
        // Check if there is a line marked
        if(errorLineMarked !== ""){
            editor.removeLineClass(errorLineMarked, "background", "line-error");
        }

        var prog = editor.getValue();
        var resultArea = document.getElementById("pythonOutput"); 
        resultArea.innerHTML = ''; 
        // Skulpt configuration
        Sk.pre = "pythonOutput";
        Sk.configure({
           output:outf, 
           read:builtinRead,
           python3:true,
           inputfunTakesPrompt: true,
        }); 

        // Run promise
        var myPromise = Sk.misceval.asyncToPromise(function() {
           return Sk.importMainWithBody("<stdin>", false, prog, true);
        });

        // Vars for the results.
        var gres = $('#goodresult');
        var bres = $('#badresult');
 
        // Promise 'then'
        myPromise.then(function(mod) {
            // Success case         
            toggleVisibility(gres, bres);
            // Check if result is blank
            if(resultArea.innerHTML === ""){
                resultArea.innerHTML = "Sembra che non ci sia nulla in output.\n"+
                    "Controlla di avere almeno una <i>print</i>!";
            }
            else{
                resultArea.innerText = "Risultato: \n" + resultArea.innerText;
            }
            errorLineMarked = "";
       },
        function(err) {
            // Error case
            toggleVisibility(bres, gres);
            var error = err.toString();
            // Get "line #" from error
            var regExp = /line [0-9]/;
            var errorLine = error.substring(error.search(regExp), error.length);
            // Extract tokens array[0] = "line", array[1] = <my_number>
            var errorArray = errorLine.split(" ");
            var errorLineNumber = Number(errorArray[1].replace(/(\r\n|\n|\r|\^)/gm,"")) - 1;       
            
            // Setting background color to red on the line with error
            while(editor.getLine(errorLineNumber) == null){
              errorLineNumber = errorLineNumber - 1;
            }
            
            errorLineMarked = editor.addLineClass(errorLineNumber, 'background', 'line-error');
            var defErrorText = "";
            // Check if illegal function are used as e.g. "input"
            var inputRegExp = /input/;
            if(editor.getLine(errorLineNumber).search(inputRegExp) != -1){
                defErrorText = "Forse hai utilizzato la funzione <input()> che non è ancora supportata.\n"; 
            }
            // Print error
            defErrorText = defErrorText + "Errore riscontrato nel codice a linea ";
            resultArea.innerText = defErrorText + (errorLineNumber+1) + ".\n" + error;
            
       });
    } 

    // Function to toggle the visibility of the messages.
    function toggleVisibility(toShow, toHide){
       if(toShow.is(":hidden")){
            toShow.show(); 
        }
        if(toHide.is(":visible")){
            toHide.hide();  
        }
    }

    // Function to clear the input
    function clean(){
        editor.setValue("# Inserire il codice sorgente.\n");
    }

    // Function save to save the file
    function save(){ 
      //var text = $("#yourcode").val();
      var prelude = "# Nome: Programma\n# Autore:www.fare.polito.it\n#" +
        "Descrizione: aggiungi qui la descrizione\n"; 
      var text = prelude + editor.getValue();

      var filename = "Programma"; 
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, filename+".py");
    }
});
