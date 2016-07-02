import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import Actions from '../../actions/current-question.js';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      value: (this.props.default || '')
    };
  },
  render: function() {
    return (
      <View
          style={[styles.container,
            this.props.multiline ? styles.multiline : styles.singleline]}
      >
        <TextInput
            autoFocus={this.props.autoFocus}
            keyboardType={this.props.keyboardType}
            maxLength={this.props.maxLength}
            multiline={this.props.multiline}
            onChangeText={this.handleOnChangeText}
            placeholder={this.props.placeholder}
            placeholderTextColor='#C7C7CD'
            secureTextEntry={this.props.secureTextEntry}
            style={this.props.multiline ? styles.multilineText : ''}
            underlineColorAndroid='#FFF'
            value={this.state.value}
        />
    </View>);
  },
  handleOnChangeText: function (text) {
    // sanitize the text
    var sanitizedText = text;
    if(this.props.sanitizeText) {
      sanitizedText = this.props.sanitizeText(text);
    }

    this.setState({
      value: sanitizedText
    });
    Actions.saveInputs(this.props.name, sanitizedText);
  }
});

var styles = StyleSheet.create({
  container: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1
  },
  singleline: {
    height: 48
  },
  multiline: {
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1
  },
  multilineText: {
    height: 130
  }
});
