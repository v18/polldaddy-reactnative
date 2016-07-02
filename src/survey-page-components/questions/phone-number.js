import {
  Picker,
  View
} from 'react-native';
import Actions from '../../actions/current-question';
import countriesList from '../../utils/country-code-list.js';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';

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
    var defaultCountry = this.props.question.childNamed('default_country').val;
    return {
      inputs: {
        countryCode: defaultCountry,
        phoneNumber: ''
      },
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (inputs) {
    this.setState({
      inputs: {
        phoneNumber: inputs.phoneNumber || this.state.inputs.phoneNumber,
        countryCode: inputs.countryCode || this.state.inputs.countryCode
      }
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
      <TextField
          autoFocus={true}
          name='phoneNumber'
          placeholder={this.props.question.childNamed('example').val}
      />
    {this.renderCountryPicker()}
    </View>);
  },
  renderCountryPicker: function () {
    if(this.props.question.childNamed('change_country').val === 'true') {
      return (
        <Picker
            onValueChange={this.handleOnValueChange}
            selectedValue={this.state.inputs.countryCode}
        >
          {this.renderCountryItems()}
        </Picker>);
    }
  },
  renderCountryItems: function () {
    return countriesList.map(function(country) {
      return (
        <Picker.Item
            key={country.code}
            label={country.name}
            value={country.code}
        />);
    });
  },
  handleOnValueChange: function (countryPicked) {
    this.setState({
      inputs: {
        phoneNumber: this.state.inputs.phoneNumber, //unchanged
        countryCode: countryPicked
      }
    });
  },
  getError: function (question = this.props.question,
    phoneNumber=this.state.inputs.phoneNumber, errors = errorMessages) {

    var error = false;
    var isMand = question.childNamed('mand');

    if(isMand && isMand.val === 'true') {
      // make sure input is not empty
      if(! phoneNumber || phoneNumber === '') {
        error = errors.mandatory;
      }
    }

    return error;
  }
});
