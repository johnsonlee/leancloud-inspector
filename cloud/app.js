var express = require('express');
var routes = require('cloud/routes');
var app = express();

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'Inspector'}));
app.use('/ls', routes.ls);
app.use('/tree', routes.tree);

app.get('/', routes.index);

app.listen();
