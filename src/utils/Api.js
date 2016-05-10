import keys from './private-keys';

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
      fetchApi('http://api.polldaddy.com/', obj)
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
  }
};
