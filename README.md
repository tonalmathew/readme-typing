<h3 align="center">Typing - Readme SVG Text</h3>
<p align="center">
<!-- START:readme-typing -->
<img src="readme-typing.svg" />
<!-- END:readme-typing -->
</p>
<p align="center">Update your readme with SVG typing texts.</p>

</div>

## Instructions

- Add this comment in your `README.md` file

  ```
  <!-- START:readme-typing --> 
  <!-- END:readme-typing -->
  ``` 
  > you can find an example [here](https://github.com/tonalmathew/tonalmathew)

- Create a workflow file

  `.github/workflows/readme-typing.yml`

  ```yml
  name: Readme - svg text
  on:
    workflow_dispatch:
  jobs:
    update-readme:
      runs-on: ubuntu-latest
      steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Run the action
        uses: tonalmathew/readme-typing@main
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
        with:
          input-text: |
            Hello, from svg typing.
            Add more text line by line.
  ```

- The above job won't run automatically, you need to run the job manually from the actions tab.

### Override defaults

Use the following input params to customize it for your use case:-

| Input Param       | Default Value                                         | Description                                               |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| `COMMITTER_NAME`  | github-actions[bot]                                   | Name of the committer                                     |
| `COMMITTER_EMAIL` | 41898282+github-actions[bot]@users.noreply.github.com | Email of the committer                                    |
| `COLOR`           | #36BCF7                                               | Color of the text                                         |
| `TEXT_ALIGN`      | start                                                 | Align the svg text position                               |


_An alternative method for [DenverCoder1/readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)_
