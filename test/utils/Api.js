import { expect } from 'chai';
import fetch from 'node-fetch';

describe('Api', () => {
  var Api = require('../../src/utils/Api');

  it('exists', () => {
    expect(Api).not.to.be.undefined;
  });

  describe('signin()', () => {
    it('exists', () => {
      expect(Api.signin).not.to.be.undefined;
    });

    it('returns a promise for the userCode when entering correct email and password', function(done) {
      var expected = 'theUserCode';

      // mock fetch: status 200, and userCode exists in response
      var res = new fetch.Response(
        `{"pdResponse":{"userCode":"${expected}"}}`,
        { 'status': 200 }
      );
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      Api.signin('email', 'password', fakeFetcher)
        .then(function(result) {
          expect(result).to.equal(expected);
        });
      done(); //workaround for using done() in src/utils/Api.js
    });

    it('returns a rejected promise with "Could not log in" error if login credentials not correct', () => {
      // mock fetch: status 200, but missing userCode in response
      var res = new fetch.Response(
        '{"pdResponse":{"notUserCode":""}}',
        { 'status': 200 }
      );
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      var expected = new Error('Could not log in');

      return Api.signin('email', 'password', fakeFetcher).catch(function(result) {
        expect(result).to.eql(expected);
      });
    });

    it('returns a rejected promise if Polldaddy returns a non-2xx status code', () => {
      // mock fetch: 404 status, i.e. did not get 200 response from Polldaddy
      var res = new fetch.Response('', {'status': 404});
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      var expected = new Error('HTTP Request Failed');

      return Api.signin('email', 'password', fakeFetcher).catch((result) => {
        expect(result).to.eql(expected);
      });
    });

    it('returns a rejected promise if Polldaddy could not be reached', () => {
      // mock fetch: fetch promise rejects with TypeError if internet is down
      var expected = new TypeError('Failed to fetch at TypeError');
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.reject(expected);
      };

      return Api.signin('email', 'password', fakeFetcher).catch((result) => {
        expect(result).to.eql(expected);
      });
    });
  });
});
