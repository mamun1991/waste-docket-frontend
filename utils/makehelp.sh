#!/bin/bash
#Step 1 is to save the Google doc Waste Docket Help https://docs.google.com/document/d/1OlxCxPlGPGmp-VrwNg0bAcDoU4C-bVFQApwWDfylGDE/edit as html zip file
#Step 2 is to unzip that file in /public/help folder
#Step 3 is to run makehelp.sh

# Define the path to the HTML file
HTML_FILE="../public/help/WasteDocketHelp.html"

# Step 1: Run prettier on the HTML file
prettier --write "$HTML_FILE"

# Step 2: Modify the src attributes in image tags
sed -i '' 's/src="images\//src="\/help\/images\//g' "$HTML_FILE"

