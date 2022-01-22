const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const query = gql`
mutation Upsert($slug: String!, $title: String!, $content: String!, $sortIndex: Int) {
  upsertPage(
    where: { slug: $slug }
    upsert: {
      create: { slug: $slug, title: $title, content: $content, sortIndex: $sortIndex }
      update: { slug: $slug, title: $title, content: $content, sortIndex: $sortIndex }
    }
  ) {
    id
    slug
    title
    content
    sortIndex
  }
}
`

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

async function main() {
  const filenames = readdirSync('pages').filter((filename) => filename.endsWith('.json'));
  console.log('filenames', filenames);

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    console.log('import', filename);
    const fileContent = readFileSync('pages/' + filename);
    // console.log('fileContent', fileContent);
    const page = JSON.parse(fileContent);
    console.log('page', page);

    const respones = await graphcms.request(query, page);
    console.log(JSON.stringify(respones, undefined, 2));
    await sleep(1000);
  }
}

main().catch((error) => console.error(error));
