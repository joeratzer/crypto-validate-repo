const core = require('@actions/core');
const github = require('@actions/github');

const getQuantumResistantDetails = async (isQuantumResistant, result) => {
  return {
    isQuantumResistant: isQuantumResistant,
    details: result,
    title: `The repo is ${isQuantumResistant ? '' : 'not'} quantum-resistant`
  }
}

const isQuantumResistant = async (apiResponseJson) => {
  if (!apiResponseJson)
    return false;

  return !apiResponseJson.find(r => r.resistant === false);
}

const main = async () => {

  try {
    
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const pr_number = core.getInput('pr_number', { required: true });
    const token = core.getInput('token', { required: true });
    const validationUrl = core.getInput('validationUrl', { required: true });

    const octokit = new github.getOctokit(token);

    await fetch(validationUrl).then(async response => {
      if (!response.ok) {
        console.error('Network response was not ok');
        octokit.rest.issues.createComment({owner, repo, issue_number: pr_number,
          body: `Pull Request #${pr_number} created. But API call failed`
        });
      } 
      else {
        let apiResponseJson = await response.json();

        const quantumResistant = await isQuantumResistant(apiResponseJson);
        let details = await getQuantumResistantDetails(quantumResistant, JSON.stringify(apiResponseJson));
        details = JSON.stringify(details);

        octokit.rest.issues.createComment({owner, repo, issue_number: pr_number,
          body: `Pull Request #${pr_number} created. API response: ${details}`
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      octokit.rest.issues.createComment({owner, repo, issue_number: pr_number,
        body: `Pull Request #${pr_number} created. But API call failed`
      });
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();