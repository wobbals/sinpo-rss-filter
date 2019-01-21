const xmljs = require('xml-js');
const debug = require('debug')('filter');


let filters = [
  { key: 'Shit', replacement: 'S**t' },
  { key: 'shit', replacement: 's**t' }
  /* add more filters or move this to a config file */
]

/* Attribute names that qualify for profanity filtering */
let filteredAttributes = [
  'title'
]

let applyFilterWords = function(attributeValue) {
  debug(`applyFilterWords: value=${attributeValue}`);
  let filteredValue = attributeValue;

  for (let i in filters) {
    let filter = filters[i];
    filteredValue = filteredValue.replace(filter.key, filter.replacement);
  }

  if (attributeValue !== filteredValue) {
    debug(`applyFilterWords: ${attributeValue} => ${filteredValue}`)
  }

  return filteredValue;
}

let escapeAttribute = function(attributeValue, attributeName) {
  let filteredValue = attributeValue;

  if (filteredAttributes.includes(attributeName)) {
    filteredValue = applyFilterWords(filteredValue);
  }

  // convert quote back before converting amp
  let escaped = filteredValue.replace(/&quot;/g, '"')
  .replace(/\&(?!\w{2,4}\;)/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');
  if (escaped !== attributeValue) {
    debug(`escapeAttribute: ${attributeName}: ${attributeValue} => ${escaped}`);
  } else {
    debug(`escapeAttribute: ${attributeName}: ${attributeValue}`);
  }
  return escaped;
}

let applyFilter = function(doc) {
  let parsedFeed = xmljs.xml2js(doc, {
    compact: true
  });
  let filteredFeed = xmljs.js2xml(parsedFeed, {
    spaces: '\t',
    compact: true,
    attributeValueFn: escapeAttribute,
    textFn: escapeAttribute,
    cdataFn: applyFilterWords
  });
  return filteredFeed;
}

module.exports = applyFilter;
