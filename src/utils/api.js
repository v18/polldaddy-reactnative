import _ from './lodash';
import keys from './private-keys';
import { Platform } from 'react-native';

keys.apiUrl = 'https://api.polldaddy.com/';
var platformVersion = Platform.Version || 'unknown';

module.exports = {
  signin: function(email, password, fetchApi) {
    if(!fetchApi) {
      fetchApi = fetch;
    }

    var obj = {
      method: 'POST',
      body: JSON.stringify({
        pdInitiate: {
          partnerGUID: keys.partnerGUID,
          partnerUserID: 0,
          email: email,
          password: password
        }
      })
    };

    return new Promise(function(resolve, reject) {
      fetchApi(keys.apiUrl, obj)
        .then(function(response) {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('HTTP Request Failed');
          }
        }).then(function(data) {
          if(data.pdResponse.hasOwnProperty('userCode')) {
            resolve({
              userCode: data.pdResponse.userCode,
              userId: data.pdResponse.partnerUserID
            });
          } else {
            throw new Error('Could not log in');
          }
        })
        .catch(function(error) {
          reject(error);
        })
        .done();
    });
  },
  getRemoteSurveysList: function(userCode, fetchApi) {
    return this.getRemoteListOf('survey', userCode, fetchApi);
  },
  getRemoteQuizzesList: function(userCode, fetchApi) {
    return this.getRemoteListOf('quiz', userCode, fetchApi);
  },
  getRemoteListOf: function(contentType, userCode, fetchApi) {
    var type;
    if(contentType === 'survey') {
      type = {
        single: 'survey',
        plural: 'surveys',
        demand: 'getsurveys'
      };
    } else if(contentType === 'quiz') {
      type = {
        single: 'quiz',
        plural: 'quizzes',
        demand: 'getquizzes'
      };
    }

    if(!fetchApi) {
      fetchApi = fetch;
    }

    var obj = {
      method: 'POST',
      body: JSON.stringify({
        pdRequest: {
          partnerGUID: keys.partnerGUID,
          userCode: userCode,
          demands: {
            demand: {
              id: type.demand
            }
          }
        }
      })
    };

    return new Promise(function(resolve, reject) {
      fetchApi('http://api.polldaddy.com/', obj)
        .then(function(response) {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('HTTP Request Failed');
          }
        })
        .then(function(data) {
          if(data.pdResponse.errors) {
            var error = data.pdResponse.errors.error[0].content;
            throw new Error(error);
          } else {
            var list = data.pdResponse.demands.demand[0][type.plural][type.single] || [];
            resolve(list);
          }
        })
        .catch(function(error) {
          reject(error);
        })
        .done();
    });
  },
  getItem: function(itemId, userCode, fetchApi) {
    if(!fetchApi) {
      fetchApi = fetch;
    }

    var obj = {
      method: 'POST',
      body: JSON.stringify({
        pdRequest: {
          partnerGUID: keys.partnerGUID,
          userCode: userCode,
          demands: {
            demand: {
              id: 'getsurvey' ,
              survey: {
                id: itemId
              }
            }
          }
        }
      })
    };

    return new Promise(function(resolve, reject) {
      fetchApi('http://api.polldaddy.com/', obj)
        .then(function(response) {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('HTTP Request Failed');
          }
        })
        .then(function(data) {
          if(data.pdResponse.errors) {
            var error = data.pdResponse.errors.error[0].content;
            throw new Error(error);
          } else {
            var survey = data.pdResponse.demands.demand[0].survey;
            if(!survey) {
              throw new Error('No item data received');
            } else {
              return Promise.resolve(survey);
            }
          }
        })
        .then(function (survey) {
          var surveyXml = survey.survey_xml;
          var formXml = survey.rule_xml;
          if(formXml) {
            surveyXml = _.replaceLastOccurence(
              surveyXml,
              '</formData>',
              `${formXml}</formData>`);
          }
          var item = {
            title: survey.title,
            name: survey.name,
            id: survey.id,
            surveyXml: surveyXml,
            packId: Number(survey.pack_id)
          };
          return Promise.resolve(item);
        })
        .then(function (item) {
          resolve(item);
        })
        .catch(function(error) {
          reject(error);
        })
        .done();
    });
  },
  getLanguagePack: function(packId, userCode, fetchApi) {
    if(!fetchApi) {
      fetchApi = fetch;
    }

    var obj = {
      method: 'POST',
      body: JSON.stringify({
        pdRequest: {
          partnerGUID: keys.partnerGUID,
          userCode: userCode,
          demands: {
            demand: {
              id: 'getpack',
              languagepack: {
                id: packId
              }
            }
          }
        }
      })
    };

    return new Promise(function(resolve) {
      fetchApi(keys.apiUrl, obj)
        .then(function(response) {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('HTTP Request Failed');
          }
        })
        .then(function(data) {
          if(data.pdResponse.errors) {
            var error = data.pdResponse.errors.error[0].content;
            throw new Error(error);
          } else if(!data.pdResponse.demands.demand[0].languagepack || !data.pdResponse.demands.demand[0].languagepack.pack) {
            throw new Error('No language pack with that ID');
          } else {
            var phrases = data.pdResponse.demands.demand[0].languagepack.pack.phrase;
            resolve(phrases);
          }
        })
        .catch(function() {
          // if we can't get language pack
          // resolve with empty language pack
          resolve([]);
        });
    });
  },
  sendResponse: function (info, fetchApi) {
    if(!fetchApi) {
      fetchApi = fetch;
    }

    var obj = {
      method: 'POST',
      body: JSON.stringify({
        pdRequest: {
          partnerGUID: keys.partnerGUID,
          userCode: info.userCode,
          demands: {
            demand: {
              id: 'submitsurveyresponse',
              survey_response: {
                survey_id: info.surveyId,
                end_date: info.endDate,
                start_date: info.startDate,
                xml: info.responseXML,
                completed: info.completed,
                tags: [
                  {
                    value: 'Android',
                    name: 'source'
                  },
                  {
                    value: 'v1.0',
                    name: 'version'
                  },
                  {
                    value: platformVersion,
                    name: 'platform'
                  }
                ]
              }
            }
          }
        }
      })
    };

    return new Promise(function(resolve, reject) {
      fetchApi(keys.apiUrl, obj)
        .then(function(response) {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('HTTP Request Failed');
          }
        })
        .then(function (response) {
          if(response.pdResponse.errors) {
            var error = response.pdResponse.errors.error[0].content;
            throw new Error(error);
          } else {
            resolve(response);
          }
        })
        .catch(function (error) {
          reject(error);
        })
        .done();
    });

  }
};
