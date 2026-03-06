export function getLastHrefSegment(href: string): string {
  return href.split('/').splice(-1)[0].split('?')[0];
}
