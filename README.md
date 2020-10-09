# LingView 
A web interface for viewing glossed ELAN and FLEx files, optionally with time-synced video and audio. Developed at Brown University as part of the A'ingae Language Documentation initiative, this fork is a generalization of the A'ingae-specific website [here](https://github.com/Designist/Korpus).

Front-end code written with [ReactJS](https://reactjs.org/). 

## Update: FLEx-with-media support
LingView now supports .flextext files as source documents. (Flextext is the format used for exporting a file from ELAN to FLEx or vice versa.) The new format can include timing information and can therefore be displayed with synced audio/video. To start using .flextext files, [update LingView](https://github.com/BrownCLPS/LingView/wiki/Update-LingView).

## Getting Started
To begin using this site, you'll need to have NPM and Node.js installed. Download and run the installer from [NodeJs.org](https://nodejs.org/). Then, clone this repository and run the command:
    `npm install`
    
This will install all the node modules required by our program. 

The first time you use the site, and after each time you make changes, you'll need to rebuild the LingView site. To do so, type the command `npm run quick-build-offline` in the repository's root directory. 

To view the website in your browser, open the `index.html` file.

## Resources

For an overview of the software, its potential uses, and the circumstances and design principles of its creation, see our [paper](http://hdl.handle.net/10125/24916).

For how-to's and troubleshooting, check the [wiki](https://github.com/BrownCLPS/LingView/wiki). 

Using LingView? We'd love to hear from you! You can reach us at [kalinda.pride@gmail.com](mailto:kalinda.pride@gmail.com). 

Stuck? Start by reading our paper, browsing the wiki, and playing around with the software for an hour or two. If those don't solve your problem, [contact us](mailto:kalinda.pride@gmail.com).

Contributors welcome!
