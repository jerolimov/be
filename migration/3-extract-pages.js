const { existsSync, readFileSync, mkdirSync, writeFileSync } = require('fs');
const { XMLParser } = require('fast-xml-parser');

// Wordpress export, not part of this repo
const filename = 'WordPress.2022-01-15.xml';
const parsedXML = new XMLParser().parse(readFileSync(filename));

const wpItems = parsedXML.rss.channel.item;
const wpPages = wpItems.filter(wpItem => wpItem['wp:post_type'] === 'page');
// console.log('wpPages', wpPages);

if (!existsSync('pages')) {
  mkdirSync('pages');
}

wpPages.forEach((wpPage) => {
  // console.log('wpPage', wpPage);
  const filename = 'pages/' + wpPage['wp:post_name'] + '.json';
  const page = {
    slug: wpPage['wp:post_name'],
    title: wpPage.title,
    content: wpPage['content:encoded'] || wpPage.description,
    publishDate: wpPage.pubDate,
    postDate: wpPage['wp:post_date'],
  };
  // console.log('page', page);
  writeFileSync(filename, JSON.stringify(page, null, 2));
});
