// Dev mode
if (!process.env.CLEARDB_DATABASE_URL) {    
    process.env.CLEARDB_DATABASE_URL='mysql://root:@localhost:3306/node_api';
}

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const logger = require('./services/logger.service');
//const jwtOptions = require('./config/options').jwtStrategy;
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(morgan('combined', {skip: logger.skip, stream: logger.stream}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

// use q promises
global.Promise = require('q').Promise;

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
require('./routes/routes.js')(app);
require('./routes/auth.routes.js')(app);
require('./routes/user.routes.js')(app);

// Database
require(__dirname + '/services/database.service');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});