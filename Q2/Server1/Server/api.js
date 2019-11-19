const express = require('express');
const router = express.Router();
request = require('request'),
Datastore = require('nedb'),
userNEDB = new Datastore ({ filename: '../../db/users.db', autoload: true }),
regUserNEDB = new Datastore ({ filename: '../../db/regUsers.db', autoload: true });
const bcrypt = require('bcrypt');


  router.get("/register/:username/:nickname",function(req,res){
    console.log(req.params);
    request.put({
        url: 'http://localhost:4200/register',
        method:"PUT",
        json:true,
        body: { 
                        username : req.params.username,
                        nickname : req.params.nickname
        }
    },
        function (error, response, body) {
               // console.log(response.body)
                res.send(response.body);
        }
    );
  })


  /*
  *
  * Returns all users present in regUserDB
  */
  router.get("/allUsers",function(req,res){
    regUserNEDB.loadDatabase(function (error) {   
        if (error) {
            console.log('FATAL: local database could not be loaded. Caused by: ' + error);
            throw error;
          }  
        regUserNEDB.find( { }, { _id: 0,  username: 1 },function(err,success){
            if(err){  
    
                res.send({"error while fetching all users from db": err});              
            }
            else{        
                console.log(success)
                var d = new Date();
                res.send({"date": d.toString(),"users": success });  
            }  
        })
  })

})  

    /*
  *
  * Returns the nicknames of the users present in regUserDB
  */
 router.get("/nickname/:username",function(req,res){
    regUserNEDB.loadDatabase(function (error) {   
        if (error) {
            console.log('FATAL: local database could not be loaded. Caused by: ' + error);
            throw error;
          }  
        regUserNEDB.findOne( { "username": req.params.username },function(err,success){
            if(err){  

                res.send({"error while fetching all users from db": err});              
            }
            else{        
                console.log(success)
                if(success==null){
                    res.send({"user": req.params.username, "error": "Not Found"});
                }
                else{
                    res.send({"user": req.params.username, "nickname": success.nickname});  
                }
            }  
        })
    })
})
  


module.exports = router;