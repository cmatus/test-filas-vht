'use strict';

const multer = require('multer');
const path = require('path');

function REST_ROUTER(router, connection) {
  let self = this;
  self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection) {
  let fileName = '';
  let query = '';
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', '..', 'ticketero', 'images'));
    },
    filename(req, file, cb) {
      let ext = file.originalname.split('.').pop();
      fileName = `${new Date().getTime()}.${ext}`;
      cb(null, fileName);
    }
  });

  const upload = multer({ storage });

  router.post('/files', upload.single('file'), (req, res) => {
    res.status(200).send(fileName);
  });
};

module.exports = REST_ROUTER;

