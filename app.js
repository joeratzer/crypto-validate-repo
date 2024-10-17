const core = require('@actions/core');
const github = require('@actions/github');

const testBody = '{"firstname" : "Jim","lastname" : "Smith", "totalprice" : 111,"depositpaid" : true,"bookingdates" : {"checkin" : "2018-01-01", "checkout" : "2019-01-01" },"additionalneeds" : "Breakfast"}';

const getQuantumResistantDetails = (isQuantumResistant, result) => {

  return {
    isQuantumResistant: isQuantumResistant,
    details: result,
    title: `The repo is ${isQuantumResistant ? '' : 'not'} quantum-resistant`
  }
}

const isQuantumResistant = (apiResponseJson) => {

  if (!apiResponseJson || !Array.isArray(apiResponseJson))
    return false;

  return !apiResponseJson.find(r => r.resistant === false);
}

const processApiResponse = async (response, owner, repo, prNumber, octokit) => {
  
  if (!response.ok) {
    const apiFailedText = 'API call failed';
    octokit.rest.issues.createComment({owner, repo, issue_number: prNumber, prNumber,
      body: `Pull Request #${prNumber} created. ${apiFailedText}`
    });
    core.setFailed(apiFailedText);
  } 
  else {
    const apiResponseJson = await response.json();

    const quantumResistant = isQuantumResistant(apiResponseJson);
    const details = getQuantumResistantDetails(quantumResistant, JSON.stringify(apiResponseJson));
    const fullResponse = JSON.stringify(details);

    octokit.rest.issues.createComment({owner, repo, issue_number: prNumber,
      body: `Pull Request #${prNumber} created. API response: ${fullResponse}`
    });
  }
}

const main = async () => {

  try {
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const prNumber = core.getInput('prNumber', { required: true });
    const token = core.getInput('token', { required: true });
    const validationUrl = core.getInput('validationUrl', { required: true });

    const octokit = new github.getOctokit(token);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: testBody
    };

    await fetch(validationUrl, requestOptions).then(async response => {
      await processApiResponse(response, owner, repo, prNumber, octokit);
    })
    .catch(error => {
      core.setFailed(error.message);
      octokit.rest.issues.createComment({owner, repo, issue_number: prNumber,
        body: `Pull Request #${prNumber} created. But API call failed (${validationUrl}). Error: ${error}`
      });
    });
    
  } catch (error) {
    core.setFailed(error.message);
    core.error(`Error: ${error}. Message: ${error.message}`);
  }
}

main();
