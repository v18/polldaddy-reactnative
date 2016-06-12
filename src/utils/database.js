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
    return new Promise(function(resolve ) {
      db.transaction(function(txn) {
        txn.executeSql('INSERT INTO Surveys ('
          + 'surveyId, name, title, formXML, '
          + 'responses, lastSyncd, created, userId) VALUES '
          + '(?, ?, ?, ?, ?, ?, ?, ?);', [values.surveyId,
            values.name, values.title, values.formXML,
            values.responses, values.lastSyncd,
            values.created, values.userId]);
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
          .then(function() {
            resolve(true);
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
  }
};
