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
            var userCode = data.pdResponse.userCode;
            resolve(userCode);
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
  }
};
