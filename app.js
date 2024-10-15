const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {

  try {

    const whatToCall = core.getInput('what-to-call');
    console.log(`Calling: ${whatToCall}!`);
    
    const time = (new Date()).toTimeString();
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const pr_number = core.getInput('pr_number', { required: true });
    const token = core.getInput('token', { required: true });

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);

    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const apiUrl = 'https://restful-booker.herokuapp.com/booking/1';

    let apiResponse = '';
    // Make a GET request
    fetch(apiUrl).then(response => {
      if (!response.ok) {
        console.error('Network response was not ok');
      }
      apiResponse = response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    /**
     * Create a comment on the PR with the information we compiled from the
     * list of changed files.
     */
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pr_number,
      body: `Pull Request #${pr_number} has been created. Payload: \n
        - ${payload} \n
        - API response \n
        - ${apiResponse}`
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();