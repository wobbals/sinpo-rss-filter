'use strict'

const request = require('request-promise-native');
const config = require('config');
const xmljs = require('xml-js');
const rootRSSURL = config.get('rss_url');
const crypto = require('crypto');
const readline = require('readline');
const debug = require('debug')('index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let filters = [
  { key: /Shit/g, replacement: 'Sh*t' }
  /* add more filters or move this to a config file */
]

let filteredAttributes = [
  'title'
]

let applyFilterWords = function(attributeValue) {
  let filteredValue = attributeValue;

  for (let i in filters) {
    let filter = filters[i];
    filteredValue = attributeValue.replace(filter.key, filter.replacement);
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


let processFeed = async function() {
  try {
    let feed = await request.get(rootRSSURL);
    let parsedFeed = xmljs.xml2js(feed, {
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
  } catch (e) {
    console.log(e);
  }
};

exports.handler = async function(event, context, callback) {
  try {
    let filteredFeed = await processFeed();
    let response = {
      statusCode: 200,
      body: filteredFeed
    };
    callback(null, response);

  } catch (e) {
    console.error(e);
  }
};
