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
  const filename = 'posts/' + wpPost['wp:post_name'] + '.json';

  const categories = wpCategories
      .filter((wpCategory) => wpCategory['wp:cat_name'] === wpPost.category)
      .map((wpCategory) => ({
        slug: wpCategory['wp:category_nicename'],
        title: wpCategory['wp:cat_name'],
      }));

  const thumbnailIds = wpPost['wp:postmeta']
      .filter((postmeta) => postmeta['wp:meta_key'] === '_thumbnail_id')
      .map((postmeta) => postmeta['wp:meta_value']);
  // console.log('thumbnailIds', thumbnailIds);

  const images = wpAttachments
      .filter((wpAttachment) => thumbnailIds.includes(wpAttachment['wp:post_id']))
      .map((wpAttachment) => ({
        url: wpAttachment['wp:attachment_url'],
      }));
  // console.log('images', images);
  if (images.length !== 1) {
    throw new Error('Could not find exact one image for post ' + wpPost['wp:post_name']);
  }

  const page = {
    slug: wpPost['wp:post_name'],
    title: wpPost.title,
    content: wpPost['content:encoded'] || wpPost.description,
    publishDate: wpPost.pubDate,
    postDate: wpPost['wp:post_date'],
    categories,
    images,
  };
  // console.log('page', page);
  writeFileSync(filename, JSON.stringify(page, null, 2));
});
