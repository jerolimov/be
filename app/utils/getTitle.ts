const pageTitle = 'BE';

export default function getTitle(title?: string) {
  return title ? `${title} - ${pageTitle}` : pageTitle;
}
