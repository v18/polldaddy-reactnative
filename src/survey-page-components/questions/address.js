import { StyleSheet, View } from 'react-native';
import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';

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
        add1: '',
        add2: '',
        city: '',
        state: '',
        country: '',
        zip: ''
      },
      answers: {}
    };
  },
  onInputsChange: function (inputs) {
    // save to state.input
    this.setState({
      inputs: inputs
    });

    var questionId = Number(this.props.question.attr.qID);
    var questionType = Number(this.props.question.attr.qType);

    var error = this.getError();
    if(!error) {
      // if validated with no errors, save to answer
      this.setState({
        answers: this.state.inputs
      });
      Actions.saveAnswers(questionId, questionType, this.state.answers);
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
        {this.renderFields(this.props.question)}
      </View>
    );
  },
  renderFields: function (question) {
    var possibleFields = [
      {name: 'add1', check: 'showPlace'},
      {name: 'add2', check: 'showPlace'},
      {name: 'city', check: 'showCity'},
      {name: 'state', check: 'showState'},
      {name: 'zip', check: 'showZip'},
      {name: 'country', check: 'showCountry'}
    ];
    return possibleFields.map(function (field) {
      if(question.childNamed(field.check).val === 'true') {
        return (
          <TextField
              key={field.name}
              name={field.name}
              placeholder={question.childNamed(field.name).val}
          />);
      }
    });
  },
  getError: function (question = this.props.question,
    inputs = this.state.inputs) {

    var error;
    var isValid = true;
    var isMand = question.childNamed('mand');

    if(isMand && isMand.val === 'true') {
      // get possible props
      var fieldsRequired = [];
      if(question.childNamed('showState').val === 'true') {
        fieldsRequired.push('state');
      }
      if(question.childNamed('showPlace').val === 'true') {
        fieldsRequired.push('add1');
        fieldsRequired.push('add2');
      }
      if(question.childNamed('showCity').val === 'true') {
        fieldsRequired.push('city');
      }
      if(question.childNamed('showZip').val === 'true') {
        fieldsRequired.push('zip');
      }
      if(question.childNamed('showCountry').val === 'true') {
        fieldsRequired.push('country');
      }

      // check that all props have text
      isValid = fieldsRequired.every(function(prop) {
        return inputs[prop] && inputs[prop] !== '';
      });
    }
    if(isValid) {
      error = false;
    } else {
      error = 'mandatory';
    }
    return error;
  }
});

var styles = StyleSheet.create({
  container: {
    marginBottom: 16
  }
});
