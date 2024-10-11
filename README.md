# js-call-in-action

# Call JS from an Action

This action prints "Action called:" + the name of a thing being called to the log.

## Inputs

### `what-to-call`

**Required** The name of the thing being called. Default `"HelloWorld"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/js-call-in-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  what-to-call: 'Hello World'
```
