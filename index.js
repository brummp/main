const express = require('express');
const path = require('path');

var app = express();
var config = require('./config.js');
var forum = require('./routes/forum.js')(config);
var notice = require('./routes/notification.js')(config);

var bodyParser = require('body-parser');//用于处理表单数据
var multipart = require('connect-multiparty');//用于处理AJAX表单

var multipartMiddleware = multipart();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/forum', forum);
app.use('/notification', notice);

app.use(express.static(path.join(__dirname,'../front/dist')))
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, '../front/dist/index.html')));


app.listen(8080, () => console.log('start'))