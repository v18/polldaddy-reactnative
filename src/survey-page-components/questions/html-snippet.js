import { StyleSheet, View } from 'react-native';
import Html from '../elements/html';
import React from 'react';

module.exports = React.createClass({
  render: function () {
    var htmlString = '';
    var chunk = this.props.question.childNamed('chunk');
    if(chunk.val) {
      htmlString = chunk.val;
    }
    return (
      <View style={styles.container}>
        <Html htmlString={htmlString} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16
  }
});
