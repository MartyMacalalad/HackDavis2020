var express = require('express');
var fs = require('fs');
var util = require('util');
var mime = require('mime');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

// Set up auth
var vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'hackdavis2020-265600-fcccb5d30492.json'
});

var app = express();

// Simple upload form
var form = '<!DOCTYPE HTML><html><body>' +
  `<link rel="stylesheet" type="text/css" href="css/style.css" />`+
  "<form method='post' action='/upload' enctype='multipart/form-data'>" +
  "<input type='file' name='image'/>" +
  "<input type='submit' /></form>" +
  '</body></html>';

app.get('/', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(form);
});

// Get the uploaded image
// Image is uploaded to req.file.path
app.post('/upload', upload.single('image'), function(req, res, next) {
    client
    .labelDetection(req.file.path)
    .then(results => {
        const labels = results[0].labelAnnotations;
        res.writeHead(200, {
            'Content-Type': 'text/html'
            });
            res.write('<!DOCTYPE HTML><html><body><link rel="stylesheet" type="text/css" href="css/style.css" />');
        
            // Base64 the image so we can display it on the page
            res.write('<img width=500 src="' + base64Image(req.file.path) + '"><br>');
        
            // Write out the JSON output of the Vision API
            labels.forEach(label => res.write(`<span>${label.description}: ${label.score}</span><br>`));
        
            // Delete file (optional)
            fs.unlinkSync(req.file.path);
        
            res.end('</body></html>');
    })
    .catch(err => {
        console.error('ERROR:', err);
    });


});

app.use('/css',express.static(__dirname +'/css'));

app.listen(8080);
console.log('Server Started');

// Turn image into Base64 so we can display it easily

function base64Image(src) {
  var data = fs.readFileSync(src).toString('base64');
  return util.format('data:%s;base64,%s', mime.lookup(src), data);
}