import _ from 'lodash';
import parseUri from 'parse-uri';
import rnfs from 'react-native-fs';
import utils from './image-utils';

const surveyFolder = 'surveyImages';
const surveysDirPath = `${rnfs.DocumentDirectoryPath}/${surveyFolder}`;

module.exports = {
  downloadImageForSurvey: function(imageUrl, surveyId, fs = rnfs) {
    var imageFileName = parseUri(imageUrl).file;
    var surveyDirPath = `${surveysDirPath}/${surveyId}`;
    var uniqueName = '';

    return new Promise(function(resolve) {
      fs.readDir(surveyDirPath)
      .then(function(folderContents) {
        var namesList = _.map(folderContents, 'name');
        uniqueName = utils.getUniqueImageFileName(imageFileName, namesList);
        return fs.downloadFile({
          fromUrl: imageUrl,
          toFile: `${surveyDirPath}/${uniqueName}`
        });
      })
      .then(function(imageDownloadResult) {
        if(imageDownloadResult.statusCode === 200) {
          resolve({
            original: imageUrl,
            local: `file://${surveyDirPath}/${uniqueName}`
          });
        } else {
          throw new Error('Image not downloaded');
        }
      })
      .catch(function () {
        // possible errors:
        // could not fetch image
        // survey folder does not exist
        resolve({
          original: imageUrl,
          local: imageUrl
        });
      })
      .done();
    });
  },
  makeSurveyDirectory: function (surveyId, fs = rnfs) {
    return fs.mkdir(`${surveysDirPath}'/'${surveyId}`);
  },
  deleteSurveyDirectory: function (surveyId, fs = rnfs) {
    return fs.unlink(`${surveysDirPath}'/'${surveyId}`);
  },
  downloadAllImagesForSurvey: function(surveyId, surveyXml) {
    var imageList = utils.getImageListFromSurvey(surveyXml);
    return Promise.all(imageList.map((image) => {
      return this.downloadImageForSurvey(image.url, surveyId);
    }))
    .catch(function (error) {
      throw error;
    });
  }
};
