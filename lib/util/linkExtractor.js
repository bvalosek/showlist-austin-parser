/*

  Take a string of text and remove all a href links, returning parsed links and
  cleaned text. Not very robust

*/
module.exports = function linkExtractor(text)
{
  const pattern = /<a href="([^"]*)">([^<]*)<\/a>/g;

  let output = text;
  const links = [];

  let m;
  while (m = pattern.exec(text)) {
    const [match, href, link] = m;
    output = output.replace(match, '');
    links.push({href, link});
  }

  return {output, links};
};
