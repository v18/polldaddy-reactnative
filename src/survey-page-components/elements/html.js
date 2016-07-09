import {
  getElementsArray,
  updateImagesInArrayWithSize
} from '../../utils/image-utils';
import {
  StyleSheet,
  View
} from 'react-native';
import Html from 'react-native-htmlview';
import React from 'react';
import ResponsiveImage from 'react-native-fit-image';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      elementsArray: []
    };
  },
  componentWillMount: function () {
    var htmlArray = getElementsArray(this.props.htmlString);
    updateImagesInArrayWithSize(htmlArray)
      .then((elementsArray) => {
        this.setState({
          elementsArray
        });
      });
  },
  render: function () {
    return (
      <View style={styles.container}>
        {this.renderElements()}
      </View>);
  },
  renderElements: function (elementsArray = this.state.elementsArray) {
    return elementsArray.map(function (element, index) {
      switch(element.type) {
        case 'html':
          return (
            <Html
                key={index}
                onLinkPress={() => { // eslint-disable-line react/jsx-no-bind
                  // do nothing with links
                }}
                stylesheet={htmlStyles}
                value={element.source}
            />);

        case 'image':
          return (
            <ResponsiveImage
                key={index}
                originalHeight={element.height}
                originalWidth={element.width}
                source={{uri: element.source}}
            />);
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  image: {
    paddingLeft: 10,
    paddingRight: 10
  }
});

var htmlStyles = StyleSheet.create({
  a: {
    color: '#7A7A7A'
  },
  big: {
    fontSize: 20
  },
  blockquote: {
    backgroundColor: '#eee'
  },
  code: {
    fontFamily: 'monospace'
  },
  del: {
    textDecorationLine: 'line-through'
  },
  small: {
    fontSize: 10
  }
});
