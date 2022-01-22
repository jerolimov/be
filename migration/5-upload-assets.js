const { readdirSync, lstatSync } = require('fs');
const { execSync } = require('child_process');
const { gql } = require('graphql-request');
const { graphcms } = require('./graphql');

if (!process.env.GRAPHCMS_URL) {
  throw new Error('Environment variable GRAPHCMS_URL not defined!');
}
if (!process.env.GRAPHCMS_API_TOKEN) {
  throw new Error('Environment variable GRAPHCMS_API_TOKEN not defined!');
}

const findAssetByFilenameQuery = gql`
query Find($importFilename: String!) {
  assets(
    where: { importFilename: $importFilename },
  ) {
    id
    fileName
    mimeType
    size
    width
    height
    url
    type
    importFilename
  }
}
`;
const updateAssetFilenameQuery = gql`
mutation Update($id: ID, $type: AssetType, $importFilename: String!) {
  updateAsset(
    where: { id: $id },
    data: { type: $type, importFilename: $importFilename },
  ) {
    id
    fileName
    mimeType
    size
    width
    height
    url
    type
    importFilename
  }
}
`
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

function getFilesRecursiv(folder) {
  const filesAndDirectories = readdirSync(folder);
  const files = [];
  filesAndDirectories.forEach((path) => {
    const stat = lstatSync(folder + '/' + path);
    if (stat.isFile()) {
      files.push(folder + '/' + path);
    } else if (stat.isDirectory()) {
      files.push(...getFilesRecursiv(folder + '/' + path));
    } else {
      console.warn('Neighter file or directory:', folder + '/' + path);
    }
  });
  return files;
}

async function main() {
  const assets = getFilesRecursiv('assets');
  // console.log('assets', assets);
  console.log(`Find ${assets.length} assets...`);

  const uploadURL = `${process.env.GRAPHCMS_URL}/upload`;
  const header = `Authorization: Bearer ${process.env.GRAPHCMS_API_TOKEN}`;

  for (let index = 0; index < assets.length; index++) {
    const assetFilename = assets[index];
    const importFilename = assetFilename.replace('assets/', '');
    const logPrefix = `(${index + 1} of ${assets.length}) `;

    const findRespones = await graphcms.request(findAssetByFilenameQuery, {
      importFilename,
    });
    console.log('findRespones', findRespones);
    if (findRespones.assets.length === 0) {
      console.log(`${logPrefix}importFilename ${importFilename} not found. Import it...`)

      // Import
      const stdout = execSync(
        `curl -X POST -H "${header}" -F "fileUpload=@${assetFilename}" "${uploadURL}"`,
        { encoding: 'utf8' },
      );
      const uploadResponse = JSON.parse(stdout);
      console.log('uploadResponse', uploadResponse);
      await sleep(1000);

      // Set importFilename
      const updateResponse = await graphcms.request(updateAssetFilenameQuery, {
        id: uploadResponse.id,
        type: 'Artwork',
        importFilename,
      });
      console.log(JSON.stringify(updateResponse, undefined, 2));
      await sleep(1000);
    } else if (findRespones.assets.length === 1) {
      console.log(`${logPrefix}importFilename ${importFilename} already found. Skip import.`)
      await sleep(1000);
    } else {
      console.log('findResponses', findResponses);
      throw new Error(`Unexpected assets.length ${findRespones.assets.length} for importFilename ${importFilename}!`)
    }
  }
}

main().catch((error) => console.error(error));
