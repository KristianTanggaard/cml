const fs = require('fs').promises;
const kebabcaseKeys = require('kebabcase-keys');
const CML = require('../../src/cml').default;

exports.command = 'send-github-check <markdown file>';
exports.description = 'Create a check report';

exports.handler = async (opts) => {
  const path = opts.markdownfile;
  const report = await fs.readFile(path, 'utf-8');
  const cml = new CML({ ...opts });
  await cml.checkCreate({ ...opts, report });
};

exports.builder = (yargs) =>
  yargs.env('CML_SEND_GITHUB_CHECK').options(
    kebabcaseKeys({
      commitSha: {
        type: 'string',
        alias: 'head-sha',
        description: 'Commit SHA linked to this comment. Defaults to HEAD.'
      },
      conclusion: {
        type: 'string',
        choices: [
          'success',
          'failure',
          'neutral',
          'cancelled',
          'skipped',
          'timed_out'
        ],
        default: 'success',
        description: 'Sets the conclusion status of the check.'
      },
      title: {
        type: 'string',
        default: 'CML Report',
        description: 'Sets title of the check.'
      },
      repo: {
        type: 'string',
        description:
          'Specifies the repo to be used. If not specified is extracted from the CI ENV.'
      },
      token: {
        type: 'string',
        description:
          'Personal access token to be used. If not specified in extracted from ENV REPO_TOKEN.'
      }
    })
  );
