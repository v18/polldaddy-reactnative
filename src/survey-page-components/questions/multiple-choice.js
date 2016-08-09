import {
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import { phrases } from '../../utils/current-phrases';
import React from 'react';
import ResponsiveImage from 'react-native-fit-image';
import TextField from '../elements/text-field';

var errorMessages = {
  otheroption: 'Please provide the other option description'
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
  onInputsChange: function (inputs) {
    if(inputs.selectedAnswers === undefined
      && this.state.inputs.selectedAnswers !== undefined) {
      inputs.selectedAnswers = this.state.inputs.selectedAnswers;
    }

    if(inputs.commentText === undefined
      && this.state.inputs.commentText !== undefined) {
      inputs.commentText = this.state.inputs.commentText;
    }

    if(inputs.otherText === undefined
      && this.state.inputs.otherText !== undefined) {
      inputs.otherText = this.state.inputs.otherText;
    }

    this.setState({
      inputs
    });

    var error = this.getError();
    if(!error) {
      Actions.saveAnswers(this.props.questionId, this.props.questionType, this.state.inputs);
    } else {
      Actions.saveError(error);
    }
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.selected !== r2.selected
    });
    return {
      data: this.props.answers,
      ds: ds.cloneWithRows(this.props.answers),
      inputs: {
        commentText: '',
        otherText: '',
        selectedAnswers: []
      }
    };
  },
  render: function () {
    // hack to make enzyme tests work since
    // Shallow doesn't have access to phrases
    var otherPhrase = 'Other';
    if(phrases) {
      otherPhrase = phrases.other;
    }

    return (
      <View>
        {this.renderAnswers()}
        {this.renderOtherAnswerSection(otherPhrase)}
        {this.renderUserCommentSection()}
      </View>
    );
  },
  renderAnswers: function () {
    return (
      <View style={mc.choicesContainer}>
        <ListView
            dataSource={this.state.ds}
            renderRow={this.renderAnswerRow}
        />
      </View>);
  },
  renderAnswerRow: function (rowData) {
    var imgSrc = rowData.selected ? require('../../img/check/ic_done_red.png') : require('../../img/check/empty_checkmark.png');
    return (
      <TouchableHighlight
          onPress={() => {this.handleRowClick(rowData.id);}}  // eslint-disable-line react/jsx-no-bind
          underlayColor='#e0e0e0'
      >
      <View style={mc.rowContainer}>
        <View style={mc.textAndCheckboxContainer}>
          <View style={mc.checkboxContainer}>
            <Image
                source={imgSrc}
                style={mc.checkboxImg}
            />
          </View>
          <View style={mc.textContainer}>
            <Text style={mc.rowText}>{rowData.text}</Text>
          </View>
        </View>
        {this.renderImageForRow(rowData.image)}
        </View>
      </TouchableHighlight>);
  },
  renderImageForRow: function (imageSrc) {
    if(imageSrc) {
      return (
        <View style={mc.imageContainer}>
          <ResponsiveImage
              height={150}
              source={{uri: imageSrc}}
              width={150}
          />
        </View>
      );
    }
  },
  renderOtherAnswerSection: function (otherPhrase) {
    if(this.props.other
      && this.state.inputs.selectedAnswers
      && this.state.inputs.selectedAnswers.indexOf(-1) > -1) {
      var defaultValue = this.state.inputs.otherText || '';
      return (
        <View style={[styles.textQuestionContainer, styles.otherContainer]}>
          <Text style={styles.textFieldQuestion}>{otherPhrase}</Text>
          <TextField
              default={defaultValue}
              name='otherText'
          />
        </View>
      );
    }
  },
  renderUserCommentSection: function () {
    if(this.props.comments !== '' && this.props.comments) {
      return (
        <View style={styles.textQuestionContainer}>
          <Text style={styles.textFieldQuestion}>{this.props.comments}</Text>
          <View style={styles.textFieldContainer}>
            <TextField
                multiline={true}
                name='commentText'
            />
          </View>
        </View>
      );
    }
  },
  deselectAndSelectItems: function (selectArray, deselectArray) {
    var newData = _.cloneDeep(this.state.data);

    deselectArray.map(function (id) {
      var deselectObj = _.find(newData, function(o) { return o.id === id; });
      if(deselectObj) {
        deselectObj.selected = false;
      }
    });

    selectArray.map(function (id) {
      var selectedObj = _.find(newData, function(o) { return o.id === id; });
      if(selectedObj) {
        selectedObj.selected = true;
      }
    });

    var selectedAnswers = this.state.inputs.selectedAnswers;
    deselectArray.map(function (id) {
      selectedAnswers = _.without(selectedAnswers, id);
    });
    selectedAnswers = _.concat(selectedAnswers, selectArray);

    this.setState({
      data: newData,
      ds: this.state.ds.cloneWithRows(newData),
      inputs: {
        commentText: this.state.inputs.commentText,
        otherText: this.state.inputs.otherText,
        selectedAnswers
      }
    });

    Actions.saveInputs('selectedAnswers', selectedAnswers);
  },
  handleRowClick: function (id,
  selectedAnswers = this.state.inputs.selectedAnswers) {
    var lastSelected = _.last(selectedAnswers);
    var numOfSelected = selectedAnswers.length;

    if(selectedAnswers && selectedAnswers.indexOf(id) > -1) {
      // if item is already selected, deselect it
      this.deselectAndSelectItems([], [id]);
    } else {
      if(this.canSelectAnotherAnswer(numOfSelected)) {
        this.deselectAndSelectItems([id], []);
      } else {
        this.deselectAndSelectItems([id], [lastSelected]);
      }
    }
  },
  canSelectAnotherAnswer: function (
    numOfSelected = this.state.inputs.selectedAnswers.length) {
    return this.props.max > numOfSelected;
  },
  getError: function (props = this.props, inputs = this.state.inputs,
    errors = errorMessages) {
    var error = false;

    if(inputs.selectedAnswers
      && inputs.selectedAnswers.length < props.min) {
      // make sure we have more than the min number of choices
      error = 'tooFew';
    } else if(inputs.selectedAnswers
      && inputs.selectedAnswers.length > props.max) {
      // make sure we have less than the max number of choices
      error = 'tooMany';
    } else if(inputs.selectedAnswers
      && inputs.selectedAnswers.indexOf(-1) > -1
      && (inputs.otherText === '' || !inputs.otherText)) {
      // if user selected 'other', make sure we have an answer for it
      return errors.otheroption;
    }

    if(props.isMandatory) {
      if(inputs.selectedAnswers.length === 0
          && (inputs.otherText === '' || !inputs.otherText)) {
        // show mandatory error if we don't have any answers
        // or user comment
        error = 'mandatory';
      }
    }
    return error;
  }
});

var mc = StyleSheet.create({
  choicesContainer: {
    marginTop: 20,
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1
  },
  rowContainer: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    paddingBottom: 16,
    paddingTop: 14,
    minHeight: 48
  },
  textAndCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    marginRight: 16
  },
  checkboxContainer: {
    marginLeft: 16,
    marginRight: 16
  },
  imageContainer: {
    marginLeft: 48,
    marginTop: 8,
    marginBottom: 4,
    justifyContent: 'flex-start'
  },
  rowText: {
    color: 'black',
    fontSize: 16
  }
});

var styles = StyleSheet.create({
  textQuestionContainer: {
    padding: 16
  },
  otherContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  textFieldContainer: {
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  textFieldQuestion: {
    color: 'black',
    fontSize: 16,
    marginBottom: 8
  }
});
