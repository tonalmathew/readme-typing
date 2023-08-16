/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/typing.js
const core = __nccwpck_require__(450);
const github = __nccwpck_require__(177);

async function run() {
  try {
    const INPUT_TEXT = core.getInput('INPUT_TEXT');
    const COMMITTER_NAME = core.getInput('COMMITTER_NAME');
    const COMMITTER_EMAIL = core.getInput('COMMITTER_EMAIL');
    const COLOR = core.getInput('COLOR');
    const textArray = INPUT_TEXT.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const generateSvg = (texts) => {
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 50" style="background-color: #00000000;" width="400px" height="50px">\n`;
      const length = texts.length
      texts.forEach((text, index) => {
        const pathId = `path${index}`;
        const animateId = `d${index}`;
        const animateBegin = index === 0 ? `0s;d${length - 1}.end` : `d${index - 1}.end`;

        svgContent += `
          <path id="${pathId}">
            <animate id="${animateId}" attributeName="d" begin="${animateBegin}" dur="5000ms" fill="remove" values="m0,25 h0 ; m0,25 h400 ; m0,25 h400 ; m0,25 h0" keyTimes="0;0.8;0.8;1"/>
          </path>
          <text font-family="monospace" fill="${COLOR}" font-size="20" dominant-baseline="auto" x="0%" text-anchor="start">
            <textPath xlink:href="#${pathId}">
              ${text}
            </textPath>
          </text>`;
      });

      svgContent += `\n</svg>`;
      return svgContent;
    }

    const svg = generateSvg(textArray);
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const repo = github.context.repo;

    const checkIfSvgFileExists = async () => {
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: repo.owner,
          repo: repo.repo,
          path: 'readme-typing.svg',
        });
        if (fileData) {
          console.log('readme-typing.svg exists.');
          return {
            fileExist: true,
            sha: fileData.sha
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('readme-typing.svg file needs to be created.');
          return {
            fileExist: false,
            sha: null
          }
        } else {
          console.error('Error checking if readme-typing.svg file exists:', error);
        }
      }
    };

    const { fileExist, sha } = await checkIfSvgFileExists();

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: repo.owner,
      repo: repo.repo,
      path: 'readme-typing.svg',
      message: 'create readme-typing.svg',
      content: Buffer.from(svg).toString('base64'),
      committer: {
        name: COMMITTER_NAME,
        email: COMMITTER_EMAIL
      },
      sha: fileExist && sha
    });

    const { data: readmeData } = await octokit.rest.repos.getContent({
      owner: repo.owner,
      repo: repo.repo,
      path: 'README.md',
    });
    const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');

    const startTag = '<!-- START:readme-typing -->';
    const endTag = '<!-- END:readme-typing -->';

    const startIndex = readmeContent.indexOf(startTag);
    const endIndex = readmeContent.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const updatedReadme = `${readmeContent.substring(0, startIndex + startTag.length)}\n<img src="readme-typing.svg" />\n${readmeContent.substring(endIndex)}`

      await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.repo,
        path: 'README.md',
        message: 'Update README with svg text',
        content: Buffer.from(updatedReadme).toString('base64'),
        committer: {
          name: COMMITTER_NAME,
          email: COMMITTER_EMAIL
        },
        sha: readmeData.sha
      });

      console.log('SVG content added to README.md');
    } else {
      console.error('Could not locate start and end tags in README.md');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

;// CONCATENATED MODULE: ./src/index.js


run()
})();

module.exports = __webpack_exports__;
/******/ })()
;