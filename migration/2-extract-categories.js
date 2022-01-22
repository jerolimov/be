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
  // console.log('wpCategory', wpCategory);
  const slug = wpCategory['wp:category_nicename'];
  const title = wpCategory['wp:cat_name'];
  const sortIndex = wpCategory['wp:term_id'];

  const filename = 'categories/' + slug + '.json';
  const category = { slug, title, sortIndex };
  // console.log('category', category);
  writeFileSync(filename, JSON.stringify(category, null, 2));
});
