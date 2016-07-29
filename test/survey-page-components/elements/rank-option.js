import { Image, Text } from 'react-native';
import _ from 'lodash';
import { expect } from 'chai';
import RankOption from '../../../src/survey-page-components/elements/rank-option';
import React from 'react';
import { shallow } from 'enzyme';

describe('<RankOption />', () => {
  describe('displays', () => {
    var propsWithoutImage = {
      id: 1,
      text: 'Dog'
    };
    var propsWithImage = _.assign({}, propsWithoutImage, {
      image: 'file:///url.png'
    });

    var withoutImage = shallow(<RankOption {...propsWithoutImage}/>);
    var withImage = shallow(<RankOption {...propsWithImage}/>);

    it('the option text', () => {
      expect(withoutImage.find(Text)).to.have.length(1);
      expect(withImage.find(Text)).to.have.length(1);

      // find the contents of the Text child
      expect(withoutImage.find(Text).props().children).to.equal('Dog');
      expect(withImage.find(Text).props().children).to.equal('Dog');
    });

    it('the drag icon and image', () => {
      // should have one image: the drag image
      expect(withoutImage.find(Image)).to.have.length(1);
      expect(withoutImage.find(Image).prop('source')).to.eql({});

      var imgs = withImage.find(Image);
      expect(imgs).to.have.length(2);

      var dragIconSrc = imgs.get(0).props.source;
      expect(dragIconSrc).to.eql({});

      var imgSrc = imgs.get(1).props.source;
      expect(imgSrc).to.eql({uri: 'file:///url.png'});
    });
  });

  describe('findElementToSwitch()', () => {

    it('returns -1 if row is released above first row', () => {
      var rowHeights = [50, 50, 50];
      var scenarios = [
        {
          movingRow: 0,
          distance: -15
        },
        {
          movingRow: 1,
          distance: -(50 + 8) // 50 + buffer room
        },
        {
          movingRow: 2,
          distance: -2 * (50 + 8) // 50 + buffer room
        }
      ];

      scenarios.map(function (scenario) {
        var result = RankOption.prototype.findElementToSwitch(
          scenario.distance, scenario.movingRow, rowHeights);

        expect(result).to.equal(-1);
      });
    });

    it('returns -1 if moving row id does not exist in array', () => {

    });

    it('returns -1 if row is released below last row', () => {
      var rowHeights = [50, 50, 50];
      var scenarios = [
        {
          movingRow: 2,
          distance: 15
        },
        {
          movingRow: 1,
          distance: (50 + 8) // 50 + buffer room
        },
        {
          movingRow: 0,
          distance: 2 * (50 + 8) // 50 + buffer room
        }
      ];

      scenarios.map(function (scenario) {
        var result = RankOption.prototype.findElementToSwitch(
          scenario.distance, scenario.movingRow, rowHeights);

        expect(result).to.equal(-1);
      });
    });

    it('returns -1 if released on top of original position of the row being moved', () => {
      var distances = [-25, -10, 0, 10, 25];
      var element = 0;
      distances.map(function (distance) {
        var result = RankOption.prototype.findElementToSwitch(
          distance, element, [50,50,50]);
        expect(result).to.equal(-1);
      });
    });

    it('returns the row id if released on top of another row', () => {
      var scenarios = [
        {
          rowHeights: [50, 50, 50, 50],
          parameters: [
            {
              movingRow: 0,
              distance: 50 + 7, // going down, 50 + buffer room
              expected: 1
            },
            {
              movingRow: 0,
              distance: 100 + 7, // going down, 50 + 50 + buffer room
              expected: 2
            },
            {
              movingRow: 0,
              distance: 150 + 7, // going down, 50 + buffer room
              expected: 3
            },
            {
              movingRow: 1,
              distance: 50 + 7, // going down, 50 + buffer room
              expected: 2
            },
            {
              movingRow: 1,
              distance: 100 + 7, // going down, 50 + 50 + buffer room
              expected: 3
            },
            {
              movingRow: 2,
              distance: 50 + 7, // going down, 50 + buffer room
              expected: 3
            },
            {
              movingRow: 3,
              distance: -(50 + 7), // going up, 50 + buffer room
              expected: 2
            },
            {
              movingRow: 3,
              distance: -(100 + 7), // going up, 50 + 50 + buffer room
              expected: 1
            },
            {
              movingRow: 3,
              distance: -(150 + 7), // going up, 50 + buffer room
              expected: 0
            },
            {
              movingRow: 2,
              distance: -(50 + 7), // going up, 50 + buffer room
              expected: 1
            },
            {
              movingRow: 2,
              distance: -(100 + 7), // going up, 50 + 50 + buffer room
              expected: 0
            },
            {
              movingRow: 1,
              distance: -(50 + 7), // going up, 50 + buffer room
              expected: 0
            }
          ]
        }
      ];

      scenarios.map(function (scenario) {
        scenario.parameters.map(function (param) {
          var result = RankOption.prototype.findElementToSwitch(
            param.distance, param.movingRow, scenario.rowHeights);
          expect(result).to.equal(param.expected);
        });
      });
    });
  });
});
