import _ from 'lodash';
_.mixin({
  indexOfItem: function(array, givenItemId) {
    var index = _.findIndex(array, function(item) {
      return item.id === givenItemId;
    });
    return index;
  },
  toggleSelectedItem: function(item, array) {
    var newArray = array.slice();
    var index = this.indexOfItem(newArray, item.id);
    if(index !== -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(item);
    }
    return newArray;
  },
  replaceLastOccurence: function(originalString, substr, newSubstr) {
    var newString = originalString,
      lastIndex = originalString.lastIndexOf(substr);
    if(substr !== '' &&  lastIndex !== -1 && newSubstr !== undefined) {
      var part1 = originalString.slice(0, originalString.lastIndexOf(substr));
      var part2 = originalString.slice(originalString.lastIndexOf(substr) + substr.length);
      newString = part1 + newSubstr + part2;
    }
    return newString;
  },
  combineItemLists: function(dbItems, remoteItems) {
    var result = {
      toDisplay: [],
      toSave: [],
      toDelete: []
    };

    var itemsInBothLists = _.intersectionBy(dbItems, remoteItems, function (item) {
      return item.id;
    }).map(function (item) {
      item.saved = true;
      return item;
    });

    var remainingRemoteItems = _.differenceBy(remoteItems, itemsInBothLists, function(item) {
      return item.id;
    }).map(function (item) {
      item.saved = false;
      return item;
    });

    result.toSave = remainingRemoteItems.map(function (item) {
      return item.id;
    });

    result.toDisplay = _.concat(itemsInBothLists, remainingRemoteItems);

    result.toDelete = _.differenceBy(dbItems, itemsInBothLists, function (item) {
      return item.id;
    }).map(function (item) {
      return item.id;
    });

    return result;
  }
});

module.exports = _;
