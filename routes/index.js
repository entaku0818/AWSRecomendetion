var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: './public/images' }).single('thumbnail');
var AWS = require('aws-sdk');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//現在許可されているリージョンは3リージョンだけ...
AWS.config.update({region:'us-east-1'});

router.post('/upload', function(req, res) {
  upload(req, res, function(err) {
    if(err) {
      res.send("Failed to write " + req.file.destination + " with " + err);
    } else {

      var rekognition = new AWS.Rekognition();
      console.log(req.file);

      var fs = require('fs');
      fs.readFile(req.file.path, 'base64', function(err, data) {
        var decode = new Buffer(data,'base64');
        var params = {
          Image: { /* required */
            Bytes: decode /* Strings will be Base-64 encoded on your behalf */,
          },
        };
        
        rekognition.detectLabels(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response

          res.render('image_label', { title: 'AWS Rekognition' , image: req.file.filename, labels: data.Labels});
        });
      });






        


      



      
    }
  });
});

module.exports = router;
