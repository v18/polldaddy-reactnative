import { expect } from 'chai';
import imageUtils from '../../src/utils/image-utils';

describe('imageUtils', () => {
  describe('getUniqueImageFileName()', () => {
    it('returns the original file name if it is not in the list', () => {
      var actual = 'x.png';
      var result = imageUtils.getUniqueImageFileName('x.png', ['y.png']);
      expect(result).to.equal(actual);
    });

    it('given "x.png", returns "x-1.png" if "x.png" is in the list', () => {
      var actual = 'x-1.png';
      var result = imageUtils.getUniqueImageFileName('x.png', ['x.png']);
      expect(result).to.equal(actual);
    });

    it('given "f-1.png", returns "f-1-1.png" if "f-1.png" is in the list', () => {
      var actual = 'f-1-1.png';
      var result = imageUtils.getUniqueImageFileName('f-1.png', ['f-1.png']);
      expect(result).to.equal(actual);
    });

    it('given "x.png", returns "x-2.png" if "x.png" and "x-1" are in the list', () => {
      var actual = 'x-2.png';
      var result = imageUtils.getUniqueImageFileName('x.png',
        ['x.png', 'x-1.png']);
      expect(result).to.equal(actual);
    });
  });

  describe('getBaseNameAndExt()', () => {
    it('throws an error if the filetype is not jpg, png, or gif', () => {
      var filename1 = 'name.tiff';
      var filename2 = 'name';

      var errorMessage = 'Not an image file type';

      expect(imageUtils.getBaseNameAndExt.bind(imageUtils, filename1)).to.throw(Error, errorMessage);
      expect(imageUtils.getBaseNameAndExt.bind(imageUtils, filename2)).to.throw(Error, errorMessage);
    });

    it('for valid image filenames, returns an array containing the filename and extension', () => {
      var png = 'example.png';
      var pngWithDots = 'ex.a.m.pl.e.png';
      var gif = 'example.gif';
      var jpg = 'example.jpg';
      var jpeg = 'example.jpeg';

      expect(imageUtils.getBaseNameAndExt(png)).to.eql(['example', 'png']);
      expect(imageUtils.getBaseNameAndExt(pngWithDots)).to.eql(['example', 'png']);
      expect(imageUtils.getBaseNameAndExt(gif)).to.eql(['example', 'gif']);
      expect(imageUtils.getBaseNameAndExt(jpg)).to.eql(['example', 'jpg']);
      expect(imageUtils.getBaseNameAndExt(jpeg)).to.eql(['example', 'jpeg']);
    });
  });

  describe('getImageListFromSurvey()', function () {
    describe('for <img src=', () => {
      it('should return an empty array if no image tags are found', () => {
        var xml1 = '';
        var xml2 = '<question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk></chunk></question>';
        expect(imageUtils.getImageListFromSurvey(xml1)).to.eql([]);
        expect(imageUtils.getImageListFromSurvey(xml2)).to.eql([]);
      });

      it('should return an array with img tag info if img tag is found', () => {
        var xml = '<question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question>';

        var expected = [{
          url: 'https://example.com/image.png?w=445',
          uniqueName: 'image.png'
        }];

        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });

      it('should return an array just one image listed per url if image source appears more than twice', () => {
        var xml = '<question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question><question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question>';

        var expected = [{
          url: 'https://example.com/image.png?w=445',
          uniqueName: 'image.png'
        }];

        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });

      it('should return an array with multiple urls if more than one image tag is found with different urls', () => {
        var xml = '<question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=125" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question><question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/anotherimage.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question><question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question><question qType="2000" qID="7318320" trueQ="0"><qText>Please enter your question here.</qText><nText></nText><note>false</note><chunk>\n\n&lt;img src="https://example.com/image.png?w=125" alt="figs" width="445" height="655" title="figs" /&gt;</chunk></question>';

        var expected = [
          {
            url: 'https://example.com/image.png?w=125',
            uniqueName: 'image.png'
          },
          {
            url: 'https://example.com/anotherimage.png?w=445',
            uniqueName: 'anotherimage.png'
          },
          {
            url: 'https://example.com/image.png?w=445',
            uniqueName: 'image-1.png'
          }
        ];
        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });
    });

    describe('for <mediaItem>', () => {
      it('should return an array with media item info if media item is found', () => {
        var xml = `<media>
          <mediaItem type="library" oID="15961218">https://example.com/anotherimage.png?w=445</mediaItem>
        </media>`;

        var expected = [
          {
            url: 'https://example.com/anotherimage.png?w=445',
            uniqueName: 'anotherimage.png'
          }
        ];

        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });

      it('should return an array with media items info if more than one media item is found', () => {
        var xml = `<comments enabled="false">Please help us understand why you selected this answer</comments><media><mediaItem type="library" oID="15965401">http://i1.wp.com/files.polldaddy.com/1.png</mediaItem><mediaItem type="library" oID="15965402">http://i2.wp.com/files.polldaddy.com/2.png</mediaItem><mediaItem type="library" oID="15965403">http://i0.wp.com/files.polldaddy.com/3.jpg</mediaItem><mediaItem type="library" oID="15965404">http://i0.wp.com/files.polldaddy.com/4.jpg</mediaItem><mediaItem type="library" oID="15965405">http://i0.wp.com/files.polldaddy.com/5.jpg</mediaItem></media><answer>15965401</answer><mand>false</mand></question></page>\n<rules ruleCount="0"/>\n</formData>`;

        var expected = [
          {
            url: 'http://i1.wp.com/files.polldaddy.com/1.png',
            uniqueName: '1.png'
          },
          {
            url: 'http://i2.wp.com/files.polldaddy.com/2.png',
            uniqueName: '2.png'
          },
          {
            url: 'http://i0.wp.com/files.polldaddy.com/3.jpg',
            uniqueName: '3.jpg'
          },
          {
            url: 'http://i0.wp.com/files.polldaddy.com/4.jpg',
            uniqueName: '4.jpg'
          },
          {
            url: 'http://i0.wp.com/files.polldaddy.com/5.jpg',
            uniqueName: '5.jpg'
          }
        ];
        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });
    });

    describe('both <img and <mediaItem>', () => {
      it('should return an array with one entry per unique url when img and mediaItems are found', () => {
        var xml = `
        <question qType="2000" qID="7318320" trueQ="0">
            <qText>Please enter your question here.</qText>
            <nText></nText>
            <note>false</note>
            <chunk>\n\n&lt;img src="https://example.com/image1.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk>
        </question>
        <question qType="2000" qID="7318320" trueQ="0">
            <qText>Please enter your question here.</qText>
            <nText></nText>
            <note>false</note>
            <chunk>\n\n&lt;img src="https://example.com/image1.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk>
        </question>
        <question qType="2000" qID="7318320" trueQ="0">
            <qText>Please enter your question here.</qText>
            <nText></nText>
            <note>false</note>
            <chunk>\n\n&lt;img src="https://example.com/image2.png?w=445" alt="figs" width="445" height="655" title="figs" /&gt;</chunk>
        </question>
        <question qType="2000" qID="7318320" trueQ="0">
            <qText>Please enter your question here.</qText>
            <nText></nText>
            <note>false</note>
            <chunk>\n\n&lt;img src="https://example.com/image3.png" alt="figs" width="445" height="655" title="figs" /&gt;</chunk>
        </question>
        <media>
          <mediaItem type="library" oID="15961218">https://example.com/image2.png?w=445</mediaItem>
          <mediaItem type="library" oID="15961218">https://example.com/image2.png?w=445</mediaItem>
          <mediaItem type="library" oID="15961219">https://example.com/image1.png?w=445</mediaItem>
          <mediaItem type="library" oID="15961219">https://example.com/image4.png</mediaItem>
        </media>`;

        var expected = [
          {
            url: 'https://example.com/image1.png?w=445',
            uniqueName: 'image1.png'
          },
          {
            url: 'https://example.com/image2.png?w=445',
            uniqueName: 'image2.png'
          },
          {
            url: 'https://example.com/image3.png',
            uniqueName: 'image3.png'
          },
          {
            url: 'https://example.com/image4.png',
            uniqueName: 'image4.png'
          }
        ];

        expect(imageUtils.getImageListFromSurvey(xml)).to.eql(expected);
      });
    });
  });

  describe('updateImgSrc()', function () {
    it('returns the same string if match is not found', function() {
      var xml = '12345';
      expect(imageUtils.replaceAllInSurveyXml(xml, 'abc', 'xyz')).to.equal(xml);
    });

    it('returns the string with all instances replaced', function() {
      var originalSrc = 'example.com/image.png';
      var newSrc = 'newimage.png';

      var xml1 = '<tag src="example.com/image.png"></tag>';
      var xml2 = '<tag src="example.com/image.png"></tag><tag src="image2.png"></tag><tag src="example.com/image.png"></tag>';

      var expected1 = '<tag src="newimage.png"></tag>';
      var expected2 = '<tag src="newimage.png"></tag><tag src="image2.png"></tag><tag src="newimage.png"></tag>';

      expect(imageUtils.replaceAllInSurveyXml(xml1, originalSrc, newSrc))
        .to.equal(expected1);

      expect(imageUtils.replaceAllInSurveyXml(xml2, originalSrc, newSrc))
        .to.equal(expected2);
    });
  });

  describe('getElementsArray()', function () {
    it('should return the html in an array if no image is found', () => {
      var html = '<p>this is a paragraph</p><strong>some bold text</strong>';

      expect(imageUtils.getElementsArray(html)).to.eql([{
        type: 'html',
        source: html
      }]);
    });

    it('should return an empty array if html is empty string', () => {
      var emptyHtml = '';
      expect(imageUtils.getElementsArray(emptyHtml)).to.eql([]);
    });

    it('--', () => {
      var html = `<strong>some bold text</strong>\n\n<img src="/data/user/0/com.polldaddy/files/surveyImages/2298148/7c10829595d71d1375db5819348035c0-577c412e79fec-1.jpg" alt="authorB 4" width="500" height="333" title="authorB 4" />`;

      expect(imageUtils.getElementsArray(html)).to.eql([
        {
          type: 'html',
          source: '<strong>some bold text</strong>\n\n'
        },
        {
          type: 'image',
          source: '/data/user/0/com.polldaddy/files/surveyImages/2298148/7c10829595d71d1375db5819348035c0-577c412e79fec-1.jpg'
        }
      ]);
    });

    it('should return an array containing the image and other html separately', function() {
      var html = '<p>this is a paragraph</p><img src="image.png" /><strong>some bold text</strong><img src="anotherimage.png" />';

      expect(imageUtils.getElementsArray(html)).to.eql([
        {
          type: 'html',
          source: '<p>this is a paragraph</p>'
        },
        {
          type: 'image',
          source: 'image.png'
        },
        {
          type: 'html',
          source: '<strong>some bold text</strong>'
        },
        {
          type: 'image',
          source: 'anotherimage.png'
        }
      ]);
    });
  });
});
