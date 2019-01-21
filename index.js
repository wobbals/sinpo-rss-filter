'use strict'

const config = require('config');
const request = require('request-promise-native');
const rootRSSURL = config.get('rss_url');
const debug = require('debug')('index');

let processFeed = async function() {
  try {
    let feed = await request.get(rootRSSURL);
    let filteredFeed = filter(feed);
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
