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
    var defaultCountry = '';
    if(this.props.question.childNamed('change_country').val === 'true') {
      // save country code only if it's possible to change the country
      defaultCountry = this.props.question.childNamed('default_country').val;
    }
    return {
      inputs: {
        country: defaultCountry,
        raw: ''
      },
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (inputs) {
    this.setState({
      inputs: {
        raw: inputs.raw,
        country: inputs.country || this.state.inputs.country
      }
    }, function () {
      var questionId = Number(this.props.question.attr.qID);
      var questionType = Number(this.props.question.attr.qType);

      var error = this.getError();
      if(!error) {
        // if validated with no errors, save to answer
        Actions.saveAnswers(questionId, questionType, this.state.inputs);
      } else {
        // if not validated, remove answer & save error instead
        Actions.saveError(error);
      }
    });
  },
  render: function () {
    return (<View>
      <TextField
          autoFocus={true}
          name='raw'
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
            selectedValue={this.state.inputs.country}
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
    this.onInputsChange({
      raw: this.state.inputs.raw, //unchanged
      country: countryPicked
    });
  },
  getError: function (question = this.props.question,
    phoneNumber=this.state.inputs.raw, errors = errorMessages) {

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
