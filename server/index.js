var express = require('express');


var app = express();
var PORT = 8080;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index.html');
});


app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});
