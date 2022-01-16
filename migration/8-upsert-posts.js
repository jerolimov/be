const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const query = gql`
mutation Upsert($importFilename: String!, $upsert: ArtworkUpsertInput!) {
  upsertArtwork(
    where: { importFilename: $importFilename }
    upsert: $upsert
  ) {
    id
    slug
    title
    content
    importFilename
  }
}
`

const graphcms = new GraphQLClient(artworkApi, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

async function main() {
  const filenames = readdirSync('posts').filter((filename) => filename.endsWith('.json'));
  console.log('filenames', filenames);

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    console.log('import', filename);
    const artwork = readFileSync('posts/' + filename);
    console.log('artwork', artwork);
    let data = JSON.parse(artwork);
    console.log('data', data);

    data = {
      importFilename: filename,
      importedAt: new Date(),
      slug: data.slug,
      title: data.title,
      artwork: data.artwork,
      wpPostDate: data.postDate.replace(' ', 'T') + '+00:00',
    };
    console.log('data', data);

    const variables = {
      importFilename: filename,
      upsert: {
        create: data,
        update: data,
      },
    };
    const respones = await graphcms.request(query, variables);
    console.log(JSON.stringify(respones, undefined, 2));
  }
}

main().catch((error) => console.error(error));
