import Actions from '../actions/rank';
var Reflux = require('reflux');

module.exports = Reflux.createStore({
  listenables: [Actions],
  triggerChange: function() {
    this.trigger({
      movingElement: this.movingElement,
      rowHeights: this.rowHeights
    });
  },
  saveRowHeights: function (id, rowHeight) {
    if(!this.rowHeights) {
      this.rowHeights = [];
    }
    this.rowHeights[Number(id)] = rowHeight;
    this.triggerChange();
  },
  setMovingElement: function (id) {
    this.movingElement = id;
    this.triggerChange();
  },
  unsetMovingElement: function () {
    this.movingElement = -1;
    this.triggerChange();
  },
  reset: function () {
    this.rowHeights = [];
    this.movingElement = -1;
    this.triggerChange();
  }
});
