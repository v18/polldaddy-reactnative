import Html from '../elements/html';
import React from 'react';
import { View } from 'react-native';

module.exports = React.createClass({
  render: function () {
    var htmlString = '';
    var chunk = this.props.question.childNamed('chunk');
    if(chunk.val) {
      htmlString = chunk.val;
    }
    return (<View>
      <Html htmlString={htmlString} />
    </View>);
  }
});
