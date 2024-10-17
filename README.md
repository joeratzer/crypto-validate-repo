# crypto-validate-repo

Crypto-validate another repo, by calling this as an Action.

## Inputs

### `validationUrl`

**Required** The API that does the validation.

## Outputs

A PR comment will be added. The comment will state whether the repo is valid or not.

## Example usage

```yaml
name: Validate a repo

on: 
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  annotate-pr:
    permissions: write-all
    runs-on: ubuntu-latest
    name: Annotates pull request with validation result
    steps:
      - name: Crypto Validate PR
        uses: joeratzer/js-call-in-action@main
        with:
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          prNumber: ${{ github.event.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
          validationUrl: 'YOUR-VALIDATION-API'
```
