import imagesApi from './local-image-api';
import imageUtils from './image-utils';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

var db_name = 'polldaddy.sql';
var db_version = '1.0';
var db;

SQLite.openDatabase({name: db_name, version: db_version})
  .then(function(database) {
    db = database;
    db.transaction(function(txn) {
      txn.executeSql('CREATE TABLE IF NOT EXISTS Surveys( '
        + 'surveyId INTEGER PRIMARY KEY NOT NULL, '
        + 'name VARCHAR(100) NOT NULL, '
        + 'title VARCHAR(100) NOT NULL, '
        + 'formXML TEXT NOT NULL, '
        + 'responses INTEGER NOT NULL, '
        + 'lastSyncd DATETIME NOT NULL, '
        + 'created DATETIME NOT NULL, '
        + 'userId INTEGER NOT NULL DEFAULT 0); ')
        .catch(function(error) {
          throw error;
        })
        .done();

      txn.executeSql('CREATE TABLE IF NOT EXISTS Responses( '
        + 'responseId INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, '
        + 'surveyId INTEGER NOT NULL, '
        + 'responseXML TEXT NOT NULL, '
        + 'startDate DATETIME, '
        + 'endDate DATETIME, '
        + 'completed INTEGER NOT NULL DEFAULT 0, '
        + 'latitude FLOAT, '
        + 'longitude FLOAT, '
        + 'userId INTEGER NOT NULL DEFAULT 0); ')
        .catch(function(error) {
          throw error;
        })
        .done();
    });
  })
  .catch(function(error) {
    throw error;
  })
  .done();

module.exports = {
  insertItem: function(values) {
    return new Promise(function(resolve) {
      imagesApi.downloadAllImagesForSurvey(values.surveyId, values.formXML)
        .then(function (images) {
          images.map(function(image) {
            if(image.original !== image.local) { // if we have a local image
              values.formXML = imageUtils.replaceAllInSurveyXml(values.formXML, image.original, image.local);
            }
          });
          return Promise.resolve();
        })
        .then(function () {
          return db.transaction(function(txn) {
            txn.executeSql('INSERT INTO Surveys ('
              + 'surveyId, name, title, formXML, '
              + 'responses, lastSyncd, created, userId) VALUES '
              + '(?, ?, ?, ?, ?, ?, ?, ?);', [values.surveyId,
                values.name, values.title, values.formXML,
                values.responses, values.lastSyncd,
                values.created, values.userId]);
          });
        })
        .then(function () {
          resolve(values.surveyId);
        })
        .catch(function (error) {
          throw error;
        })
        .done();
    });
  },
  removeItems: function(itemArray) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        itemArray.map(function (itemId) {
          txn.executeSql('DELETE FROM Surveys WHERE surveyId=(?);', [itemId])
          .then(function () {
            // remove survey folder
            return imagesApi.deleteSurveyDirectory(itemId);
          })
          .then(function() {
            resolve();
          })
          .catch(function (error) {
            throw error;
          })
          .done();
        });
      });
    });
  },
  getItem: function(surveyId, userId) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        txn.executeSql('SELECT * FROM Surveys '
          + 'WHERE surveyId=(?); ', [surveyId])
          .then(function([txn, results]) { //eslint-disable-line no-unused-vars
            var item = results.rows.raw()[0];
            item.id = item.surveyId;
            delete item.surveyId;
            resolve(item);
          })
          .catch(function (error) {
            throw error;
          })
          .done();
      });
    });
  },
  getItems: function(userId) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        txn.executeSql('SELECT surveyId, title, responses FROM Surveys WHERE userId=(?);', [userId])
          .then(function([txn, results]) { //eslint-disable-line no-unused-vars
            var savedItems = results.rows.raw();
            if(savedItems.length > 0) {
              savedItems = savedItems.map(function (item) {
                item.id = item.surveyId;
                delete item.surveyId;
                item.saved = true;
                return item;
              });
            }
            resolve(savedItems);
          })
          .catch(function(error) {
            throw error;
          })
          .done();
      });
    });
  },
  saveAnswers: function (options) {
    return new Promise(function(resolve, reject) {
      db.transaction(function(txn) {
        txn.executeSql('INSERT INTO Responses ('
          + 'surveyId, responseXML, startDate, endDate, '
          + 'completed, latitude, longitude, userId) VALUES '
          + '(?, ?, ?, ?, ?, ?, ?, ?);', [options.surveyId,
            options.responseXML, options.startDate, options.endDate,
            options.completed, options.latitude,
            options.longitude, options.userId])
          .then(function () {
            resolve();
          })
          .catch(function () {
          })
          .done();
      })
      .catch(function () {
        reject(new Error('no saved result'));
      })
      .done();
    });
  },
  getAnswers: function (surveyId) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        txn.executeSql('SELECT responseId, surveyId, responseXML, startDate, endDate, completed, latitude, longitude, userId FROM Responses WHERE surveyId=(?);', [surveyId])
          .then(function([txn, results]) { //eslint-disable-line no-unused-vars
            resolve(results.rows.raw());
          })
          .catch(function(error) {
            throw error;
          })
          .done();
      });
    });
  }
};
