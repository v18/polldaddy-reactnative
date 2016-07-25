import {
  ListView,
  StyleSheet,
  View
} from 'react-native';
import _ from 'lodash';
import InputsActions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import RankActions from '../../actions/rank';
import RankOption from '../elements/rank-option';
import React from 'react';

module.exports = React.createClass({
  componentDidMount: function () {
    this.unsubscribeFromInputsStore = InputsStore.listen(this.onInputsChange);

    this.willFocusListener =
    this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.willFocusListener.remove();
      RankActions.reset();
      if(this.unsubscribeFromInputsStore) {
        this.unsubscribeFromInputsStore();
      }
    });

    // only display the component when finished loading new page
    this.didFocusListener = this.props.navigator.navigationContext.addListener('didfocus', () => {
      this.didFocusListener.remove();
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        renderPage: true
      });
    });
  },
  componentWillUnmount: function () {
    if(this.unsubscribeFromInputsStore) {
      this.unsubscribeFromInputsStore();
    }
  },
  onInputsChange: function (inputs) {
    var newRows = _.cloneDeep(inputs).rows;

    if(!_.isEqual(newRows, this.state.rows)) {
      this.setState({
        rows: newRows,
        ds: this.state.ds.cloneWithRows(newRows)
      });

      // row order was changed at least once,
      // so can save answer
      InputsActions.saveAnswers(newRows);
    }
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var answers;
    if(this.props.answers.length < 2) {
      // mandatory requirement is automatically fulfilled
      // if number of answers is less than 2
      // then the order cannot be changed
      answers = this.props.answers;
      InputsActions.saveAnswers(answers);
    }

    return {
      ds: ds.cloneWithRows(this.props.answers),
      rows: this.props.answers,
      answers
    };
  },
  render: function () {
    if(!this.state.renderPage) {
      return <View />;
    }

    // if empty data
    if(this.state.rows.length === 0) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <ListView
            dataSource={this.state.ds}
            renderRow={this.renderRow}
        />
      </View>
    );
  },
  renderRow: function (rowData, sectionId, rowID) {
    return (
      <RankOption
          image={rowData.image}
          index={Number(rowID)}
          navigator={this.props.navigator}
          swap={this.swap}
          text={rowData.text}
      />
    );
  },
  swap: function (index1, index2, currentArray = this.state.rows) {
    var newArray = _.cloneDeep(currentArray);

    if(typeof index1 !== 'number'
      || typeof index2 !== 'number'
      || index1 >= newArray.length
      || index2 >= newArray.length
      || index1 < 0
      || index2 < 0
      || index1 === index2) {
      return newArray;
    }

    var newIndex1 = _.cloneDeep(currentArray[index1]);
    var newIndex2 = _.cloneDeep(currentArray[index2]);

    newArray[index1] = newIndex2;
    newArray[index2] = newIndex1;

    return newArray;
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#e0e0e050',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  }
});
