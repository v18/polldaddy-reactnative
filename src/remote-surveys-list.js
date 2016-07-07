import {
  Alert,
  AsyncStorage,
  Image,
  ListView,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';
import _ from './utils/lodash';
import Api from './utils/api';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.selected !== r2.selected,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    return {
      dataSource: ds,
      selectedItems: [],
      sectionNames: ['Select Surveys to Use Offline',
        'Select Quizzes to Use Offline']
    };
  },
  componentWillMount: function() {
    // save the selected items from savedSurveysList
    new Promise(function(resolve) {
      if(this.props && this.props.route && this.props.route.selectedItems) {
        var newSelectedItems = this.props.route.selectedItems.map(
          function (item) {
            var newItem = _.assign(item, {selected: true});
            return newItem;
          });
        this.setState({
          selectedItems: newSelectedItems
        }, function () {
          resolve(AsyncStorage.getItem('userCode'));
        });
      }
    }.bind(this))
      .then(function(userCode) {
        return Promise.all(['survey','quiz'].map(function(type) {
          return Api.getRemoteListOf(type, userCode);
        }));
      })
      .then((values) => {
        var data = this.formatSurveyAndQuizData(values, this.state.selectedItems);
        this.setState({
          data: data,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data)
        });
      })
      .catch(function(error) {
        switch (error.message) {
          case 'No surveys or quizzes found':
            Alert.alert(
              'Whoops',
              'Your account does not have any surveys or quizzes yet. Try adding some at Polldaddy.com first.');
            break;
          case 'User Not Found, 4366':
            Alert.alert('Whoops',
              "You're not logged in, please go back and log in.",
              [{text: 'Ok, take me to the login page',
                onPress: () => {
                  this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);
                }
            }]);
            break;
          default:
            Alert.alert('Error',
              "Sorry, we couldn't get the surveys and quizzes from Polldaddy.com just now. Please try again later.",
            [{
              text: 'Ok',
              onPress: () => {
                this.props.navigator.immediatelyResetRouteStack([{
                  name: 'savedSurveysList',
                  selectedItems: []
                }]);
              }
            }]);
        }
      }.bind(this));
  },
  render: function() {
    return (<View style={styles.container}>
      <ToolbarAndroid
          actions={toolbarActions}
          navIcon={require('./img/close/ic_close_white.png')}
          onActionSelected={this.onActionSelected}
          onIconClicked={() => this.props.navigator.pop()} // eslint-disable-line react/jsx-no-bind
          style={styles.toolbar}
          title='Select Surveys and Quizzes'
          titleColor='#FFF'
      />
    <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
    />
    </View>);
  },
  renderRow: function(rowData, sectionId, rowId) {
    var imgSrc = rowData.selected ? require('./img/check/ic_done_red.png') : require('./img/check/empty_checkmark.png');
    return (
      <TouchableHighlight
          onPress={() => this.handleRowClick(sectionId, rowId)} // eslint-disable-line react/jsx-no-bind
          style={styles.rowContainer}
          underlayColor='#e0e0e0'
      >
        <View style={styles.row}>
          <View style={styles.checkbox}>
            <Image
                source={imgSrc}
                style={styles.checkboxImg}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.rowText}>{rowData.title}</Text>
          </View>
        </View>
      </TouchableHighlight>);
  },
  renderSectionHeader: function(sectionData, sectionId) {
    return (<View style={styles.sectionHeader}>
      <Text>{this.state.sectionNames[sectionId]}</Text>
    </View>);
  },
  handleRowClick: function(sectionId, rowId) {
    var item = {
      id: this.state.data[sectionId][rowId].id,
      title: this.state.data[sectionId][rowId].title,
      selected: this.state.data[sectionId][rowId].selected
    };
    var newSelectedItems = _.toggleSelectedItem(item, this.state.selectedItems);

    this.setState({
      selectedItems: newSelectedItems
    });

    var newData = this.formatSurveyAndQuizData(this.state.data, newSelectedItems);

    this.setState({
      data: newData,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newData)
    });

  },
  formatSurveyAndQuizData: function (originalDataArray, selectedItemsArray) {
    var formattedDataArray = originalDataArray.map((contentItems) => {
      return contentItems.map((contentItem) => {
        var isSelected = (_.indexOfItem(selectedItemsArray, contentItem.id) !== -1) ? true : false;
        return {
          selected: isSelected,
          title: contentItem.title,
          id: contentItem.id
        };
      });
    });
    if(!formattedDataArray[0] && !formattedDataArray[0]) {
      throw new Error('No surveys or quizzes found');
    }
    return formattedDataArray;
  },
  onActionSelected: function(index) {
    if(index === 0) { // save button
      // hack: use immediatelyResetRouteStack to send props on route
      var selectedItemsToSend = this.state.selectedItems.map(function(item) {
        delete item.selected;
        return item;
      });
      this.props.navigator.immediatelyResetRouteStack([{
        name: 'savedSurveysList',
        selectedItems: selectedItemsToSend
      }]);
    }
  }
});

var toolbarActions = [{title: 'Save', show: 'always'}];

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  rowContainer: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1
  },
  checkbox: {
    marginRight: 16,
    marginLeft: 16
  },
  rowText: {
    color: 'black',
    fontSize: 16
  },
  row: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    marginRight: 16
  },
  sectionHeader: {
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#e0e0e0',
    paddingLeft: 16
  }
});
