require('./models/db');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const passport =  require('passport');
const session =  require('express-session');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const {ensureNotAuthenticated} = require('./config/isnotauth');
require('./config/passport-config')(passport);

var app = express();
var PORT = 5000;

//setting up body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Setting up user session
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized: false 
 }));
 app.use(passport.initialize());
 app.use(passport.session());

//setting up view engine
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'mainLayout',layoutsDir:__dirname + '/views/layouts'}));
app.set('view engine','hbs');
app.use(express.static('views/image'));
app.use(express.static('views/scripts'));

//Home Page Route
app.get('/',ensureNotAuthenticated,(req,res)=>{
    res.render('pages/index');
});

//Setting up Server
app.listen(PORT,()=>{
    console.log('SERVER Running on '+PORT);
})

//routes middleware
app.use('/register',authController);
app.use('/user',userController);

//all other routes handler
app.use((req,res,next)=>{
    const error = new Error('Page Not Found-404');
    error.status = 404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.send(`<center><h1>${error.message}</h1><center>`);
});
