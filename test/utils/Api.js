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

    it('returns a promise for the userCode and partnerUserID when entering correct email and password', function() {
      var userCode = 'userCode';
      var partnerUserID = 123;
      var expected = {
        userCode: userCode,
        userId: partnerUserID
      };

      // mock fetch: status 200, and userCode exists in response
      var res = new fetch.Response(
        JSON.stringify({
          pdResponse: {
            userCode: userCode,
            partnerUserID: partnerUserID
          }
        }),
        { 'status': 200 }
      );

      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      return Api.signin('email', 'password', fakeFetcher)
        .then(function(result) {
          expect(result).to.eql(expected);
        });
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
        expect(result.message).to.equal(expected.message);
      });
    });
  });

  describe('getItem()', () => {
    it('returns promise for object containing quiz/survey data when the quiz/survey exists on Polldaddy.com for that user, with correct form xml when rule_xml is returned', () => {
      var surveyId = 123;
      var surveyXml = '↵<formData version="2" id="2289926" qCounter="0" pCounter="1" startPage="0" styleID="112" packID="0" title="Simple Survey" blockRepeat="0" fClose="0" u="98CF48D3695359B4" fQuota="0" fQuotaAmount="1000" locale="" progressBar="" fType="0" back="false" pageTimeout="24" seed_survey_answers="" tag_survey_answers=""><endMessage>Thank you for completing this survey.</endMessage><font>Open Sans</font><page pID="1"><question qType="400" qID="7220041" trueQ="1"><qText>Multiple choice</qText><nText></nText><note>false</note><other>false</other><rand>0</rand><elmType>0</elmType><options oType="list" oIDcounter="2"><option oID="15675923">1</option><option oID="15675924">2</option></options><comments enabled="false">Please help us understand why you selected this answer</comments><answer>15675923</answer><mand>false</mand></question></page></formData>↵';

      var repsonse = {
        close_date:1461070800,
        close_on_date:'no',
        close_on_quota:'no',
        closed:0,
        created:1464275809,
        custom_end_url:'',
        end_page:'no',
        end_page_html:'This is a custom finish message.',
        folder_id:25733992,
        id:123,
        multiple_responses:'yes',
        name:'survey name',
        owner:1598123,
        pack_id:0,
        quota_amount:1000,
        responses:5,
        start_page:'yes',
        start_page_html:'This is a custom start message.',
        style_id:112,
        survey_xml: surveyXml,
        title: 'survey title'
      };

      var expectedXml = '↵<formData version="2" id="2289926" qCounter="0" pCounter="1" startPage="0" styleID="112" packID="0" title="Simple Survey" blockRepeat="0" fClose="0" u="98CF48D3695359B4" fQuota="0" fQuotaAmount="1000" locale="" progressBar="" fType="0" back="false" pageTimeout="24" seed_survey_answers="" tag_survey_answers=""><endMessage>Thank you for completing this survey.</endMessage><font>Open Sans</font><page pID="1"><question qType="400" qID="7220041" trueQ="1"><qText>Multiple choice</qText><nText></nText><note>false</note><other>false</other><rand>0</rand><elmType>0</elmType><options oType="list" oIDcounter="2"><option oID="15675923">1</option><option oID="15675924">2</option></options><comments enabled="false">Please help us understand why you selected this answer</comments><answer>15675923</answer><mand>false</mand></question></page></formData>↵';

      var expected = {
        title: 'survey title',
        name: 'survey name',
        id: 123,
        surveyXml: expectedXml
      };

      var res = new fetch.Response(
        JSON.stringify({pdResponse: {
          demands: {
            demand: [{
              id: 'getsurvey',
              survey: repsonse
            }]
          }
        }
      }), { 'status': 200 });
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      return Api.getItem(surveyId, 'userCode', fakeFetcher)
        .then(function(result) {
          expect(result).to.eql(expected);
        });
    });
    it('returns promise for object containing survey data when surveys exists on Polldaddy.com for that user, , with correct form xml when rule_xml is not returned', () => {
      var surveyId = 123;
      var surveyXml = '↵<formData version="2" id="2289926" qCounter="0" pCounter="1" startPage="0" styleID="112" packID="0" title="Simple Survey" blockRepeat="0" fClose="0" u="98CF48D3695359B4" fQuota="0" fQuotaAmount="1000" locale="" progressBar="" fType="0" back="false" pageTimeout="24" seed_survey_answers="" tag_survey_answers=""><endMessage>Thank you for completing this survey.</endMessage><font>Open Sans</font><page pID="1"><question qType="400" qID="7220041" trueQ="1"><qText>Multiple choice</qText><nText></nText><note>false</note><other>false</other><rand>0</rand><elmType>0</elmType><options oType="list" oIDcounter="2"><option oID="15675923">1</option><option oID="15675924">2</option></options><comments enabled="false">Please help us understand why you selected this answer</comments><answer>15675923</answer><mand>false</mand></question></page></formData>↵';

      var repsonse = {
        close_date:1461070800,
        close_on_date:'no',
        close_on_quota:'no',
        closed:0,
        created:1464275809,
        custom_end_url:'',
        end_page:'no',
        end_page_html:'This is a custom finish message.',
        folder_id:25733992,
        id:123,
        multiple_responses:'yes',
        name:'survey name',
        owner:1598123,
        pack_id:0,
        quota_amount:1000,
        responses:5,
        rule_xml:'↵<rules ruleCount="0"/>↵',
        start_page:'yes',
        start_page_html:'This is a custom start message.',
        style_id:112,
        survey_xml: surveyXml,
        title: 'survey title'
      };

      var expectedXml = '↵<formData version="2" id="2289926" qCounter="0" pCounter="1" startPage="0" styleID="112" packID="0" title="Simple Survey" blockRepeat="0" fClose="0" u="98CF48D3695359B4" fQuota="0" fQuotaAmount="1000" locale="" progressBar="" fType="0" back="false" pageTimeout="24" seed_survey_answers="" tag_survey_answers=""><endMessage>Thank you for completing this survey.</endMessage><font>Open Sans</font><page pID="1"><question qType="400" qID="7220041" trueQ="1"><qText>Multiple choice</qText><nText></nText><note>false</note><other>false</other><rand>0</rand><elmType>0</elmType><options oType="list" oIDcounter="2"><option oID="15675923">1</option><option oID="15675924">2</option></options><comments enabled="false">Please help us understand why you selected this answer</comments><answer>15675923</answer><mand>false</mand></question></page>↵<rules ruleCount="0"/>↵</formData>↵';

      var expected = {
        title: 'survey title',
        name: 'survey name',
        id: 123,
        surveyXml: expectedXml
      };

      var res = new fetch.Response(
        JSON.stringify({pdResponse: {
          demands: {
            demand: [{
              id: 'getsurvey',
              survey: repsonse
            }]
          }
        }
      }), { 'status': 200 });
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      return Api.getItem(surveyId, 'userCode', fakeFetcher)
        .then(function(result) {
          expect(result).to.eql(expected);
        });
    });
    it('returns a rejected promise when item ID does not exist on Polldaddy.com for that user', () => {
      var expectedErrorMessage = 'Survey Not Found, 4509';
      var res = new fetch.Response(
        JSON.stringify({pdResponse:
          {errors: {
            error: [{
              content: expectedErrorMessage,
              id: 72
            }]
          }
        }
      }), { 'status': 200 });
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };
      var expected = new Error(expectedErrorMessage);
      var badSurveyId = 1;
      return Api.getItem(badSurveyId, 'userCode', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
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
      var surveyId = 1;

      return Api.getItem(surveyId, 'badUserCode', fakeFetcher).catch((result) => {
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
      var surveyId = 1;

      return Api.getItem(surveyId, 'userCode', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
      });
    });
    it('returns rejected promise when Polldaddy.com could not be reached', () => {
      // mock fetch: fetch promise rejects with TypeError if internet is down
      var expected = new TypeError('Failed to fetch');
      var surveyId = 1;
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.reject(expected);
      };

      return Api.getItem(surveyId, 'userCode', fakeFetcher).catch((result) => {
        expect(result.message).to.equal(expected.message);
      });
    });
  });

  describe('getLanguagePack()', () => {
    // it('exists', () => {
    //   expect(Api.getLanguagePack).not.to.be.undefined;
    // });
    it('returns a promise for JSON stringified phrase data when called with pack ID and userCode', () => {
      var packId = 12345;
      var phrase = [
        {content: 'Continue', phraseId: '1'},
        {content: 'Start Survey', phraseId: '2'},
        {content: 'Finish survey', phraseId: '17'}
      ];

      var expected = JSON.stringify({
        1: 'Continue',
        2: 'Start Survey',
        17: 'Finish survey'
      });

      var res = new fetch.Response(
        JSON.stringify({pdResponse: {
          demands: {
            demand: [{
              id: 'getpack',
              languagepack: {
                id: packId,
                pack: {
                  phrase: phrase,
                  title: 'Language Pack Title',
                  type: 'user'
                }
              }
            }]
          }
        }
      }), { 'status': 200 });

      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      return Api.getLanguagePack(packId, 'userCode', fakeFetcher)
        .then(function(result) {
          expect(result).to.equal(expected);
        });
    });

    it('returns a rejected promise when called with bad pack ID', () => {
      var packId = 1;

      var res = new fetch.Response(
        JSON.stringify({pdResponse: {
          demands: {
            demand: [{
              id: 'getpack',
              languagepack: {
                id: packId
              }
            }]
          }
        }
      }), { 'status': 200 });

      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };

      var expected = new Error('No language pack with that ID');

      return Api.getLanguagePack(packId, 'userCode', fakeFetcher)
        .catch(function(result) {
          expect(result.message).to.equal(expected.message);
        });
    });

    it('returns a rejected promise when called with bad userCode', () => {
      var packId = 1;
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

      return Api.getLanguagePack(packId, 'badUserCode', fakeFetcher)
        .catch(function(result) {
          expect(result.message).to.equal(expected.message);
        });
    });

    it('returns a rejected promise when Polldaddy returns non-2xx response', () => {
      var packId = 1;
      // mock fetch: 404 status, i.e. did not get 200 response from Polldaddy
      var res = new fetch.Response('', {'status': 404});
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.resolve(res);
      };
      var expected = new Error('HTTP Request Failed');

      return Api.getLanguagePack(packId, 'userCode', fakeFetcher)
        .catch(function(result) {
          expect(result.message).to.equal(expected.message);
        });
    });

    it('returns rejected promise when Polldaddy.com could not be reached', () => {
      var packId = 1;
      // mock fetch: fetch promise rejects with TypeError if internet is down
      var expected = new TypeError('Failed to fetch');
      var fakeFetcher = function(url, obj) { // eslint-disable-line no-unused-vars
        return Promise.reject(expected);
      };

      return Api.getLanguagePack(packId, 'userCode', fakeFetcher)
        .catch(function(result) {
          expect(result.message).to.equal(expected.message);
        });
    });
  });
});
