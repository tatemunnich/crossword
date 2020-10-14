# Crossword Builder

### How to Install Locally

1. Clone in a directory
`git clone https://github.com/tatemunnich/crossword`

2. Install package dependencies `npm install`. If this isn't working, make sure you have [Node](https://nodejs.org/en/download/) installed on your computer.
3. Run using `npm start`

### Host Project on GitHub Pages

1. Navigate to project directory and install GitHub Pages package as a dev-dependency `npm install gh-pages --save-dev`
2. Just above the name in `package.json` file, add the property `"homepage": "http://{username}.github.io/{repo-name}"`
3. In the `scripts` property, above the `"start"` property, add both `"predeploy": "npm run build"` and `"deploy": "gh-pages -d build"`
4. Make sure your project is in a GitHub repository, and then run `npm run deploy` to launch the page
