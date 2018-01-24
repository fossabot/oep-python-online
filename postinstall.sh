#!/bin/bash

# Enter dist folder, clone the exercises repo and then clean
cd dist
git clone git@github.com:Open-Education-Polito/oep-esercizi-python.git
cp -r oep-esercizi-python/Programmi_v3 . 
rm -rf oep-esercizi-python
