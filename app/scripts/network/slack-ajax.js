const Promise = require('bluebird');
const xtend = require('xtend');
const $ = require('jquery');
const { slackTrelloDomain } = require('@trello/config');

const createPromise = (opts) =>
  new Promise(function (resolve, reject) {
    opts = xtend(opts, {
      success(...args) {
        resolve(args);
      },
      error(...args) {
        reject(args);
      },
    });
    $.ajax(opts);
  });
module.exports.ajaxTrello = function (opts) {
  opts.url = new URL(opts.url, slackTrelloDomain).toString();
  opts.data = opts.data ?? {};

  opts.headers = {
    Authorization: document.cookie,
  };
  return createPromise(opts);
};
