# Slack API command tool

This is a simple tool to get access to [Slack API](https://api.slack.com/methods) with shell command.  
This tool only uses the URL query parameters. As a result, this tool is not able to post big data. All the results are then output to the standard output as JSON and can be processed with the jq command and so on. In addition, you can also process the API cursors to create an array JSON that combines all the resulting JSONs together.

# How to use (with bash)

Please install Node.js (Upper v12.0.0)

```
npm install
npm run build
chmod +x dist/index.js
npm link
export SLACK_TOKEN=xoxb-9999999999999-9999999999999-xxxxxxxxxxxxxxxxxxxxxx
slack-api-command {httpmethod} {apiname} --args1 hogehoge --args2 fugafuga
```

# Example

### Get users

```
node dist/index.js get users.list --limit 10
```

### Get users with cursor

```
node dist/index.js get users.list --cursor dXNlcjpVMDYxTkZUVDI= --limit 10
```

### Post message

```
node dist/index.js post chat.postMessage --channel CLFH073PU --text "Hello!"
```

# Auto cursor mode

"Auto cursor mode" helps to get all of responses in Slack with cursor.

```
export SLACK_COMMAND_AC_SLEEP=500
node dist/index.js get users.list autocursor --limit 100
```

SLACK_COMMAND_AC_SLEEP is sleep time msec interval for continuous accesses.  
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

### channel name and num members.

```
node dist/index.js get conversations.list autocursor --limit 1000 --exclude_archived true --types public_channel > channels.json
cat channels.json | jq ' .[] | .channels[] | [.name, .num_members] | @csv' > channels.csv
cat channels.csv | grep programming
```

# LICENSE

MIT
