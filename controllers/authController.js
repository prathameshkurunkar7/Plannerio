const express = require('express');
const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const User = mongoose.model('user');
const passport = require('passport');
const {ensureNotAuthenticated} = require('../config/isnotauth');
var router = express.Router();

//login handle
router.post('/login',ensureNotAuthenticated,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

//signup post route handle
router.post('/',ensureNotAuthenticated,(req,res)=>{
    insertUser(req,res);
});


// function to insert a new User through signup.
async function insertUser(req,res){
    var user = new User();
    user.userName = req.body.username;
    user.emailId = req.body.emailId;
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    user.password = hashedPassword;
    user.save((err,doc)=>{
        if(!err)
        {
            //login automatically after new user registers.
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/user');
            });
        }
        else{
            res.status(500);
            res.send(`<center><h2>Not a valid UserName or Password!Please try again!</h2><br><a href="/">Go Back Home</a></center>`);
            console.log('Error in inserting into Database :'+err);
        }
    });
}

module.exports = router;