# FARE Python Online
[![Build Status](https://travis-ci.org/Free-Polito/fare-python-online.svg?branch=master)](https://travis-ci.org/Free-Polito/fare-python-online)
## What

FARE Python Online is a web application to run Python through a web browser.
It's using a set of libraries as depicted below:
* Skulpt
* Codemirror
* Bootstrap
* jQuery
* Tether
* Blob
* File-saver 

The project uses web-pack. 

### How to install

1. Clone the repository locally:  
    `git clone https://github.com/Free-Polito/fare-python-online.git`
2. Install the dependencies:  
    `npm install`
3. Create the `bundle.js` file:  
    `npm run build`
4. Open the HTML file `index.html` in a browser.  
5. Enjoy!


### Contributing

Here is what you should do in order to contribute:

1. Create a Github account if you don't already have one.
2. Create a Fork of this repository -- This will make a clone of the
   repository in your account.  **DO NOT** directly clone this one.  Once
   you've made the fork you will clone the forked version to
   your local machine for development.
3. Check the Trello list for something to do.
4. Follow the instructions above to get the dev environment ready.
5. Fix or add your own features.  Commit and push to your forked version of the
   repository.  When everything is tested and ready to be incorporated into the
   master version make a pull request via GitHub.   
6. Make a Pull Request to get your feature(s) added to the main repository.

Usual git workflow:
1. ` git clone <your_forked_repo>`
2. Resolve the dependencies with `npm install`
3. Build the `bundle.js` with `npm run build`
4. Make your mods
5. Be sure to rebuild with `npm run build` to see the fresh changes.
6. ` git add <modified_file_name>`
7. ` git commit -m "Commit message"`
8. ` git push -u origin master`

This will make your mods available in your newly forked repo.
Once everything is ready, create pull request upstream (against this original
repo).


# Author
libremente:  
surf [AT] libremente [DOT] eu


# TODO
* Finish this README
* Use a linter (see goodparts)
* Write tests
* Pick license


