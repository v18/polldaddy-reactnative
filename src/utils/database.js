import imagesApi from './local-image-api';
import imageUtils from './image-utils';
import ResponsesActions from '../actions/responses';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

var db_name = 'polldaddy.sql';
var db_version = '1.0';
var db;

SQLite.openDatabase({name: db_name, version: db_version})
  .then(function(database) {
    db = database;
    db.transaction(function(txn) {
      txn.executeSql(`CREATE TABLE IF NOT EXISTS Surveys
        (surveyId INTEGER PRIMARY KEY NOT NULL,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        formXML TEXT NOT NULL,
        responses INTEGER NOT NULL,
        lastSyncd DATETIME NOT NULL,
        created DATETIME NOT NULL,
        userId INTEGER NOT NULL DEFAULT 0);`)
        .catch(function(error) {
          throw error;
        })
        .done();

      txn.executeSql(`CREATE TABLE IF NOT EXISTS Responses
        (responseId INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE,
          surveyId INTEGER NOT NULL,
        responseXML TEXT NOT NULL,
        startDate DATETIME,
        endDate DATETIME,
        completed INTEGER NOT NULL DEFAULT 0,
        latitude FLOAT,
        longitude FLOAT,
        userId INTEGER NOT NULL DEFAULT 0);`)
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
    return new Promise((resolve) => {
      imagesApi.downloadAllImagesForSurvey(values.surveyId, values.formXML)
        .then(function (images) {
          images.map(function(image) {
            if(image.original !== image.local) { // if we have a local image
              values.formXML = imageUtils.replaceAllInSurveyXml(values.formXML, image.original, image.local);
            }
          });
          return Promise.resolve();
        })
        .then(() => {
          // get the number of responses
          return this.getResponses(values.surveyId, values.userId);
        })
        .then(function (responses) {
          var numResponses = responses.length;
          return new Promise(function(resolve) {
            db.transaction(function(txn) {
              txn.executeSql(`INSERT INTO Surveys
                (surveyId, name, title, formXML,
                responses, lastSyncd, created, userId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [values.surveyId,
                  values.name, values.title, values.formXML,
                  numResponses, values.lastSyncd,
                  values.created, values.userId]);
            })
            .then(function () {
              resolve(numResponses);
            });
          });
        })
        .then(function (numResponses) {
          ResponsesActions.setResponsesFromDatabase(values.surveyId, numResponses);
          resolve(values.surveyId);
        })
        .catch(function (error) {
          throw error;
        })
        .done();
    });
  },
  removeItems: function(itemArray, userId) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        itemArray.map(function (itemId) {
          txn.executeSql(`DELETE FROM Surveys
            WHERE surveyId=(?)
            AND userId=(?);`, [itemId, userId])
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
        txn.executeSql(`SELECT * FROM Surveys
          WHERE surveyId=(?)
          AND userId=(?);`, [surveyId, userId])
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
        txn.executeSql(`SELECT surveyId, title, responses
          FROM Surveys
          WHERE userId=(?);`, [userId])
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
  saveResponse: function (options) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(`INSERT INTO Responses
          (surveyId, responseXML, startDate, endDate,
          completed, latitude, longitude, userId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [options.surveyId,
            options.responseXML, options.startDate, options.endDate,
            options.completed, options.latitude,
            options.longitude, options.userId]);
      })
      .then(() => {
        // get the total responses
        return this.getResponses(options.surveyId, options.userId);
      })
      .then((results) => {
        // update the total in db
        return this.updateResponsesTotal(options.surveyId, options.userId, results.length);
      })
      .catch(function () {
        reject(new Error('no saved result'));
      })
      .then(function (total) {
        // update the total in store
        ResponsesActions.setResponsesFromDatabase(options.surveyId, total);
        resolve();
      })
      .catch(function () {
        reject(new Error('not saved in store'));
      })
      .done();
    });
  },
  deleteResponse: function (surveyId, responseId, userId) {
    return new Promise((resolve, reject) => {
      // delete from db
      db.transaction((txn) => {
        txn.executeSql(`DELETE FROM Responses
          WHERE responseId=?
          AND surveyId=?;`, [responseId, surveyId]);
      })
      .then(() => {
        // get number of responses
        return this.getResponses(surveyId, userId);
      })
      .then((responses) => {
        // update surveys db
        var numResponses = responses.length;
        return this.updateResponsesTotal(surveyId, userId, numResponses);
      })
      .then(function (total) {
        // update store
        ResponsesActions.setResponsesFromDatabase(surveyId, total);
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
    });
  },
  getResponses: function (surveyId, userId) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        txn.executeSql(`SELECT * FROM Responses
          WHERE surveyId=(?)
          AND userId=(?);`, [surveyId, userId])
          .then(function([txn, results]) { //eslint-disable-line no-unused-vars
            resolve(results.rows.raw());
          })
          .catch(function(error) {
            throw error;
          })
          .done();
      });
    });
  },
  updateResponsesTotal: function (surveyId, userId, newTotal) {
    return new Promise(function(resolve) {
      db.transaction(function(txn) {
        txn.executeSql(`UPDATE Surveys
          SET responses=(?)
          WHERE surveyId=(?)
          AND userId=(?);`,
          [newTotal, surveyId, userId])
          .then(function() {
            resolve(newTotal);
          })
          .catch(function(error) {
            throw error;
          })
          .done();
      });
    });
  }
};
