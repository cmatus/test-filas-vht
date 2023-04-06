'use strict';

const async = require('async');
const express = require('express');
const fs = require('fs');
const path = require('path');

const toolsRouter = express.Router();

let response = {
  data: null,
  error: false,
  message: null
};

toolsRouter.use(express.json({
  limit: '10 mb'
}));

toolsRouter.route('/tools/uploadimages')
  .post((req, res) => {
    const uploadImagesData = req.body;

    async.eachSeries(uploadImagesData, (uploadImagesDataItem, uploadImagesDataCallback) => {
      let fileName =
        path.join(__dirname, '../../ticketero', 'images', `${ uploadImagesDataItem.name }.${ uploadImagesDataItem.extension }`);

      fs.writeFile(fileName, uploadImagesDataItem.data, 'base64', (writeFileError) => {
        if (writeFileError) {
          response.error = true;
          response.message = writeFileError;
          res.status(200).json(response);
        } else {
          uploadImagesDataCallback();
        }
      });
    }, () => {
      response.message = 'Carga finalizada correctamente';
      res.status(200).json(response);
    });
  });

module.exports = toolsRouter;