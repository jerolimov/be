const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const findImageQuery = gql`
query FindImage($importFilename: String!) {
  assets(where: {importFilename: $importFilename}) {
    id
  }
}
`

const upsertQuery = gql`
mutation Upsert($slug: String!, $createData: ArtworkCreateInput!, $updateData: ArtworkUpdateInput!) {
  upsertArtwork(
    where: { slug: $slug }
    upsert: {
      create: $createData,
      update: $updateData,
    }
  ) {
    id
    slug
    title
    technique
    material
    size
    images {
      id
      importFilename
    }
    categories {
      id
      slug
    }
    sortIndex
    importPublishedAt
  }
}
`

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

async function main() {
  const filenames = readdirSync('posts').filter((filename) => filename.endsWith('.json'));
  console.log('filenames', filenames);

  for (let i = 0; i < 3 /*filenames.length*/; i++) {
    const filename = filenames[i];
    console.log('import', filename);
    const fileContent = readFileSync('posts/' + filename);
    // console.log('fileContent', fileContent);
    const artwork = JSON.parse(fileContent);
    console.log('artwork', artwork);

    const connectImages = [];
    const connectCategories = [];
    for (let j = 0; j < artwork.images; j++) {
    }
    for (let j = 0; j < artwork.categories; j++) {
      connectCategories.push({ slug: artwork.categories[j].slug });
    }

    const data = {
      ...artwork,
      images: { connect: connectImages },
      categories: { connect: connectCategories },
      importPublishedAt: new Date(artwork.importPublishedAt).toISOString(),
    };
    delete data.content;
    console.log('data', data);

    const variables = {
      slug: artwork.slug,
      createData: data,
      updateData: data,
    };
    const respones = await graphcms.request(upsertQuery, variables);
    console.log(JSON.stringify(respones, undefined, 2));
    await sleep(1000);
  }
}

main().catch((error) => console.error(error));
