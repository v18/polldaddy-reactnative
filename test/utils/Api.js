import { expect } from 'chai';
import fetch from 'node-fetch';

// polyfill promise for mocha
if (typeof Promise.prototype.done !== 'function') {
  Promise.prototype.done = function (onFulfilled, onRejected) { // eslint-disable-line no-unused-vars
    var self = arguments.length ? this.then.apply(this, arguments) : this;
    self.then(null, function (err) {
      setTimeout(function () {
        throw err;
      }, 0);
    });
  };
}

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
        expect(result.message).to.equal(expected.message);
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
        expect(result.message).to.equal(expected.message);
      });
    });

    it('returns a rejected promise if Polldaddy could not be reached', () => {
      // mock fetch: fetch promise rejects with TypeError if internet is down
      var expected = new TypeError('Failed to fetch');
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.reject(expected);
      };

      return Api.signin('email', 'password', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
      });
    });
  });

  describe('getRemoteListOf()', () => {

    describe('when entering correct userCode', () => {
      describe('using survey type', () => {
        it('returns promise for surveys when surveys exist on Polldaddy.com for that user', () => {
          var expected = [{
            closed: 0,
            created: 1463580844,
            folder_id: 25733992,
            id: 2287865,
            name: 'Survey Name',
            owner: 15989282,
            responses: 0,
            title: 'Survey Title'
          }];

          var res = new fetch.Response(
            JSON.stringify({pdResponse: {
              demands: {
                demand: [{
                  id: 'getsurveys',
                  surveys: {
                    total: 1,
                    survey: expected
                  }
                }]
              }
            }
          }), { 'status': 200 });
          var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
            return Promise.resolve(res);
          };

          return Api.getRemoteListOf('survey', 'userCode', fakeFetcher)
            .then(function(result) {
              expect(result).to.eql(expected);
            });
        });

        it('returns promise with value undefined when surveys do not exist on Polldaddy.com for that user', () => {
          var res = new fetch.Response(
            JSON.stringify({pdResponse: {
              demands: {
                demand: [{
                  id: 'getsurveys',
                  surveys: {
                    total: 0
                  }
                }]
              }
            }
          }), { 'status': 200 });
          var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
            return Promise.resolve(res);
          };

          return Api.getRemoteListOf('survey', 'userCode', fakeFetcher)
            .then(function(result) {
              expect(result).to.eql([]);
            });
        });
      });

      describe('using quiz type', () => {
        it('returns promise for quizzes when quizzes exist on Polldaddy.com for that user', () => {
          var expected = [{
            closed: 0,
            created: 1463580844,
            folder_id: 25733992,
            id: 2287865,
            name: 'Quiz Name',
            owner: 15989282,
            responses: 0,
            title: 'Quiz Title'
          }];

          var res = new fetch.Response(
            JSON.stringify({pdResponse: {
              demands: {
                demand: [{
                  id: 'getquizzes',
                  quizzes: {
                    total: 1,
                    quiz: expected
                  }
                }]
              }
            }
          }), { 'status': 200 });
          var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
            return Promise.resolve(res);
          };

          return Api.getRemoteListOf('quiz', 'userCode', fakeFetcher)
            .then(function(result) {
              expect(result).to.eql(expected);
            });
        });

        it('returns promise with value undefined when quizzes do not exist on Polldaddy.com for that user', () => {
          var res = new fetch.Response(
            JSON.stringify({pdResponse: {
              demands: {
                demand: [{
                  id: 'getquizzes',
                  quizzes: {
                    total: 0
                  }
                }]
              }
            }
          }), { 'status': 200 });
          var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
            return Promise.resolve(res);
          };

          return Api.getRemoteListOf('quiz', 'userCode', fakeFetcher)
            .then(function(result) {
              expect(result).to.eql([]);
            });
        });
      });
    });

    it('returns rejected promise with usercode error when using bad usercode', () => {
      var expectedErrorMessage = 'User Code Invalid, 871';
      var res = new fetch.Response(
        JSON.stringify({pdResponse:
          {errors: {
            error: [{
              content: expectedErrorMessage,
              id: 4
            }]
          }
        }
      }), { 'status': 200 });
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };
      var expected = new Error(expectedErrorMessage);

      return Api.getRemoteListOf('survey', 'badUserCode', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
      });
    });

    it('returns rejected promise with error when Polldaddy returns non-2xx response', () => {
      // mock fetch: 404 status, i.e. did not get 200 response from Polldaddy
      var res = new fetch.Response('', {'status': 404});
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      var expected = new Error('HTTP Request Failed');

      return Api.getRemoteListOf('survey', 'userCode', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
      });
    });

    it('returns rejected promise when Polldaddy.com could not be reached', () => {
      // mock fetch: fetch promise rejects with TypeError if internet is down
      var expected = new TypeError('Failed to fetch');
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.reject(expected);
      };

      return Api.getRemoteListOf('survey', 'userCode', fakeFetcher).catch((result) => {
        expect(result).to.eql(expected);
      });
    });
  });
});
