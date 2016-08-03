import {
  AsyncStorage,
  ListView,
  StyleSheet,
  Text,
  ToolbarAndroid,
  View
} from 'react-native';
import _ from './utils/lodash';
import Api from './utils/api';
import Database from './utils/database';
import React from 'react';
import ResponsesStore from './stores/responses-store';
import SavedSurveyRow from './saved-survey-row';

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return {
      items: [],
      dataSource: ds,
      userCode: '',
      userId: 0
    };
  },
  componentWillMount: function() {
    // save and/or delete items in database
    Promise.all([
      AsyncStorage.getItem('userId'),
      AsyncStorage.getItem('userCode')
    ]).then(([userId, userCode]) => {
      if(!userCode || !userId) {
        throw new Error('no user saved');
      }
      this.setState({
        userCode: userCode,
        userId: userId
      });
      return Promise.resolve(userId);
    })
    .then(function(userId) {
      return Database.getItems(parseInt(userId));
    })
    .then((databaseItems) => {
      var items = {toDisplay: databaseItems, toSave: [], toDelete: []};
      if(_.has(this,'props.route.selectedItems')) {
        items = _.combineItemLists(databaseItems, this.props.route.selectedItems);
      }
      return new Promise((resolve) => {
        this.setState({
          items: items.toDisplay,
          dataSource: this.state.dataSource.cloneWithRows(items.toDisplay)
        }, function () {
          resolve([items.toDelete, items.toSave]);
        });
      });
    })
    .then(([itemsToDelete, itemsToSave]) => {
      return Promise.all([
        Database.removeItems(itemsToDelete, this.state.userId),
        this.saveItemsToDatabase(itemsToSave)
      ]);
    })
    .catch(function (error) {
      throw error;
    })
    .done();
  },
  componentDidMount: function () {
    this.unsubscribeFromResponses = ResponsesStore.listen(this.onResponsesChange);
  },
  componentWillUnmount: function () {
    if(this.unsubscribeFromResponses) {
      this.unsubscribeFromResponses();
    }
  },
  onResponsesChange: function (responseNumbers) {
    var responsesSurveyIds = Object.keys(responseNumbers);
    var savedSurveyIds = _.map(this.state.items, 'id');

    responsesSurveyIds.map((surveyId) => {
      var id = Number(surveyId);
      if(savedSurveyIds.indexOf(id) > -1) {
        var newItems = _.cloneDeep(this.state.items);
        var surveyIndex = _.indexOfItem(newItems, id);

        newItems[surveyIndex].responses = responseNumbers[id];
        this.setState({
          items: newItems,
          dataSource: this.state.dataSource.cloneWithRows(newItems)
        });
      }
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
            actions={toolbarActions}
            onActionSelected={this.onActionSelected}
            style={styles.toolbar}
            title='My Surveys'
            titleColor='#FFF'
        />
      {this.renderContent()}
      </View>
    );
  },
  renderContent: function() {
    if(this.state.items.length !== 0) {
      return (
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
        />
      );
    } else {
      return (
        <View style={styles.info}>
          <Text style={styles.text}>
            You don't have any local surveys.
          </Text>
          <Text style={[styles.text, styles.link]}>
            Select Cloud Surveys
          </Text>
        </View>
      );
    }
  },
  renderRow: function (rowData) {
    return (
      <SavedSurveyRow
          handleRowClick={this.handleRowClick}
          rowData={rowData}
      />);
  },
  onActionSelected: function(position) {
    if(position === 0) {
      this.props.navigator.push({
        name: 'remoteSurveysList',
        selectedItems: this.state.items
      });
    }
  },
  handleRowClick: function (rowData) {
    if(rowData.saved) {
      this.props.navigator.push({
        name: 'surveyLauncher',
        surveyId: rowData.id,
        surveyTitle: rowData.title,
        responses: rowData.responses,
        userId: this.state.userId,
        userCode: this.state.userCode
      });
    }
  },
  saveItemsToDatabase: function(itemsToSave) {
    // save to database
    itemsToSave.map((itemId) => {
      Api.getItem(itemId, this.state.userCode)
        .then((item) => {
          return Database.insertItem({
            surveyId: item.id,
            name: item.name,
            title: item.title,
            formXML: item.surveyXml,
            lastSyncd: _.now(),
            created: _.now(),
            userId: this.state.userId
          });
        })
        .then((itemId) => {
          var newItems = _.cloneDeep(this.state.items);
          var itemIndex = _.indexOfItem(newItems, itemId);
          newItems[itemIndex].saved = true;
          this.setState({
            items: newItems,
            dataSource: this.state.dataSource.cloneWithRows(newItems)
          });
        })
        .catch(() => {
          // could not download or save item
          // remove item saved surveys list
          var newItems = _.cloneDeep(this.state.items);
          newItems = _.remove(newItems, function (item) {
            return item.id !== itemId;
          });
          this.setState({
            items: newItems,
            dataSource: this.state.dataSource.cloneWithRows(newItems)
          });
        })
        .done();
    });
  }
});

var toolbarActions = [
  {title: 'Select Polldaddy Surveys', icon: require('./img/cloud-icon/cloud-toolbar.png'), show: 'always'},
  {title: 'Sign out', show: 'never'}
];

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  info: {
    marginTop: 5
  },
  text: {
    textAlign: 'center',
    padding: 5
  },
  link: {
    color: '#B72422'
  }
});
