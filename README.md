# Simple RSS title profanity filtering

This module filters some naughty words out of the title of an RSS feed, to
satisfy the rules of the road for iTunes Podcasts. A list of filters is at the
top of index.js - modify to suit your needs.

## Usage

* Fill in a `default.yaml` in the `config` subdirectory, with the URL of the
  RSS feed to be mirrored. See `example.yml` for inspiration.

* `npm install && npm run package` to create a zip file for lambda

* Upload zip to a new lambda function, set a trigger with API gateway, and
  you're on your way!
