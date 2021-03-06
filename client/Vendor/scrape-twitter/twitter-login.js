'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var debug = require('debug')('scrape-twitter:twitter-login');

var cheerio = require('cheerio');

var denodeify = require('es6-denodeify')(Promise);
var fetchCookieDecorator = require('fetch-cookie');
var isomorphicFetch = require('isomorphic-fetch');
var tough = require('tough-cookie');

// var SCRAPE_TWITTER_CONFIG = require('./cli-utils').SCRAPE_TWITTER_CONFIG;

var jar = new tough.CookieJar();
var setCookie = denodeify(jar.setCookie.bind(jar));

var fetch = fetchCookieDecorator(isomorphicFetch, jar);

var DEFAULT_TIMEOUT = 10000;

var toText = function toText(response) {
  return response.text();
};

var setCookieWithKdt = function setCookieWithKdt(kdt) {
  if (kdt) {
    var cookie = 'kdt=' + kdt + '; Expires=' + new Date(2050, 0).toUTCString() + '; Path=/; Domain=.twitter.com; Secure; HTTPOnly';
    var url = 'https://twitter.com/sessions';
    return setCookie(cookie, url);
  } else {
    return Promise.resolve();
  }
};

var getAuthToken = function getAuthToken() {
  return fetch('https://twitter.com', {
    timeout: process.env.SCRAPE_TWITTER_TIMEOUT || DEFAULT_TIMEOUT
  }).then(toText).then(function (body) {
    var $ = cheerio.load(body);
    var authToken = $('input[name="authenticity_token"]').val();
    debug('found authToken ' + authToken + ' on home page');
    return authToken;
  });
};

var checkForKdt = function checkForKdt(previousKdt) {
  return function (response) {
    // Set-Cookie rather than set-cookie here...
    var cookies = (response.headers.getAll('Set-Cookie') || []).join(' ');

    var _ref = cookies.match(/kdt=([\w0-9]*);/) || [],
        _ref2 = _slicedToArray(_ref, 2),
        kdt = _ref2[1];

    debug('found the TWITTER_KDT ' + kdt);
    if (kdt && previousKdt !== kdt) {
      console.log('Please ensure that the environment variable TWITTER_KDT is set with ' + kdt);
      console.log();
      // console.log('Environment variables can be set within the dotenv file: ' + SCRAPE_TWITTER_CONFIG);
      process.exit(1);
    }
    return response;
  };
};

var loginWithAuthToken = function loginWithAuthToken(TWITTER_USERNAME, TWITTER_PASSWORD, TWITTER_KDT) {
  return function (authToken) {
    var formData = 'session%5Busername_or_email%5D=' + TWITTER_USERNAME + '&session%5Bpassword%5D=' + encodeURIComponent(TWITTER_PASSWORD) + '&remember_me=1&return_to_ssl=true&scribe_log=&redirect_after_login=%2F&authenticity_token=' + authToken;
    return fetch('https://twitter.com/sessions', {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0'
      },
      body: formData,
      timeout: process.env.SCRAPE_TWITTER_TIMEOUT || DEFAULT_TIMEOUT
    }).then(function (response) {
      var location = response.headers.get('location') || '';
      if (location.includes('error')) {
        debug('unable to login with ' + TWITTER_USERNAME);
        throw new Error('Could not login with ' + TWITTER_USERNAME + ' and the password supplied');
      }
      return response;
    }).then(checkForKdt(TWITTER_KDT)).then(function (response) {
      debug('logged in using ' + TWITTER_USERNAME);
      return response;
    });
  };
};

function login() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var TWITTER_USERNAME = env.TWITTER_USERNAME,
      TWITTER_PASSWORD = env.TWITTER_PASSWORD,
      TWITTER_KDT = env.TWITTER_KDT;

  return setCookieWithKdt(TWITTER_KDT).then(getAuthToken).then(loginWithAuthToken(TWITTER_USERNAME, TWITTER_PASSWORD, TWITTER_KDT));
}

module.exports = login;
module.exports.fetch = fetch;