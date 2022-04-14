// Slack API methdos https://api.slack.com/methods

import axios from 'axios';
import minimist from 'minimist';
import querystring from 'querystring';

const SLACK_API_URL_BASE = 'https://slack.com/api/';

if (!process.env.SLACK_TOKEN) {
  console.log(
    'Please set SLACK_TOKEN env parm. e.g. export SLACK_TOKEN=xoxb-9999999999999-9999999999999-xxxxxxxxxxxxxxxxxxxxxx'
  );
  process.exit(1);
}
const argv = minimist(process.argv.slice(2));

const method = argv._[0];
const apiname = argv._[1];
const isAutocursor = argv._[2] === 'autocursor';

delete argv._;

const axiosInstance = axios.create({
  baseURL: SLACK_API_URL_BASE,
  timeout: 0,
  headers: {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

(async () => {
  if (!isAutocursor) {
    // Normal mode
    const response = await (axiosInstance as any)[method](
      apiname + '?' + querystring.stringify(argv)
    );
    if (response.status >= 300) {
      console.error('Not OK status. response:');
      console.error(response);
    } else {
      console.log(JSON.stringify(response.data));
    }
  } else {
    // Auto Cursol mode (Use data?.response_metadata?.next_cursor and cursor param.)
    const responses = [];
    let cursor;
    do {
      const sleep = (msec: number) =>
        new Promise((resolve) => setTimeout(resolve, msec));
      if (process.env.SLACK_COMMAND_AC_SLEEP) {
        await sleep(parseInt(process.env.SLACK_COMMAND_AC_SLEEP));
      }

      const currentRes = await (axiosInstance as any)[method](
        apiname + '?' + querystring.stringify(argv)
      );
      if (currentRes.status >= 300) {
        console.error('Not OK status. response:');
        console.error(currentRes);
        break;
      }
      responses.push(currentRes.data);
      cursor = currentRes.data?.response_metadata?.next_cursor;
      if (cursor) {
        argv.cursor = cursor;
      } else {
        delete argv.cursor;
      }
    } while (cursor);
    console.log(JSON.stringify(responses));
  }
})();
