const { existsSync, readFileSync, mkdirSync } = require('fs');
const { execSync } = require('child_process');
const { XMLParser } = require('fast-xml-parser');

// Wordpress export, not part of this repo
const filename = 'WordPress.2022-01-15.xml';
const parsedXML = new XMLParser().parse(readFileSync(filename));

const wpItems = parsedXML.rss.channel.item;
const wpAttachments = wpItems.filter(wpItem => wpItem['wp:post_type'] === 'attachment');
// console.log('wpAttachments', wpAttachments);

if (!existsSync('assets')) {
  mkdirSync('assets');
}

wpAttachments.forEach((wpAttachment) => {
  const url = wpAttachment['wp:attachment_url'].replace('http:', 'https:');

  if (!url.includes('/uploads/')) {
    throw new Error('Invalid URL: ' + url);
  }
  const filename = url.substring(url.indexOf('/uploads/') + '/uploads/'.length);
  const path = filename.substring(0, filename.lastIndexOf('/'));

  if (!existsSync('assets/' + path)) {
    mkdirSync('assets/' + path, { recursive: true });
  }
  if (!existsSync('assets/' + filename)) {
    // console.log('curl --output assets/' + filename + ' ' + url);
    execSync('curl --output assets/' + filename + ' ' + url);
  }
});
