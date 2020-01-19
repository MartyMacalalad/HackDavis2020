const express=require('express');
const path = require('path');
const app=express();
const vision = require('@google-cloud/vision');
app.get('/*', (req, res) => {
res.sendFile(path.join(__dirname, './index.html'));
})
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'hackdavis2020-265600-fcccb5d30492.json'
});
  
// Performs label detection on the image file
client
.labelDetection('./waterbottle.jfif')
.then(results => {
    const labels = results[0].labelAnnotations;
    labels.forEach(label => console.log(label.description));
}) 
.catch(err => {
    console.error('ERROR:', err);
});

const port =8081;
app.listen(port,()=>{
console.log(`App running on ${port}`);
})