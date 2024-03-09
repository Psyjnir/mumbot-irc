/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Description:
//   A way to search images on giphy.com
//
// Configuration:
//   HUBOT_GIPHY_API_KEY
//
// Commands:
//   hubot gif me <query> - Returns an animated gif matching the requested search term.

const giphy = {
  api_key: process.env.HUBOT_GIPHY_API_KEY,
  base_url: 'http://api.giphy.com/v1'
};

module.exports = robot => robot.respond(/(gif|giphy)( me)? (.*)/i, msg => giphyMe(msg, msg.match[3], url => msg.send(url)));

var giphyMe = function(msg, query, cb) {
  const endpoint = '/gifs/search';
  const url = `${giphy.base_url}${endpoint}`;

  return msg.http(url)
    .query({
      q: query,
      api_key: giphy.api_key}).get()(function(err, res, body) {
      let response = undefined;
      try {
        response = JSON.parse(body);
        const images = response.data;
        if (images.length > 0) {
          const image = msg.random(images);
          cb(image.images.original.url);
        }

      } catch (e) {
        response = undefined;
        cb('Error');
      }

      if (response === undefined) { return; }
  });
};