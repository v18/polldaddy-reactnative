import {
  Text,
  View
} from 'react-native';
import Html from '../elements/html';
import React from 'react';

module.exports = React.createClass({
  render: function () {
    var htmlString = '';
    var chunk = this.props.question.childNamed('chunk');
    if(chunk.val) {
      htmlString = chunk.val;
    }
    return (<View>
      <Text>HI!</Text>
      <Html htmlString={htmlString} />
    </View>);
  }
});
