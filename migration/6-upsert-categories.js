const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const query = gql`
mutation Upsert($slug: String!, $title: String!, $sortIndex: Int) {
  upsertCategory(
    where: { slug: $slug }
    upsert: {
      create: { slug: $slug, title: $title, sortIndex: $sortIndex }
      update: { slug: $slug, title: $title, sortIndex: $sortIndex }
    }
  ) {
    id
    slug
    title
    sortIndex
  }
}
`

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

async function main() {
  const filenames = readdirSync('categories').filter((filename) => filename.endsWith('.json'));
  console.log('filenames', filenames);

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    console.log('import', filename);
    const fileContent = readFileSync('categories/' + filename);
    const category = JSON.parse(fileContent);
    console.log('category', category);

    const respones = await graphcms.request(query, category);
    console.log(JSON.stringify(respones, undefined, 2));
    await sleep(1000);
  }
}

main().catch((error) => console.error(error));
