import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';
import { View } from 'react-native';

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
    this.focusListener.remove();
    this.unsubscribeFromInputs();
  },
  getInitialState: function () {
    return {
      inputs: {
        title: '',
        firstName: '',
        lastName: '',
        suffix: ''
      },
      answers: {}
    };
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
      {this.renderFields()}
    </View>);
  },
  renderFields: function (question = this.props.question) {
    var fields = [];
    var type = parseInt(question.childNamed('type').val);

    switch (type) {
      case 0:
        fields = ['title', 'firstName', 'lastName', 'suffix'];
        break;
      case 1:
        fields = ['title', 'firstName', 'lastName'];
        break;
      case 2:
        fields = ['firstName', 'lastName'];
        break;
    }

    return fields.map(function (field) {
      return (
        <TextField
            key={field}
            name={field}
            placeholder={question.childNamed(field).val}
        />);
    });
  },
  getError: function (question = this.props.question,
    inputs = this.state.inputs, errors = errorMessages) {

    var error;
    var isValid = true;
    var isMand = question.childNamed('mand');

    if(isMand && isMand.val === 'true') {
      // get possible props
      var fields = [];
      var type = parseInt(question.childNamed('type').val);
      switch (type) {
        case 0:
          fields = ['title', 'firstName', 'lastName', 'suffix'];
          break;
        case 1:
          fields = ['title', 'firstName', 'lastName'];
          break;
        case 2:
          fields = ['firstName', 'lastName'];
          break;
      }

      isValid = fields.every(function(field) {
        return inputs[field] && inputs[field] !== '';
      });
    }

    if(isValid) {
      error = false;
    } else {
      error = errors.mandatory;
    }
    return error;
  }
});
