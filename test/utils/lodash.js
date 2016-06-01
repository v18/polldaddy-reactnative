import _ from '../../src/utils/lodash';
import { expect } from 'chai';

describe('mixins for lodash', () => {
  it('exists', () => {
    expect(_).not.to.be.undefined;
  });

  describe('indexOfItem()', () => {
    it('should return -1 when given an id that is not found in array', () => {
      var id = 3;
      var array = [
        {id: 1, title:'title 1'},
        {id: 2}
      ];
      expect(-1).to.equal(_.indexOfItem(array, id));
    });
    it('should return the index when given an id that exists in array', () => {
      var id = 2;
      var array = [
        {id: 1, title:'title 1'},
        {id: 2}
      ];
      expect(1).to.equal(_.indexOfItem(array, id));
    });
    it('should return -1 when given an empty array', () => {
      var id = 3;
      var array = [];
      expect(-1).to.equal(_.indexOfItem(array, id));
    });
  });

  describe('toggleSelectedItem()', () => {
    it('should return array with new item when given array does not contain an item', () => {
      var item = {id: 3, title:'title'};
      var array = [
        {id: 1, title:'title 1'},
        {id: 2}
      ];
      var result = [
        {id: 1, title:'title 1'},
        {id: 2},
        {id: 3, title:'title'}
      ];
      expect(result).to.eql(_.toggleSelectedItem(item, array));
    });

    it('should the given array with the item removed, when given an item that exists in given array', () => {
      var item = {id: 1, title:'title 1'};
      var array = [
        {id: 1, title:'title 1'},
        {id: 2}
      ];
      var result = [
        {id: 2}
      ];
      expect(result).to.eql(_.toggleSelectedItem(item, array));
    });
  });

  describe('replaceLastOccurence()', () => {
    it('should return the original string when only one parameter is passed', () => {
      var original = '<b>original</b><b></b>';
      var expected = original;
      var result = _.replaceLastOccurence(original);
      expect(result).to.equal(expected);
    });

    it('should return the original string when empty substring is passed', () => {
      var original = '<b>original</b><b></b>';
      var expected = original;
      var result = _.replaceLastOccurence(original, '');
      expect(result).to.equal(expected);

      var result2 = _.replaceLastOccurence(original, '', 'replacement');
      expect(result2).to.equal(expected);
    });

    it('should return the original string when replacement string is not passed', () => {
      var original = '<b>original</b><b></b>';
      var expected = original;
      var result = _.replaceLastOccurence(original, '</b>');
      expect(result).to.equal(expected);
    });

    it('should return the correctly changed string when substring and replacement substring are passed and substring is found in original string', () => {
      var original = '<b>original</b><b></b>';
      var expected = '<b>original</b><b>replacement';
      var result = _.replaceLastOccurence(original, '</b>', 'replacement');
      expect(result).to.equal(expected);
    });

    it('should return original string when substring not found in original string', () => {
      var original = '<b>original</b><b></b>';
      var expected = original;
      var result = _.replaceLastOccurence(original, '</notfound>', 'replacement');
      expect(result).to.equal(expected);
    });
  });

  describe('combineItemLists()', () => {
    it('should return an object with props `toDisplay`, `toSave`, `toDelete` equal to empty array when both parameters not specified', () => {
      var result = _.combineItemLists();
      expect(result).to.eql({toDisplay: [], toSave: [], toDelete: []});
    });

    it('should return an object with empty arrays when both items passed in are empty arrays', () => {
      var result = _.combineItemLists([], []);
      expect(result).to.eql({toDisplay: [], toSave: [], toDelete: []});
    });

    it('should return object with toSave = [], toDisplay = [], and toDelete equal to array containing IDs of items from database, when remoteItems paramter not specified', () => {
      var dbItems = [{id: 1}, {id: 2}];
      var result = _.combineItemLists(dbItems);
      expect(result).to.eql({
        toDisplay: [],
        toSave: [],
        toDelete: [1, 2]
      });
    });

    it('should return object with toSave = [] and toDisplay = [], and toDelete equal to array containing IDs of items from database, when remoteItems is empty', () => {
      var dbItems = [{id: 1}, {id: 2}];
      var result = _.combineItemLists(dbItems, []);
      expect(result).to.eql({
        toDisplay: [],
        toSave: [],
        toDelete: [1, 2]
      });
    });

    it('when item exists in both dbItems and remoteItems, it should return an array with that item from dbItems with the prop saved equal to true, and should toDelete should equal array containing remaining items in database array', () => {
      var dbItems = [
        {id: 1, title: 'Title 1', responses: 2},
        {id: 2, title: 'Title 2', responses: 0},
        {id: 3, title: 'Title 2', responses: 1}
      ];

      var remoteItems_1 = [
        {id: 2, title: 'Title 2'}
      ];
      var remoteItems_2 = [
        {id: 2, title: 'Title 2'},
        {id: 3}
      ];

      var expectedItems_1 = [
        {id: 2, title: 'Title 2', responses: 0, saved: true}
      ];
      var expectedItems_2 = [
        {id: 2, title: 'Title 2', responses: 0, saved: true},
        {id: 3, title: 'Title 2', responses: 1, saved: true}
      ];

      var expectedToDeleteItems_1 = [1, 3];
      var expectedToDeleteItems_2 = [1];

      var result_1 = _.combineItemLists(dbItems, remoteItems_1);
      var result_2 = _.combineItemLists(dbItems, remoteItems_2);

      expect(result_1).to.eql({toSave: [], toDelete: expectedToDeleteItems_1, toDisplay: expectedItems_1});
      expect(result_2).to.eql({toSave: [], toDelete: expectedToDeleteItems_2, toDisplay: expectedItems_2});
    });

    it('when an item exists only in remoteItems, it should return an array with the items props equal to an array with that item, and the toSave prop equal to array containing the id for that item, and the remaining items from the database array in the toDelete array', () => {
      var dbItems = [
        {id: 1, title: 'Title 1', responses: 2},
        {id: 3, title: 'Title 2', responses: 1}
      ];

      var remoteItems_1 = [
        {id: 2, title: 'Title 2'}
      ];
      var remoteItems_2 = [
        {id: 2, title: 'Title 2'},
        {id: 4, title: 'Title 4'}
      ];

      var expected_1 = {
        toDisplay: [
          {id: 2, title: 'Title 2', saved: false}
        ],
        toSave: [2],
        toDelete: [1, 3]
      };
      var expected_2 = {
        toDisplay: [
          {id: 2, title: 'Title 2', saved: false},
          {id: 4, title: 'Title 4', saved: false}
        ],
        toSave: [2, 4],
        toDelete: [1, 3]
      };

      var result_1 = _.combineItemLists(dbItems, remoteItems_1);
      var result_2 = _.combineItemLists(dbItems, remoteItems_2);

      expect(result_1).to.eql(expected_1);
      expect(result_2).to.eql(expected_2);

      var dbItems_a = [];
      var remoteItems_a = [
        {id: 2, title: 'Title 2'},
        {id: 4, title: 'Title 4'}
      ];
      var result_a = _.combineItemLists(dbItems_a, remoteItems_a);
      expect(result_a).to.eql({
        toSave: [2,4],
        toDelete: [],
        toDisplay: remoteItems_a
      });
    });
  });
});
