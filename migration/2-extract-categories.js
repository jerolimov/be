const { existsSync, readFileSync, mkdirSync, writeFileSync } = require('fs');
const { XMLParser } = require('fast-xml-parser');

// Wordpress export, not part of this repo
const filename = 'WordPress.2022-01-15.xml';
const parsedXML = new XMLParser().parse(readFileSync(filename));

const wpCategories = parsedXML.rss.channel['wp:category'];
// console.log('wpCategories', wpCategories);

if (!existsSync('categories')) {
  mkdirSync('categories');
}

wpCategories.forEach((wpCategory) => {
  const slug = wpCategory['wp:category_nicename'];
  const title = wpCategory['wp:cat_name'];

  const category = { slug, title };
  const filename = 'categories/' + slug + '.json';
  writeFileSync(filename, JSON.stringify(category, null, 2));
});
