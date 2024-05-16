const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      const destination = path.resolve(__dirname, '..', 'public', 'images');
      console.log('uploaded to ............... : ', destination);
      cb(null, destination);
      // cb(null, '../public/images');
  },
  filename: function(req, file, cb) {
      cb(null, req.params.id + '.png');
  }
});

const upload = multer({ storage: storage });

module.exports=upload