import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  TimePickerAndroid,
  TouchableWithoutFeedback,
  View
 } from 'react-native';
import Actions from '../../actions/current-question';
import DateFormat from 'dateformat';
import InputsStore from '../../stores/inputs-store';
import React from 'react';

var errorMessages = {
  mandatory: 'This is a mandatory question.'
};

module.exports = React.createClass({
  componentDidMount: function () {
    this.unsubscribeFromInputs = InputsStore.listen(this.onInputsChange);
    this.focusListener = this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.focusListener.remove();
      this.unsubscribeFromInputs();
    });
  },
  componentWillUnmount: function () {
    if(this.focusListener) {
      this.focusListener.remove();
    }
    if(this.unsubscribeFromAnswers) {
      this.unsubscribeFromAnswers();
    }
  },
  getInitialState: function () {
    return {
      inputs: {
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
        formattedDate: this.getFormattedDateText(),
        formattedTime: this.getFormattedTimeText()
      },
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (inputs) {
    this.setState({
      inputs: inputs
    });

    var error = this.getError();
    if(!error) {
      // if validated with no errors, save to answer
      this.setState({
        answers: this.state.inputs
      });
      Actions.saveAnswers(this.state.answers);
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
              <Text>{this.state.inputs.formattedDate}</Text>
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
              <Text>{this.state.inputs.formattedTime}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>);
    }
  },
  showDatePicker: function () {
    var now = new Date();
    var year = this.state.inputs.year || now.getFullYear();
    var month = this.state.inputs.month || now.getMonth();
    var date = this.state.inputs.date || now.getDate();
    var displayDate = new Date(year, month, date);

    DatePickerAndroid.open({
      date: displayDate.getTime()
    })
      .then((userInput) => {
        if(userInput.action === 'dateSetAction') {
          var formattedDate = this.getFormattedDateText(userInput.year,
            userInput.month, userInput.day);
          var formattedTime = this.state.inputs.formattedTime;
          this.onInputsChange({
            date: userInput.day,
            month: userInput.month,
            year: userInput.year,
            hour: this.state.inputs.hour,
            minute: this.state.inputs.minute,
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

    if(this.state.inputs.hour !== ''
      && this.state.inputs.minute !== '') {
        // don't trip up on 0 == false
      hour = this.state.inputs.hour;
      minute = this.state.inputs.minute;
    }

    TimePickerAndroid.open({
      hour,
      minute
    })
      .then((userInput) => {
        if(userInput.action === 'timeSetAction') {
          var formattedDate = this.state.inputs.formattedDate;
          var formattedTime = this.getFormattedTimeText(userInput.hour,
            userInput.minute);
          this.onInputsChange({
            date: this.state.inputs.date,
            month: this.state.inputs.month,
            year: this.state.inputs.year,
            hour: userInput.hour,
            minute: userInput.minute,
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
    if(year && month && date) {
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
    inputs=this.state.inputs, errors = errorMessages) {

    var error = false;
    var isMand = false;
    var mandField = question.childNamed('mand');

    if(mandField && mandField.val === 'true') {
      isMand = true;
    }
    var dateIsMand = this.shouldShowDate(question) && isMand;
    var timeIsMand = this.shouldShowTime(question) && isMand;

    if(dateIsMand) {
      if(inputs.date === ''
        || inputs.month === ''
        || inputs.year === '') {
        error = errors.mandatory;
      }
    }

    if(timeIsMand && error === false) {
      if(inputs.hour === ''
        || inputs.minute === '') {
        error = errors.mandatory;
      }
    }

    return error;
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
