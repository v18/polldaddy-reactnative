import {
  AsyncStorage,
  ListView,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';
import _ from './utils/lodash';
import Api from './utils/api';
import Database from './utils/database';
import React from 'react';

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
    ]).then((userValues) => {
      var userId = userValues[0], userCode = userValues[1];
      if(!userCode || !userId) {
        throw new Error('no user saved');
      }
      this.setState({
        userCode: userCode,
        userId: userId
      });
      return userId;
    })
    .then(function(userId) {
      return Database.getItems(parseInt(userId));
    })
    .then((databaseItems) => {
      var items = {toDisplay: databaseItems, toSave: [], toDelete: []};
      if(_.has(this,'props.route.selectedItems')) {
        items = _.combineItemLists(databaseItems, this.props.route.selectedItems);
      }

      this.setState({
        items: items.toDisplay,
        dataSource: this.state.dataSource.cloneWithRows(items.toDisplay)
      });

      Database.removeItems(items.toDelete);
      this.saveItemsToDatabase(items.toSave);
    })
    .catch(function (error) {
      throw error;
    })
    .done();
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
  renderRow: function(rowData) {
    return (
      <TouchableHighlight
          onPress={() => {this.handleRowClick(rowData);}} // eslint-disable-line react/jsx-no-bind
          underlayColor='#e0e0e0'
      >
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{rowData.title}</Text>
          <Text style={styles.responses}>{rowData.responses} offline responses</Text>
        </View>
      </TouchableHighlight>
    );
  },
  onActionSelected: function(position) {
    if(position === 0) {
      var selectedItems = this.state.items.map(function (item) {
        delete item.saved;
        delete item.responses;
        return item;
      });
      this.props.navigator.push({
        name: 'remoteSurveysList',
        selectedItems: selectedItems
      });
    }
  },
  handleRowClick: function (rowData) {
    this.props.navigator.push({
      name: 'surveyLauncher',
      surveyId: rowData.id,
      surveyTitle: rowData.title,
      responses: rowData.responses
    });
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
            responses: 0,
            lastSyncd: _.now(),
            created: _.now(),
            userId: this.state.userId
          });
        })
        .then((itemId) => {
          // when saved, change status to saved in state
          var itemIndex = _.indexOfItem(this.state.items, itemId);
          var newItems = this.state.items.slice();
          newItems[itemIndex].saved = true;
          this.setState({
            items: newItems,
            dataSource: this.state.dataSource.cloneWithRows(newItems)
          });
        })
        .catch(function (error) {
          throw error;
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
  },
  rowContainer: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 72,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center'
  },
  title: {
    color: 'black',
    fontSize: 16,
    marginTop: 20
  },
  responses: {
    marginTop: 2,
    marginBottom: 20,
    fontSize: 14
  }
});
