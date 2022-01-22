const { readdirSync, readFileSync } = require('fs');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

const findAssetByFilenameQuery = gql`
query FindImage($importFilename: String!) {
  assets(where: { importFilename: $importFilename }) {
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
  // console.log('filenames', filenames);
  console.log(`Will import ${filenames.length} artworks...`);

  for (let i = 0; i < filenames.length; i++) {
    const logPrefix = `(${i + 1} of ${filenames.length}) `;
    const filename = filenames[i];
    console.log(`${logPrefix}Import ${filename}...`);
    const fileContent = readFileSync('posts/' + filename);
    // console.log('fileContent', fileContent);
    const artwork = JSON.parse(fileContent);
    console.log('artwork', artwork);

    const imageIds = [];
    for (let j = 0; j < artwork.images.length; j++) {
      const { importFilename } = artwork.images[j];
      const findRespones = await graphcms.request(findAssetByFilenameQuery, {
        importFilename,
      });
      console.log('findRespones', findRespones);
      imageIds.push(...findRespones.assets.map(({ id }) => id));
      sleep(500);
    }
    console.log('imageIds', imageIds);

    const createData = {
      ...artwork,
      images: {
        connect: imageIds.map((id) => ({ id })) || [],
      },
      categories: {
        connect: artwork.categories?.map(({ slug }) => ({ slug })) || [],
      },
      importPublishedAt: new Date(artwork.importPublishedAt).toISOString(),
    };
    delete createData.content;

    const updateData = {
      ...artwork,
      images: {
        connect: imageIds.map((id) => ({ where: { id } })) || [],
      },
      categories: {
        connect: artwork.categories?.map(({ slug }) => ({ where: { slug } })) || [],
      },
      importPublishedAt: new Date(artwork.importPublishedAt).toISOString(),
    };
    delete updateData.content;

    console.log('createData', createData);
    console.log('updateData', updateData);

    const variables = {
      slug: artwork.slug,
      createData,
      updateData,
    };
    const respones = await graphcms.request(upsertQuery, variables);
    console.log(JSON.stringify(respones, undefined, 2));
    await sleep(1000);
  }
}

main().catch((error) => console.error(error));
