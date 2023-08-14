// const fs = require('fs');
// const yaml = require('js-yaml');
// const core = require('@actions/core');
// const github = require('@actions/github');

// try {
//   const inputText = core.getInput('input-text')
//   console.log('testing', inputText)
// } catch (error) {
//   core.setFailed(error.message);
// }
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const textArray = []

async function run() {
  try {
    textArray.push(core.getInput('input-text'));
    console.log(textArray)
    // const readmeContent = textArray.map(text => `# ${text}`).join('\n\n');
    // fs.writeFileSync('README.md', readmeContent);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
// const yamlText = fs.readFileSync('input.yaml', 'utf8');
// const [yamlData] = yaml.loadAll(yamlText);
// const data = yamlData.texts

// function generateSvg(texts) {
//   let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 50" style="background-color: #00000000;" width="400px" height="50px">\n`;
//   const length = texts.length
//   texts.forEach((text, index) => {
//     const pathId = `path${index}`;
//     const animateId = `d${index}`;
//     const animateBegin = index === 0 ? `0s;d${length - 1}.end` : `d${index - 1}.end`;

//     svgContent += `
//       <path id="${pathId}">
//         <animate id="${animateId}" attributeName="d" begin="${animateBegin}" dur="5000ms" fill="remove" values="m0,25 h0 ; m0,25 h400 ; m0,25 h400 ; m0,25 h0" keyTimes="0;0.8;0.8;1"/>
//       </path>
//       <text font-family="monospace" fill="#36BCF7" font-size="20" dominant-baseline="auto" x="0%" text-anchor="start">
//         <textPath xlink:href="#${pathId}">
//           ${text}
//         </textPath>
//       </text>`;
//   });

//   svgContent += `\n</svg>`;
//   return svgContent;
// }

// const svg = generateSvg(data);
// fs.writeFileSync('readme-typing.svg', svg)
// const readmeContent = fs.readFileSync('README.md', 'utf8');

// const startTag = '<!-- START:readme-typing -->';
// const endTag = '<!-- END:readme-typing -->';

// const startIndex = readmeContent.indexOf(startTag);
// const endIndex = readmeContent.indexOf(endTag);

// if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
//   const updatedReadme = `${readmeContent.substring(0, startIndex + startTag.length)}\n<img src="readme-typing.svg" />\n${readmeContent.substring(endIndex)}`

//   fs.writeFileSync('README.md', updatedReadme);
//   console.log('SVG content added to README.md');
// } else {
//   console.error('Could not locate start and end tags in README.md');
// }

