/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 190:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 66:
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
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(190);
const github = __nccwpck_require__(66);

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

const processApiResponse = async (response, owner, repo, prNumber) => {
  if (!response.ok) {
    const apiFailedText = 'API call failed';
    octokit.rest.issues.createComment({owner, repo, issue_number: prNumber, prNumber,
      body: `Pull Request #${prNumber} created. ${apiFailedText}`
    });
    core.setFailed(apiFailedText);
  } 
  else {
    let apiResponseJson = await response.json();

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
    const prNumber = core.getInput('pr_number', { required: true });
    const token = core.getInput('token', { required: true });
    const validationUrl = core.getInput('validationUrl', { required: true });

    const octokit = new github.getOctokit(token);

    await fetch(validationUrl).then(async response => {
      await processApiResponse(response, owner, repo, prNumber);
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

module.exports = __webpack_exports__;
/******/ })()
;