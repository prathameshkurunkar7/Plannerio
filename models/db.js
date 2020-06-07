const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Plannerio',{useNewUrlParser:true,useFindAndModify:false,useUnifiedTopology:true},(err)=>{
    if(!err){
        console.log('Connection to Database has been established.');
    }
    else{
        console.log('Error in connecting to Database.');
    }
});
require('./user-info');