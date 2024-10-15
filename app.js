const core = require('@actions/core');
const github = require('@actions/github');

/**
 * Now we need to create an instance of Octokit which will use to call
 * GitHub's REST API endpoints.
 * We will pass the token as an argument to the constructor. This token
 * will be used to authenticate our requests.
 * You can find all the information about how to use Octokit here:
 * https://octokit.github.io/rest.js/v18
 **/
const octokit = new github.getOctokit(token);

try {

  const whatToCall = core.getInput('what-to-call');
  console.log(`Calling: ${whatToCall}!`);
  
  const time = (new Date()).toTimeString();
  const owner = core.getInput('owner', { required: true });
  const repo = core.getInput('repo', { required: true });
  const pr_number = core.getInput('pr_number', { required: true });

  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  /**
   * Create a comment on the PR with the information we compiled from the
   * list of changed files.
   */
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pr_number,
    body: `
      Pull Request #${pr_number} has been updated with: \n
      - ${diffData.changes} changes \n
      - ${diffData.additions} additions \n
      - ${diffData.deletions} deletions \n
    `
  });
  
} catch (error) {
  core.setFailed(error.message);
}
