import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import _ from 'lodash';
import InputsActions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import RankActions from '../../actions/rank';
import RankStore from '../../stores/rank-store';
import React from 'react';

module.exports = React.createClass({
  componentDidMount: function () {
    this.unsubscribeFromRankStore = RankStore.listen(this.onRowsChange);
    this.unsubscribeFromInputsStore = InputsStore.listen(this.onInputsChange);

    this.focusListener =
    this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.focusListener.remove();
      if(this.unsubscribeFromRankStore) {
        this.unsubscribeFromRankStore();
      }
      if(this.unsubscribeFromInputsStore) {
        this.unsubscribeFromInputsStore();
      }
    });
  },
  componentWillUnmount: function () {
    if(this.unsubscribeFromRankStore) {
      this.unsubscribeFromRankStore();
    }

    if(this.unsubscribeFromInputsStore) {
      this.unsubscribeFromInputsStore();
    }
  },
  onRowsChange: function ({rowHeights, movingElement}) {
    if(this.state.movingElement === -1) {
      this.setState({
        rowHeights,
        movingElement
      });
    }
  },
  onInputsChange: function () {
    this.setState({
      rowOrderChanged: true
    });
  },
  getInitialState: function () {
    return {
      pan: new Animated.ValueXY({x: 0, y: 0}),
      rowHeights: [],
      movingElement: -1,
      rowOrderChanged: true,
      isClicked: false,
      isMoving: false
    };
  },
  componentWillMount: function () {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () =>
        this.state.isClicked || this.state.isMoving,
      onPanResponderGrant: () => {
        this.setState({
          isMoving: true
        });
        RankActions.setMovingElement(this.props.index);
      },
      onPanResponderMove: Animated.event([null,{
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderTerminate: () => {
        this.setState({
          isClicked: false,
          isMoving: false
        });
        Animated.decay(
          this.state.pan,
          {toValue:{x:0,y:0}}
        ).start();
        RankActions.unsetMovingElement();
      },
      onPanResponderRelease: (e, gesture) => {
        var elementToSwap = this.findElementToSwitch(gesture.dy);
        if(elementToSwap > -1) {
          var newRows = this.props.swap(this.props.index, elementToSwap);
          InputsActions.saveInputs('rows', newRows);
        }

        Animated.decay(
          this.state.pan,
          {toValue:{x:0,y:0}}
        ).start();
        this.setState({
          isClicked: false,
          isMoving: false
        });
        RankActions.unsetMovingElement();
      }
    });
  },
  render: function () {
    var isBeingHandled = this.state.isClicked || this.state.isMoving;
    return (
      <Animated.View
          {...this.panResponder.panHandlers}
          onLayout={this.handleOnLayout}
          style={[this.getStyleFromAnimation(),
            (isBeingHandled ? styles.moving : '' )]}
      >
        <View
            style={[styles.rowContainer,
              (isBeingHandled ? styles.movingRow : '' )]}
        >
          <View style={styles.textAndDragIconContainer}>
            {this.renderText()}
            {this.renderDragIcon()}
          </View>
          {this.renderImageForRow()}
        </View>
      </Animated.View>
    );
  },
  renderText: function () {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.rowText}>{this.props.text}</Text>
      </View>
    );
  },
  renderDragIcon: function () {
    var dragIcon = require('../../img/drag/ic_reorder.png');
    return (
      <View style={styles.dragIconContainer}>
        <TouchableWithoutFeedback
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
        >
          <Image
              source={dragIcon}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  },
  renderImageForRow: function () {
    if(this.props.image) {
      return (
        <View style={styles.imageContainer}>
        <Image
            resizeMode='cover'
            source={{uri: this.props.image}}
            style={{width: 150, height: 150}}
        />
        </View>
      );
    }
  },
  handlePressIn: function () {
    this.setState({
      isClicked: true
    });
    RankActions.setMovingElement(this.props.index);
  },
  handlePressOut: function () {
    this.setState({
      isClicked: false
    });
  },
  handleOnLayout: function (event) {
    // only want to save row height this in two cases:
    // 1. when the row order has changed: rowOrderChanged
    // (this includes first render)
    // 2. when this row is not currently moving
    if(this.state.rowOrderChanged && this.state.movingElement === -1) {
      var rowHeight = event.nativeEvent.layout.height;
      RankActions.saveRowHeights(this.props.index, rowHeight);
      this.setState({
        rowOrderChanged: false
      });
    }
  },
  findElementToSwitch: function(dy, currentElement = this.props.index, rowHeights = this.state.rowHeights) {

    // check first that we're not within the currentElement's area
    var height = rowHeights[currentElement];
    var distance = Math.abs(dy);
    var shouldUpdate = distance > height / 2;

    if(!shouldUpdate) {
      return -1;
    }

    // check up and down direction
    var arrayToCheck;
    var direction = dy < 0 ? 'up' : 'down'; // if negative number, going up
    if(direction === 'up') {
      arrayToCheck = _.reverse(rowHeights.slice(0, currentElement));
    } else {
      arrayToCheck = rowHeights.slice(currentElement + 1);
    }

    var totalHeight = 0;
    var index = _.findIndex(arrayToCheck, function (row) {
      var bufferHeight = row / 7;
      totalHeight = totalHeight + row;
      return distance < totalHeight + bufferHeight;
    });

    if(index === -1) {
      return -1;
    }

    // calculate the actual index
    var indexToSwitch;

    var numberAwayFromCurrent = index + 1;
    if(direction === 'up') {
      indexToSwitch = currentElement - numberAwayFromCurrent;
    } else {
      indexToSwitch = currentElement + numberAwayFromCurrent;
    }

    return indexToSwitch;
  },
  getStyleFromAnimation: function () {
    return this.state.pan.getLayout();
  }
});

var styles = StyleSheet.create({
  rowContainer: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    paddingBottom: 16,
    paddingTop: 14,
    minHeight: 48,
    backgroundColor: '#fff'
  },
  movingRow: {
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    backgroundColor: '#ffffff80'
  },
  textAndDragIconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    marginLeft: 16
  },
  dragIconContainer: {
    marginLeft: 16,
    marginRight: 16
  },
  imageContainer: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
    justifyContent: 'flex-start'
  },
  rowText: {
    color: 'black',
    fontSize: 16
  },
  moving: {
    elevation: 1
  }
});
