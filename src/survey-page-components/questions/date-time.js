import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  TimePickerAndroid,
  TouchableWithoutFeedback,
  View
 } from 'react-native';
import _ from 'lodash';
import Actions from '../../actions/current-question';
import DateFormat from 'dateformat';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      inputs: {
        dd: '',
        mm: '',
        yyyy: '',
        h: '',
        m: ''
      },
      formattedDate: this.getFormattedDateText(),
      formattedTime: this.getFormattedTimeText(),
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (newState) {
    this.setState(newState);

    var questionId = Number(this.props.question.attr.qID);
    var questionType = Number(this.props.question.attr.qType);

    var error = this.getError();
    if(!error) {
      // if validated with no errors, save to answer
      this.setState({
        answers: this.state.inputs
      });
      var answersToSend = this.getAnswersInPhpFormat(this.state.inputs);
      Actions.saveAnswers(questionId, questionType, answersToSend);
    } else {
      // if not validated, remove answer & save error instead
      this.setState({
        answers: ''
      });
      Actions.saveError(error);
    }
  },
  render: function () {
    return (
      <View style={styles.container}>
        {this.renderDateRow()}
        {this.renderTimeRow()}
      </View>
    );
  },
  renderDateRow: function () {
    if(this.shouldShowDate()) {
      return(
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <TouchableWithoutFeedback onPress={this.showDatePicker}>
            <View style={styles.value}>
              <Text>{this.state.formattedDate}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>);
    }
  },
  renderTimeRow: function () {
    if(this.shouldShowTime()) {
      return(
        <View style={styles.row}>
          <Text style={styles.label}>Time:</Text>
          <TouchableWithoutFeedback onPress={this.showTimePicker}>
            <View style={styles.value}>
              <Text>{this.state.formattedTime}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>);
    }
  },
  showDatePicker: function () {
    var now = new Date();
    var year = this.state.inputs.yyyy || now.getFullYear();
    var month = this.state.inputs.mm || now.getMonth();
    var date = this.state.inputs.dd || now.getDate();
    var displayDate = new Date(year, month, date);

    DatePickerAndroid.open({
      date: displayDate.getTime()
    })
      .then((userInput) => {
        if(userInput.action === 'dateSetAction') {
          var formattedDate = this.getFormattedDateText(userInput.year,
            userInput.month, userInput.day);
          var formattedTime = this.state.formattedTime;
          this.onInputsChange({
            inputs: {
              dd: userInput.day,
              mm: userInput.month,
              yyyy: userInput.year,
              h: this.state.inputs.h,
              m: this.state.inputs.m
            },
            formattedDate,
            formattedTime
          });
        }
      });
  },
  showTimePicker: function () {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();

    if(this.state.inputs.h !== ''
      && this.state.inputs.m !== '') {
        // don't trip up on 0 == false
      hour = this.state.inputs.h;
      minute = this.state.inputs.m;
    }

    TimePickerAndroid.open({
      hour,
      minute
    })
      .then((userInput) => {
        if(userInput.action === 'timeSetAction') {
          var formattedDate = this.state.formattedDate;
          var formattedTime = this.getFormattedTimeText(userInput.hour,
            userInput.minute);
          this.onInputsChange({
            inputs: {
              dd: this.state.inputs.dd,
              mm: this.state.inputs.dd,
              yyyy: this.state.inputs.yyyy,
              h: userInput.hour,
              m: userInput.hour
            },
            formattedDate,
            formattedTime
          });
        }
      });
  },
  shouldShowTime: function (question = this.props.question) {
    var type = Number(question.childNamed('type').val);
    switch(type) {
      case 0:
        return true;
      case 1:
        return true;
      case 2:
        return false;
      case 3:
        return false;
      case 4:
        return true;
    }
  },
  shouldShowDate: function (question = this.props.question) {
    var type = Number(question.childNamed('type').val);
    switch(type) {
      case 0:
        return true;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return false;
    }
  },
  getFormattedDateText: function (year, month, date) {
    if(typeof year === 'number'
      && typeof month === 'number'
      && typeof date === 'number') {
      var displayDate = new Date(year, month, date);
      var formattedDate = DateFormat(displayDate, 'mmmm d, yyyy');
      return formattedDate;
    }
    return 'Select a date';
  },
  getFormattedTimeText: function (hour = '', minute = '') {
    if(hour !== '' && minute !== '') {
      var time = new Date(1970, 1, 1, hour, minute);
      var formattedTime = DateFormat(time, 'HH:MM');
      return formattedTime;
    }
    return 'Select a time';
  },
  getError: function (question = this.props.question,
    inputs=this.state.inputs) {

    var error = false;
    var isMand = false;
    var mandField = question.childNamed('mand');

    if(mandField && mandField.val === 'true') {
      isMand = true;
    }
    var dateIsMand = this.shouldShowDate(question) && isMand;
    var timeIsMand = this.shouldShowTime(question) && isMand;

    if(dateIsMand) {
      if(inputs.dd === ''
        || inputs.mm === ''
        || inputs.yyyy === '') {
        error = 'mandatory';
      }
    }

    if(timeIsMand && error === false) {
      if(inputs.h === ''
        || inputs.m === '') {
        error = 'mandatory';
      }
    }

    return error;
  },
  getAnswersInPhpFormat: function (inputs = this.state.inputs) {
    // js months go 0-11, php months go 1-12
    var newInputs = _.cloneDeep(inputs);
    if(typeof inputs.mm === 'number') {
      newInputs.mm = inputs.mm + 1;
    }
    return newInputs;
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  },
  label: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  value: {
    right: 0,
    marginRight: 10
  }
});
