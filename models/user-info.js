const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    emailId:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true
    },
    todos:[{
        task:{type:String,required:true},
        status:{type:String,default:'In Progress'},
        label:{type:String,default:'Other'},
        created_at: { type : Date, default: Date.now },
        dueDate:{type : Date}
    }],
    archive:[{
        task:{type:String},
        status:{type:String,default:'Completed'},
        label:{type:String,default:'Other'},
        completed_at: {type : Date, default: Date.now}
    }]
});

mongoose.model('user',userSchema);