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
import Api from './utils/Api';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
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
    AsyncStorage.getItem('userCode')
      .then(function(userCode) {
        return Promise.all(['survey','quiz'].map(function(type) {
          return Api.getRemoteListOf(type, userCode);
        }));
      })
      .then(function(values) {
        var data = this.formatSurveyAndQuizData(values, this.state.selectedItems);
        this.setState({
          data: data,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data)
        });
      }.bind(this))
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
            "Sorry, we couldn't get the surveys and quizzes from Polldaddy.com just now. Please try again later.");
        }
      }.bind(this));
  },
  render: function() {
    return (<View style={styles.container}>
      <ToolbarAndroid
          actions={toolbarActions}
          navIcon={require('./img/close/ic_close_white.png')}
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
    var itemId = this.state.data[sectionId][rowId].id;
    var newSelectedItems = this.toggleSelectedItem(itemId, this.state.selectedItems);

    this.setState({
      selectedItems: newSelectedItems
    });
    var newData = this.formatSurveyAndQuizData(this.state.data, this.state.selectedItems);

    this.setState({
      data: newData,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newData)
    });
  },
  formatSurveyAndQuizData:function(originalDataArray, selectedItemsArray) {
    var formattedDataArray = originalDataArray.map(function(contentItems) {
      return contentItems.map(function(contentItem) {
        return {
          selected: (selectedItemsArray.indexOf(contentItem.id) === -1 ? false : true),
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
  toggleSelectedItem: function(itemId, array) {
    var newArray = array.slice();
    var index = newArray.indexOf(itemId);
    if(index === -1) {
      newArray.push(itemId);
    } else {
      newArray.splice(index, 1);
    }
    return newArray;
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
