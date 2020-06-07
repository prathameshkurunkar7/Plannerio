const express = require('express');
const webpush = require('web-push');
var CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const {ensureAuthenticated} = require('../config/isauth');
var router = express.Router();

const publicVapidKey = 'BCNtuvG5chLTqMhxFqoEG5vslXNH1vOcXva9xVoe7Mm0UGCghfqgldFH-peeiE6rn7vS24a-0Qc4tJe_s6z5GFU';
const privateVapidKey =   'VVk2QhtfdV2Pn6VOFkBoRdzO7oIUTuWrdlmtAZ9B_8w';

webpush.setVapidDetails('mailto:test@test.com',publicVapidKey,privateVapidKey);


//get route handler home route
router.get('/',ensureAuthenticated,(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            res.render('pages/home',{
                todos:doc.todos,
                archive:doc.archive,
                userName:req.user.userName
            });
        }
        else{
            console.log(err);
        }
    })     
});


//post route handler for web-push notification

router.post('/subscribe',(req,res)=>{

    const subscription = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({title:'Plannerio',name:`${req.user.userName}`});
    var count = 0;
    var job = new CronJob('*/1 * * * *', function() {
        
        var current_date = new Date();
        User.findOne({todos:{$elemMatch:{dueDate:{$lte:current_date}}}},(err,doc)=>{
            if(!err){
                if(doc!=null)
                {
                    count++;
                    if(count === 1)
                    {
                        webpush.sendNotification(subscription,payload).catch(err =>console.log(err));
                        job.stop();
                    }
                }
            }else{
                console.log('Reminder Not Found');
                console.log(err);
            }
        })
      }, null, true, 'Asia/Kolkata');
      job.start();
});


//To-Do operations here.

//post route handler add ToDo
router.post('/addToDo',ensureAuthenticated,(req,res)=>{
    var todo = {'task':req.body.todo,'label':req.body.Label};
    User.findOneAndUpdate({emailId:req.user.emailId},{$push:{todos:todo}},(err,doc)=>{
        if(!err){
            res.redirect('/user');
        }
        else{
            console.log(err);
        }
    });
});

//delete route handler delete ToDo
router.delete('/deleteToDo/:id',(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            User.updateOne({emailId:req.user.emailId},{$pull:{todos:{_id:req.params.id}}},(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send('Successful Attempt');
                }
            })
        }
        else{
            console.log(err);
        }
    })
});
//delete route handler trash ToDo
router.delete('/trashToDo/:id',(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            User.updateOne({emailId:req.user.emailId},{$pull:{archive:{_id:req.params.id}}},(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send('Successful Attempt');
                }
            })
        }
        else{
            console.log(err);
        }
    })
});

//put route handler check ToDo
router.put('/completeToDo/:id',(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            var todo = {'task':req.body.task,'status':req.body.status,'label':req.body.label}
            User.updateOne({emailId:req.user.emailId},{$pull:{todos:{_id:req.params.id}}},(err)=>{
                if(err){
                    console.log(err);
                }
            });
            User.updateOne({emailId:req.user.emailId},{$push:{archive:todo}},(err)=>{
                if(!err){
                    res.send('Successful Attempt');
                }
                else{
                    console.log(err);
                }
            })
        }
        else{
            console.log(err);
        }
    });
});


//put route hanlder to uncheck ToDo
router.put('/incompleteToDo/:id',(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            var todo = {'task':req.body.task,'status':req.body.status,'label':req.body.label}
            User.updateOne({emailId:req.user.emailId},{$pull:{archive:{_id:req.params.id}}},(err)=>{
                if(err){
                    console.log(err);
                }
            });
            User.updateOne({emailId:req.user.emailId},{$push:{todos:todo}},(err)=>{
                if(!err){
                    res.send('Successful Attempt');
                }
                else{
                    console.log(err);
                }
            })
        }
        else{
            console.log(err);
        }
    });
});

//post route handler for setting reminder
router.post('/setReminder/:id',(req,res)=>{
    User.findOne({emailId:req.user.emailId},(err,doc)=>{
        if(!err){
            var due = `${req.body.duedate} ${req.body.duetime}`;
            var d=due.toString();
            var dued = new Date(d).toISOString();
            User.updateOne({emailId:req.user.emailId,'todos._id': req.params.id},{$set:{'todos.$.dueDate':dued}},(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send('Successful');
                }
            });
        }
        else{
            console.log(err);
        }
    })
})


module.exports = router;