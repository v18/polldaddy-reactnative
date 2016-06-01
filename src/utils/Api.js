import _ from './lodash';
import keys from './private-keys';

keys.apiUrl = 'https://api.polldaddy.com/';

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
            var response = data.pdResponse.demands.demand[0].survey;
            if(!response) {
              throw new Error('No item data received');
            }
            var surveyXml = response.survey_xml;
            var formXml = response.rule_xml;
            if(formXml) {
              surveyXml = _.replaceLastOccurence(
                surveyXml,
                '</formData>',
                `${formXml}</formData>`);
            }
            var item = {
              title: response.title,
              name: response.name,
              id: response.id,
              surveyXml: surveyXml
            };
            resolve(item);
          }
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

    return new Promise(function(resolve, reject) {
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
          } else {
            if(!data.pdResponse.demands.demand[0].languagepack || !data.pdResponse.demands.demand[0].languagepack.pack) {
              throw new Error('No language pack with that ID');
            }

            var phrases = data.pdResponse.demands.demand[0].languagepack.pack.phrase;

            var result = {};
            phrases.map(function(item) {
              result[Number(item.phraseId)] = String(item.content);
            });
            resolve(JSON.stringify(result));
          }
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }
};
