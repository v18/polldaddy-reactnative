import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
var window = Dimensions.get('window');

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
    var newState = _.cloneDeep(inputs);
    this.setState(newState);

    var error = this.getError(inputs);
    if(!error) {
      Actions.saveAnswers(this.props.questionId, this.props.questionType, this.state);
    } else {
      Actions.saveError(error);
    }
  },
  getInitialState: function () {
    return {};
  },
  getError: function (inputs, expectedNumberOfAnswers = this.props.rows.length, isMandatory = this.props.isMandatory) {
    var error = false;
    if(isMandatory) {
      // see if each input key has a non-empty array
      var numberOfRowsAnswered = _.reduce(inputs, (function (total, row) {
        var rowAnswered = (row.length > 0 ? 1 : 0);
        return total + rowAnswered;
      }), 0);
      if(numberOfRowsAnswered < expectedNumberOfAnswers) {
        error = 'matrixIncomplete';
      }
    }
    return error;
  },
  render: function () {
    return (
      <View>
        {this.renderMatrixHeader()}
        {this.renderRows()}
      </View>
    );
  },
  renderMatrixHeader: function () {
    return (
      <View style={[styles.row, styles.headerRow]}>
        <View style={this.firstColumnStyle()} />
        {this.renderHeadings()}
      </View>
    );
  },
  renderHeadings: function () {
    return this.props.columns.map(function (column) {
      return (
        <View
            key={column.id}
            style={[styles.column, styles.headerCell]}
        >
          <Text style={styles.headerText}>
            {column.text}
          </Text>
        </View>
      );
    });
  },
  renderRows: function () {
    return this.props.rows.map((row) => {
      return (
        <View
            key={row.id}
            style={styles.row}
        >
          <View style={this.firstColumnStyle()}>
            <Text>{row.text}</Text>
          </View>
          {this.renderCheckboxes(row.id)}
        </View>
      );
    });
  },
  renderCheckboxes: function (rowId) {
    return this.props.columns.map((column) => {
      return (
        <View
            key={column.id}
            style={[styles.column]}
        >
          <TouchableHighlight
              onPress={() => {this.handlePress(rowId, column.id);}} // eslint-disable-line react/jsx-no-bind
              style={styles.button}
              underlayColor='#e0e0e0'
          >
            <View>{this.renderCheckbox(rowId, column.id)}</View>
          </TouchableHighlight>
        </View>
      );
    });
  },
  renderCheckbox: function (rowId, columnId) {
    var checkedImg = require('../../img/radio-button/checked.png');
    var uncheckedImg = require('../../img/radio-button/unchecked.png');

    var isChecked = this.state[rowId]
      && this.state[rowId].indexOf(columnId) > -1;

    return (
      <Image
          scale={1}
          source={(isChecked ? checkedImg : uncheckedImg)}
      />
    );
  },
  handlePress: function (rowId, columnId, multipleChoicesAllowed = this.props.multipleChoicesAllowed) {
    var rowAnswers = _.cloneDeep(this.state[rowId]) || [];
    var alreadySelected = rowAnswers.indexOf(columnId) > -1;
    if(alreadySelected) {
      // unselect
      rowAnswers = _.without(rowAnswers, columnId);
    } else {
      if(multipleChoicesAllowed) {
        // add to answers or remove if already there
        if(rowAnswers && rowAnswers.indexOf(columnId) > -1) {
          rowAnswers = _.without(rowAnswers, columnId);
        } else {
          rowAnswers = _.concat(rowAnswers, columnId);
        }
      } else {
        // replace all answers with this one
        rowAnswers = [columnId];
      }
    }
    Actions.saveInputs(rowId, rowAnswers);
  },
  firstColumnStyle: function (numOfColumns = this.props.columns.length) {
    return {
      flex: -1,
      width: Math.max(
        75,
        window.width / 10,
        100 - numOfColumns * 10
      )
    };
  }
});

var styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    minHeight: 48,
    padding: 8
  },
  headerRow: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  headerCell: {
    paddingLeft: 2,
    paddingRight: 2
  },
  headerText: {
    textAlign: 'center'
  },
  column: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    minWidth: 35,
    minHeight: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
