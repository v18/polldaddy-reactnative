import {
  Animated,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      opacity: new Animated.Value(1)
    };
  },
  componentWillUnmount: function () {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 250
    }).start();
  },
  render: function() {
    return (
      <TouchableHighlight
          onPress={() => {this.props.handleRowClick(this.props.rowData);}} // eslint-disable-line react/jsx-no-bind
          underlayColor='#e0e0e0'
      >
        <Animated.View
            style={[styles.rowContainer, {opacity: this.state.opacity}]}
        >
          <Text style={[styles.title, (this.props.rowData.saved ? '' : styles.notSaved)]}>
            {this.props.rowData.title}
          </Text>
          {this.renderOfflineResponses()}
        </Animated.View>
      </TouchableHighlight>
    );
  },
  renderOfflineResponses: function (responses = this.props.rowData.responses) {
    var offlineResponsesText;

    if(typeof responses === 'number') {
      offlineResponsesText =  `${responses} offline responses`;
    } else {
      offlineResponsesText = 'Downloading';
    }

    return (
      <Text style={[styles.responses,
        (this.props.rowData.saved ? '' : styles.notSaved)]}
      >
        {offlineResponsesText}
      </Text>
    );
  }
});

var styles = StyleSheet.create({
  rowContainer: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    minHeight: 72,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center'
  },
  title: {
    color: 'black',
    fontSize: 16
  },
  notSaved: {
    color: '#e0e0e0'
  }
});
