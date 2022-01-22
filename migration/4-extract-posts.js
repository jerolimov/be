const { existsSync, readFileSync, mkdirSync, writeFileSync } = require('fs');
const { XMLParser } = require('fast-xml-parser');

// Wordpress export, not part of this repo
const filename = 'WordPress.2022-01-15.xml';
const parsedXML = new XMLParser().parse(readFileSync(filename));

const wpCategories = parsedXML.rss.channel['wp:category'];
// console.log('wpCategories', wpCategories);

const wpItems = parsedXML.rss.channel.item;
const wpPosts = wpItems.filter(wpItem => wpItem['wp:post_type'] === 'post');
// console.log('wpPosts', wpPosts);
const wpAttachments = wpItems.filter(wpItem => wpItem['wp:post_type'] === 'attachment');
// console.log('wpAttachments', wpAttachments);

if (!existsSync('posts')) {
  mkdirSync('posts');
}

wpPosts.forEach((wpPost) => {
  // console.log('wpPost', wpPost);
  const slug = wpPost['wp:post_name'];
  const title = wpPost.title;

  /** @type string */
  const content = wpPost['content:encoded'];
  const lines = content.replace('\n\n', '\n').split('\n');
  let technique = null;
  let material = null;
  let size = null;
  if (content.endsWith('cm') && lines.length === 2) {
    material = lines[0];
    size = lines[1];
  } else if (lines.length === 1) {
    technique = lines[0];
  } else if (lines.length === 2) {
    technique = lines[0];
    material = lines[1];
  } else {
    throw new Error('Unexpect content!');
  }

  const thumbnailIds = wpPost['wp:postmeta']
      .filter((postmeta) => postmeta['wp:meta_key'] === '_thumbnail_id')
      .map((postmeta) => postmeta['wp:meta_value']);
  // console.log('thumbnailIds', thumbnailIds);
  const images = wpAttachments
      .filter((wpAttachment) => thumbnailIds.includes(wpAttachment['wp:post_id']))
      .map((wpAttachment) => {
        /** @type string */
        const url = wpAttachment['wp:attachment_url'];
        const importFilename = url.substring(url.indexOf('/uploads/') + 9);
        return { importFilename };
      });
  // console.log('images', images);
  if (images.length !== 1) {
    throw new Error('Could not find exact one image for post ' + wpPost['wp:post_name']);
  }

  const categories = wpCategories
      .filter((wpCategory) => {
        if (typeof wpPost.category === 'string') {
          return wpPost.category === wpCategory['wp:cat_name'];
        } else {
          return wpPost.category.includes(wpCategory['wp:cat_name']);
        }
      })
      .map((wpCategory) => ({
        slug: wpCategory['wp:category_nicename'],
      }));
  if (categories.length !== 1) {
    throw new Error('Could not find exact one category for post ' + wpPost['wp:post_name']);
  }
    
  const sortIndex = wpPost['wp:post_id'];
  const importPublishedAt = wpPost['wp:post_date'];

  const page = { slug, title, content, technique, material, size, images, categories, sortIndex, importPublishedAt };
  const filename = 'posts/' + wpPost['wp:post_name'] + '.json';
  // console.log('page', page);
  writeFileSync(filename, JSON.stringify(page, null, 2));
});
