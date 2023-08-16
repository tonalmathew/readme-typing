const core = require('@actions/core');
const github = require('@actions/github');

export async function run() {
  try {
    const INPUT_TEXT = core.getInput('INPUT_TEXT');
    const COMMITTER_NAME = core.getInput('COMMITTER_NAME');
    const COMMITTER_EMAIL = core.getInput('COMMITTER_EMAIL');
    const COLOR = core.getInput('COLOR');
    const TEXT_ALIGN = core.getInput('TEXT_ALIGN');
    const textArray = INPUT_TEXT.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const generateSvg = (texts) => {
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 50" style="background-color: #00000000;" width="400px" height="50px">\n`;
      const length = texts.length
      texts.forEach((text, index) => {
        const pathId = `path${index}`;
        const animateId = `d${index}`;
        const animateBegin = index === 0 ? `0s;d${length - 1}.end` : `d${index - 1}.end`;
        let db, x, ta
        if(TEXT_ALIGN === 'start'){
          db = 'auto'
          x=0
          ta='start'
        } else if(TEXT_ALIGN === 'center') {
          db = 'start'
          x=50
          ta='start'
        }

        svgContent += `
          <path id="${pathId}">
            <animate id="${animateId}" attributeName="d" begin="${animateBegin}" dur="5000ms" fill="remove" values="m0,25 h0 ; m0,25 h400 ; m0,25 h400 ; m0,25 h0" keyTimes="0;0.8;0.8;1"/>
          </path>
          <text font-family="monospace" fill="${COLOR}" font-size="20" dominant-baseline="${db}" x="${x}%" text-anchor="${ta}">
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
