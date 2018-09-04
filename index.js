const commander = require('commander');
const express = require('express');
const path = require('path');

var app = express();

var bodyParser = require('body-parser');//用于处理表单数据
var multipart = require('connect-multiparty');//用于处理AJAX表单

var multipartMiddleware = multipart();

var config;

commander
    .option('-t --target', 'set dir of config file')
    .action(function (path) {
        if (typeof path != 'string')
            config = require('./config');
        else
            config = require(path);
    })
    .parse(process.argv);

var forum = require('./routes/forum.js')(config);
var notice = require('./routes/notification.js')(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/forum', forum);
app.use('/notification', notice);

app.use(express.static(path.join(__dirname,'dist')))
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, 'dist/index.html')));

app.use(function(req,res){
    res.send(404);
})


app.listen(8081, () => console.log('service start'))