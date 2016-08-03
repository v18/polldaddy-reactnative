import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import Api from './utils/api';
import async from 'async';
import CurrentSurvey from './utils/current-survey';
import Database from './utils/database';
import React from 'react';
import ResponsesStore from './stores/responses-store';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      responses: this.props.route.responses,
      isLoaded: false,
      isSyncing: false,
      totalResponesToSync: 0,
      responseCurrentlySyncing: 0
    };
  },
  componentWillMount: function () {
    // save the current survey
    CurrentSurvey.set(this.props.route.surveyId, this.props.route.userId)
      .then(() => {
        this.setState({
          isLoaded: true
        });
      })
      .catch(() => {
        Alert.alert('Error',
          'Sorry we were not able to load the survey, please go back and try again.',
          [{
            text: 'Ok',
            onPress: () => {this.props.navigator.pop();} // eslint-disable-line react/jsx-no-bind
          }]);
      });
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
    if(typeof responseNumbers[this.props.route.surveyId] === 'number') {
      this.setState({
        responses: responseNumbers[this.props.route.surveyId]
      });
    }
  },
  render: function () {
    return (<View style={styles.container}>
      {this.renderSyncModal()}
      <ToolbarAndroid
          navIcon={require('./img/back/ic_arrow_back_white.png')}
          onIconClicked={() => {this.props.navigator.pop();}} // eslint-disable-line react/jsx-no-bind
          style={styles.toolbar}
          title={this.props.route.surveyTitle}
          titleColor='#FFF'
      />
      <View>
        <TouchableHighlight
            onPress={this.handleStartSurveyPress}
            style={[styles.button]}
            underlayColor='#e0e0e0'
        >
          <Text style={[styles.text, loadingButton(this.state.isLoaded)]}>Start survey</Text>
        </TouchableHighlight>
        {this.renderSyncButton()}
      </View>
    </View>);
  },
  renderSyncButton: function () {
    if(this.state.responses > 0) {
      return (
        <TouchableHighlight
            onPress={() => this.handleSync(this.state.responses)} // eslint-disable-line react/jsx-no-bind
            style={styles.button}
            underlayColor='#e0e0e0'
        >
          <Text style={styles.text}>
            Sync {this.state.responses} offline responses
          </Text>
        </TouchableHighlight>
      );
    }
  },
  renderSyncModal: function () {
    return (
      <Modal
          animationType={'slide'}
          onRequestClose={function () {}}
          transparent={true}
          visible={this.state.isSyncing}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Syncing {this.state.responseCurrentlySyncing} of {this.state.totalResponesToSync} responses
            </Text>
          </View>
        </View>
      </Modal>
    );
  },
  handleSync: function (totalResponesToSync) {
    this.setState({
      isSyncing: true,
      responseCurrentlySyncing: 0,
      totalResponesToSync: totalResponesToSync
    });
    // get responses from db
    var userId = this.props.route.userId,
      userCode = this.props.route.userCode,
      surveyId = this.props.route.surveyId;
    return Database.getResponses(surveyId, userId)
      .then((responses) => {
        responses = responses.map(function (response) {
          return _.assign({}, response, {
            userCode: userCode
          });
        });
        return this._syncResponsesInSeries(responses);
      })
      .catch(function () {
        // at least 1 response was not synched succesfully, possible errors:
        // 1. Polldaddy.com communication
        // 2. removing response from database
        Alert.alert(
          'Error Syncing Responses',
          'There was an error syncing responses. Please try again.');
      })
      .done(() => {
        this.setState({
          isSyncing: false,
          responseCurrentlySyncing: 0,
          totalResponesToSync: 0
        });
      });
  },
  handleStartSurveyPress: function() {
    CurrentSurvey.getNextQuestion()
      .then((question) => {
        this.props.navigator.push({
          name: 'surveyPage',
          question: question
        });
      })
      .catch((error) => {
        Alert.alert('Error',
          error.message,
          [{
            text: 'Ok',
            onPress: () => {this.props.navigator.pop();}
          }]);
      });
  },
  _syncResponsesInSeries: function (responses) {
    return new Promise((resolve, reject) => {
      async.eachSeries(responses, this._syncResponse, function (error) {
        if(error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  },
  _syncResponse: function (response, doneCallback) {
    this.setState({
      responseCurrentlySyncing: this.state.responseCurrentlySyncing + 1
    });
    // send responses to Polldaddy.com
    Api.sendResponse({
      endDate: response.endDate,
      startDate: response.startDate,
      surveyId: response.surveyId,
      completed: response.completed,
      responseXML: response.responseXML,
      userCode: response.userCode
    })
    .then(function () {
      // delete response from database
      return Database.deleteResponse(response.surveyId, response.responseId, response.userId);
    })
    .then(() => {
      doneCallback(null, true);
    })
    .catch(function (error) {
      doneCallback(error);
    })
    .done();
  }
});

var loadingButton = function (isLoaded) {
  var color = '#e0e0e0';
  if(isLoaded) {
    color = '#000';
  }
  return {
    color: color
  };
};

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  },
  text: {
    marginLeft: 16,
    color: 'black',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 32,
    elevation: 1
  },
  modalText: {
    color: 'black',
    fontSize: 16
  }
});
