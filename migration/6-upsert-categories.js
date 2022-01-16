const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const query = gql`
mutation Upsert($slug: String!, $title: String!) {
  upsertCategory(
    where: { slug: $slug }
    upsert: {
      create: { slug: $slug, title: $title }
      update: { title: $title }
    }
  ) {
    id
    slug
    title
  }
}
`

async function main() {
  const filenames = readdirSync('categories').filter((filename) => filename.endsWith('.json'));
  console.log('filenames', filenames);

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    console.log('import', filename);
    const category = readFileSync('categories/' + filename);
    const data = JSON.parse(category);
    console.log('data', data);

    const variables = {
      slug: data.slug,
      title: data.title,
    };
    const respones = await graphcms.request(query, variables);
    console.log(JSON.stringify(respones, undefined, 2));
  }
}

main().catch((error) => console.error(error));
