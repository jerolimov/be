const { GraphQLClient } = require('graphql-request');

const baseURL = process.env.GRAPHCMS_URL;

const region = process.env.GRAPHCMS_REGION;
const projectId = process.env.GRAPHCMS_PROJECT_ID;
const environment = process.env.GRAPHCMS_ENVIRONMENT;
const apiToken = process.env.GRAPHCMS_API_TOKEN;
// const stage = process.env.GRAPHCMS_DEFAULT_STAGE || 'PUBLISHED';

const url = baseURL || `https://api-${region}.graphcms.com/v2/${projectId}/${environment}`;
const options = {
  headers: {
    ...apiToken ? { 'Authorization': `Bearer ${apiToken}` } : null,
  },
};

module.exports = {
  graphcms: new GraphQLClient(url, options),
};
