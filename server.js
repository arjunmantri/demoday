//Linkedin Prototype0. In this below REST API's are created using Nodejs and database as RDS and 
//DynamoBD on the AWS. Authentication has to be done using the secret key and region mentioned in the app.config and 
//app.config1 files.
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var fs = require('fs');
var AWS = require('aws-sdk');


//INITIALIZE MYSQL DB
/*
var mySQL = require('./config/mySqlQuery');

mySQL.useDatabase(function(err, flag){
    
    if(err)
    {
        Console.log('App error ' + err);
    }
    if(flag)
    {
       Console.log('Db phase1');
        
        
    }

});

mySQL.createTable1(function(err, flag)
        {
           if(err)
           {
               Console.log('App error ' + err);
           }
            if(flag)
            {
                    Console.log('Db phase2');                 
            }
            
});


mySQL.createTable2(function(err, flag){
                        
        if(err)
        {
            Console.log('App error ' + err);
        }
        if(flag)
        {
             Console.log('Db phase3');

        }
});
*/

var app = express();

var debug = require('debug')('passportDemo:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
console.log("App running on port " + port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//var routes = require('./routes');
//var user = require('./routes/userprofile');
//var company = require('./routes/companyprofile');
var authroutes = require('./routes/authroutes');


//import passport function
require('./config/passportAuth').passportAuth(passport);
require('./config/passportAuthCompany').passportAuthCompany(passport);

//app.set('port', process.env.PORT || 8082);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(app.router);

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 

//Create SNS(Simple notification Service) client and pass in region.
//var sns = new AWS.SNS({ region: config.AWS_REGION});

//mongodb connection
var mongoconn = require("./routes/mongoConnection");
mongoconn.createMongoConnection();


/*
//GET home page.
app.get('/', routes.index);

//POST signup form.
//app.post('/signup', user.signup); 

//profile edit page.
app.get('/editProfile',user.viewProfile);

//UserProfile page
app.get('/userprofile',user.getProfile);

//Companyprofile page
//app.get('/companyprofile',company.getProfile);

//Job posting to store the data in DynamoDB and below are the fields chosen for the same.
app.post('/jobpost',user.jobposts);

//Company profile information and job posting details of the company
app.post('/companyProfile',company.postCompany);

//save profile info for users
app.post('/userProfile',user.postProfile);
*/


//register authentication routes
app.use('/', authroutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
