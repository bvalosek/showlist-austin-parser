const test = require('tape');
const linkExtractor = require('./linkExtractor.js');

const text1 = '9pm, <a href="https://www.facebook.com/events/632607393544798/">fb</a>';

test('link extractor basic functionality', t => {
  t.plan(2);

  const { output, links } = linkExtractor(text1);

  t.strictEqual(output, '9pm, ', 'correct output');
  t.deepEqual(links, [{href: 'https://www.facebook.com/events/632607393544798/', link: 'fb'}], 'correct links');
});
