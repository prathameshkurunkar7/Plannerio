const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose =  require('mongoose');
const User = mongoose.model('user')

module.exports=function(passport){
    const authenticateUser =async (email,password,done)=>{
           User.findOne({emailId:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'This email is not registered'});
                }
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err)
                        throw err;
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:'Password Incorrect'});
                    }
                });
            })
            .catch(err=>console.log(err));
    }
    passport.use(new localStrategy({usernameField:'emailId'},authenticateUser));
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done)=> {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}