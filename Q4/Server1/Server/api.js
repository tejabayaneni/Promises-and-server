const express = require('express');
const router = express.Router();
// users = require("./user.model"),
// regUser = require("./regUser.model");

request = require('request'),
Datastore = require('nedb'),
regUserNEDB = new Datastore ({ filename: '../../db/regUsers.db', autoload: true });
const bcrypt = require('bcrypt');


/**
 * Store username details
//  */

  router.get("/register/:username/:password/:nickname",function(req,res){
    console.log(req.params);
    request.put({
        url: 'http://localhost:4200/register',
        method:"PUT",
        json:true,
        body: {
                        username : req.params.username,
                        pwd      : req.params.password,
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
  router.get("/allUsers/:regUser/:regPass",function(req,res){

    regUserNEDB.loadDatabase(function (error) {
        if (error) {
            console.log('FATAL: local database could not be loaded. Caused by: ' + error);
            throw error;
          }
       var promise = new Promise(function(resolve,reject){
            checkUser(req.params.regUser,req.params.regPass,function(auth,msg){
                if(auth){
                    resolve();
                }
                else{
                    reject(msg)
                }
            })
        })

    promise.then(function(){
        regUserNEDB.find( { }, { _id: 0, username: 1 },function(err,success){
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
    .catch(function(err){
        if(err){
            console.log(err);
            res.send(err)
        }
    })

    })
  })



function decryptPassword(hashpwd,password,cb){
   // var hashpwd ="12345"
   console.log("==decryptPassword ===");
   bcrypt.compare(password, hashpwd, function(err, res) {
        if(res){
            cb(true,"");
        }else{
            console.log("wrong pwd");
            cb(false,"Username or password Incorrect");
        }
    });
}



  function checkUser(user,password,cb){
    regUserNEDB.findOne( { username : user },function(err,success){
        if(err){

          res.send({"some error while checking user authenticity": err});
        }
        else{
            if(success!=null){
                console.log(success + " ===> checkUser");
                decryptPassword(success.password,password,cb);
            }
            else cb(false,"User Does not exists please register");
        }
  })
}


    /*
  *
  * Returns the nicknames of the users present in regUserDB
  */
 router.get("/nickname/:regUser/:regPass/:username",function(req,res){

    regUserNEDB.loadDatabase(function (error) {
        if (error) {
            console.log('FATAL: local database could not be loaded. Caused by: ' + error);
            throw error;
          }
        var promise = new Promise(function(resolve,reject){

        checkUser(req.params.regUser,req.params.regPass,function(auth,msg){
            if(auth){
                resolve();
            }
            else{
                reject(msg)
            }
        })

        });




    promise.then(function(){

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
    .catch(function(err){
        if(err){
            console.log(err);
            res.send(err)
        }
    })
  })
})



module.exports = router;
