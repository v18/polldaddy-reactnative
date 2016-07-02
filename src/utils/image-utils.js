import _ from 'lodash';
import async from 'async';
import { Image } from 'react-native';
import parseUri from 'parse-uri';

module.exports = {
  getUniqueImageFileName: function (name, listOfNames, counter = 0) {
    if(listOfNames.indexOf(name) === -1) {
      return name;
    } else {
      var [filename, filetype] = this.getBaseNameAndExt.call(this, name);
      var nextCount = counter + 1;
      if(filename.endsWith(`-${counter}`)){
        var mainName = filename.slice(0, filename.lastIndexOf('-'));
        name = `${mainName}-${nextCount}.${filetype}`;
        return this.getUniqueImageFileName(name, listOfNames, nextCount);
      } else {
        name = `${filename}-${nextCount}.${filetype}`;
        return this.getUniqueImageFileName(name, listOfNames, nextCount);
      }
    }
  },
  getBaseNameAndExt: function (fullFileName) {
    var fileTypeError = new Error('Not an image file type');
    var parts = fullFileName.split('.');
    if(parts.length === 1) {
      throw fileTypeError;
    } else {
      var fileType = parts.pop();
      if(this.acceptedFileTypes.indexOf(fileType) > -1) {
        return [parts.join(''), fileType];
      } else {
        throw fileTypeError;
      }
    }
  },
  acceptedFileTypes: ['png', 'jpg', 'jpeg', 'gif'],
  getImageListFromSurvey: function (surveyXml) {
    surveyXml = this.replaceAllInSurveyXml(surveyXml, '&lt;img', '<img');
    surveyXml = this.replaceAllInSurveyXml(surveyXml, '/&gt;', '/>');

    var imagesList = [];
    var startIndex = 0;
    var done = false;

    while(!done) {
      var tagStart = surveyXml.indexOf('<img', startIndex);
      if(tagStart > -1) { // found an image
        var tagEnd = surveyXml.indexOf('/>', tagStart) + '/>'.length;
        var srcStart = surveyXml.indexOf('src="', tagStart) + 'src="'.length;
        var srcEnd = surveyXml.indexOf('"', srcStart);
        var url = surveyXml.slice(srcStart, srcEnd);
        startIndex = tagEnd + 1;

        var indexOfCurrentUrl = _.map(imagesList, 'url').indexOf(url);
        if(indexOfCurrentUrl === -1) { // url not in list yet
          var name = parseUri(url).file;
          var listOfNames = _.map(imagesList, 'uniqueName');
          var uniqueName = this.getUniqueImageFileName(name, listOfNames);
          imagesList.push({
            url,
            uniqueName
          });
        }
      } else { // no more images found
        done = true;
      }
    }
    return imagesList;
  },
  replaceAllInSurveyXml: function (xml, originalSrc, localSrc) {
    var start = 0;
    var done = false;
    var oldXml = xml;
    var newXml = '';

    while(!done) {
      var srcIndex = oldXml.indexOf(originalSrc);
      if(srcIndex > -1) {
        var srcEnd = srcIndex + originalSrc.length;
        var xmlChunk = oldXml.slice(start, srcEnd);
        var newXmlChunk = xmlChunk.replace(originalSrc, localSrc);
        newXml = newXml + newXmlChunk;
        oldXml = oldXml.slice(srcEnd, oldXml.length);
      } else {
        newXml = newXml + oldXml;
        done = true;
      }
    }
    return newXml;
  },
  getElementsArray: function getElementsArray(html, array = []) {
    // find the image tag
    var imgTagStart = html.indexOf('<img');
    if(imgTagStart > -1) {
      var imgTagEnd = html.indexOf('/>', imgTagStart) + '/>'.length;
      var srcStart = html.indexOf('src="', imgTagStart) + 'src="'.length;
      var srcEnd = html.indexOf('"', srcStart);
      var imageSrc = html.slice(srcStart, srcEnd);

      var beginingHtml = {
        type: 'html',
        source: html.slice(0, imgTagStart)
      };
      var img = {
        type: 'image',
        source: imageSrc
      };
      var remainingHtml = html.slice(imgTagEnd, html.length);
      array.push(beginingHtml);
      array.push(img);
      return getElementsArray(remainingHtml, array);
    } else {
      if(html !== '') {
        array.push({
          type: 'html',
          source: html
        });
      }
      return array;
    }
  },
  updateImagesInArrayWithSize: function (elementsArray) {
    var getImageSize = function (element, doneCallback) {
      if(element.type === 'image') {
        Image.getSize(element.source, function (w, h) {
          element.width = w || 5000;
          element.height = h || 5000;
          return doneCallback(null, element);
        });
      } else {
        return doneCallback(null, element);
      }
    };

    return new Promise(function(resolve) {
      async.map(elementsArray, getImageSize, function (err, results) {
        resolve(results);
      });
    });
  }
};
