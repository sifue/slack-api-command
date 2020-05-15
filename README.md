# Slack API command tool

This is a simple tool to get access to [Slack API](https://api.slack.com/methods/) with shell command.
This tool use only URL query parameter. This tool can't post big data.
Only standard output is used.

# How to use (with bash)

Please install Node.js (Upper v12.0.0)

```
npm install
npm run build
export SLACK_TOKEN=xoxb-9999999999999-9999999999999-xxxxxxxxxxxxxxxxxxxxxx
node dist/index.js {httpmethod} {apiname} --args1 hogehoge --args2 fugafuga
```

# Example

### Get users

```
node dist/index.js get users.list --limit 10
```

### Get users with cursor

```
export SLACK_COMMAND_AC_SLEEP=500
node dist/index.js get users.list --cursor dXNlcjpVMDYxTkZUVDI= --limit 10
```

SLACK_COMMAND_AC_SLEEP is sleep time msec interval for continuous accesses.

### Post message

```
node dist/index.js post chat.postMessage --channel CLFH073PU --text "Hello!"
```

# Auto cursor mode

Auto cursor help to get all of responses in Slack with cursor.

```
node dist/index.js get users.list autocursor --limit 100
```

Output is Array JSON of response.data.

# Use with [jq](https://stedolan.github.io/jq/) command

### Fomat JSON

```
node dist/index.js get users.list --limit 10 | jq .
```

### Only ids

```
node dist/index.js get users.list --limit 10 | jq '.members[].id'
```
