const { GraphQLClient } = require('graphql-request');

if (!process.env.GRAPHCMS_URL) {
  throw new Error('Environment variable GRAPHCMS_URL not defined!');
}
if (!process.env.GRAPHCMS_API_TOKEN) {
  throw new Error('Environment variable GRAPHCMS_API_TOKEN not defined!');
}

const url = process.env.GRAPHCMS_URL;
const apiToken = process.env.GRAPHCMS_API_TOKEN;

const options = {
  headers: {
    ...apiToken ? { 'Authorization': `Bearer ${apiToken}` } : null,
  },
};

module.exports = {
  graphcms: new GraphQLClient(url, options),
};
