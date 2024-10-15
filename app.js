const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {

  try {

    const whatToCall = core.getInput('what-to-call');
    
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
    //console.log(`The event payload: ${payload}`);

    const apiUrl = 'https://restful-booker.herokuapp.com/booking/1';

    // Make a GET request
    await fetch(apiUrl).then(async response => {
      if (!response.ok) {
        console.error('Network response was not ok');
      } 
      else {
        var jsonResponse = response.json();
        console.log(`Pull Request created. API response: ${JSON.stringify(jsonResponse)}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();