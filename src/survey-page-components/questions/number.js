import {
  Slider,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import SingleLineField from '../elements/single-line-field';

var errorsMessages = {
  mandatory: 'This is a mandatory question.',
  invalidNumber: 'Please enter a valid number',
  withinRange: 'Please enter a number within range'
};

module.exports = React.createClass({
  getInitialState: function () {
    return {
      inputs: {
        number: this.props.defaultValue
      },
      answers: {}
    };
  },
  componentDidMount: function () {
    this.unsubscribeFromInputs = InputsStore.listen(this.onInputsChange);
    this.focusListener = this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.focusListener.remove();
      this.unsubscribeFromInputs();
    });
  },
  componentWillUnmount: function () {
    this.focusListener.remove();
    this.unsubscribeFromInputs();
  },
  truncateNumber: function (text, decimalPlaces = this.props.decimalPlaces) {
    if (text.indexOf('..') > -1) { // don't let users type ".."
      text = text.slice(0, text.indexOf('..') + 1);
    } else if (text === '-'
      || text === '') {
      // let users type in negative numbers
    } else if(text.indexOf('.') > -1 ) {
      if(decimalPlaces > 0) {
        var decimalIndex = text.indexOf('.');
        var decimalsString = text.slice(decimalIndex + 1, text.length + 1);

        if(decimalsString.length > 0) {
          var integerString = text.slice(0, decimalIndex);

          // truncate to the correct number of decimal places
          decimalsString = decimalsString.slice(0, decimalPlaces);

          text = `${integerString}.${decimalsString}`.toString();
        }
      } else if (decimalPlaces === 0){
        text = text.slice(0, text.indexOf('.'));
      }
    } else if (decimalPlaces > 0
      && (text === '-0'|| text === '-0.')) {
      // let users type in negative decimals
    } else if (isNaN(Number(text))) {
      text = '';
    } else {
      // if does not have a decimal, convert to number
      text = Number(text).toString();
    }
    return text;
  },
  onInputsChange: function (inputs) {
    // save to state.input
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
    return (<View>
      {this.renderCorrectType()}
    </View>);
  },
  renderCorrectType: function () {
    if(this.props.isSlider) {
      return this.renderSlider();
    } else {
      return this.renderInput();
    }
  },
  renderSlider: function () {
    var step = Math.pow(10, this.props.decimalPlaces * -1);
    return (<View>
      <Slider
          maximumValue={this.props.max}
          minimumValue={this.props.min}
          onValueChange={this.handleOnSlidingComplete}
          step={step}
          value={Number(this.state.inputs.number)}
      />
      <View style={styles.sliderText}>
        {this.renderLabelBefore(this.props.labelPosition, this.props.labelValue)}
        <Text style={styles.sliderNumber}>
          {String(this.state.inputs.number)}
        </Text>
        {this.renderLabelAfter(this.props.labelPosition, this.props.labelValue)}
      </View>
    </View>);
  },
  handleOnSlidingComplete: function(value,
    decimalPlaces = this.props.decimalPlaces) {
    // truncate the number to the correct number of decimal places
    var truncatedNumber = value.toFixed(decimalPlaces);

    this.setState({
      inputs: {
        number: truncatedNumber
      }
    });
    Actions.saveInputs('number', truncatedNumber);
  },
  renderInput: function () {
    return (
      <View style={styles.textInputContainer}>
      {this.renderLabelBefore(this.props.labelPosition, this.props.labelValue)}
      <View style={styles.default}>
        <SingleLineField
            autoFocus={true}
            default={this.state.inputs.number.toString()}
            keyboardType='numeric'
            name='number'
            sanitizeText={this.truncateNumber}
        />
      </View>
      {this.renderLabelAfter(this.props.labelPosition, this.props.labelValue)}
      </View>);
  },
  renderLabel: function (label) {
    return <Text style={styles.sliderLabel}>{label}</Text>;
  },
  renderLabelBefore: function (labelPosition, label) {
    if(labelPosition === 'before') {
      return (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      );
    }
  },
  renderLabelAfter: function (labelPosition, label) {
    if(labelPosition === 'after') {
      return (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      );
    }
  },
  getError: function (props = this.props, number = this.state.inputs.number,
    errors = errorsMessages) {

    var isMandatory = props.isMandatory;
    var isComplete = true;
    var isValidNumber = true;
    var isWithinRange = true;
    var error = false;

    var checkValidNumber = function (number) {
      var numberToCheck = Number(number);
      return typeof numberToCheck == 'number'
        && !isNaN(numberToCheck)
        && isFinite(numberToCheck);
    };

    var checkWithinRange = function(min, max, number) {
      var numberToCheck = Number(number);
      var isWithinRange = true;

      if(min !== '') {
        isWithinRange = numberToCheck >= min;
      }

      if(max !== '' && isWithinRange) {
        isWithinRange = numberToCheck <= max;
      }

      return isWithinRange;
    };

    if(props.isSlider) {
      // questions are only actually mandatory if they're not slider
      return error;
    }

    if(number && number !== '') {
      // if we have input, check it for validity
      isValidNumber = checkValidNumber(number);

      if(isValidNumber) {
        // check that it's within range if min or max are set
        isWithinRange = checkWithinRange(props.min, props.max, number);
      }
    } else {
      // if the question is mandatory, but we have no input
      // then the answer is not complete
      if(isMandatory) {
        isComplete = false;
      }
    }

    if(!isComplete) {
      error = errors.mandatory;
    } else if(!isValidNumber) {
      error = errors.invalidNumber;
    } else if(!isWithinRange) {
      error = errors.withinRange;
    }

    return error;
  }
});

var styles = StyleSheet.create({
  valueIndicator: {
    marginTop: 5,
    marginLeft: 20
  },
  sliderNumber: {
    color: '#000'
  },
  sliderLabel: {
  },
  sliderText: {
    flexDirection: 'row'
  },
  textInputContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 8,
    marginRight: 8
  },
  labelContainer: {
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 8,
    marginBottom: 8
  },
  label: {
    color: '#000'
  },
  default: {
    flex: 1
  },
  formElement: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  }
});
