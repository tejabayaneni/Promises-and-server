const express = require('express');
const router = express.Router();
// users = require("./user.model"),
// regUser = require("./regUser.model");
requestify = require('requestify'),
request = require('request'),
Datastore = require('nedb'),
userNEDB = new Datastore ({ filename: '../../db/users.db'}),
regUserNEDB = new Datastore ({ filename: '../../db/regUsers.db', autoload: true });
const bcrypt = require('bcrypt');


router.put("/register",function(req,res){
    console.log(req.body);
    let usr = {
      username : req.body.username,
      nickname : req.body.nickname
    }
         regUserNEDB.findOne( { username : usr.username },function(err,success){
            if(err){

            res.send({"registration": "failed", "user": usr.username , "reason": err});
            }
            else{
                        if(success==null){
                                regUserNEDB.insert(usr,function(err,success){
                                        if(err){
                                            //If any error occurs while saving the regUser Object
                                            res.send({"registration": "failed", "user": usr.username , "reason": err});
                                        }
                                        else{
                                            //User inserted in regUsers collections
                                            console.log("User saved!");
                                            res.send({"registration": "succeeded", "user":  usr.username, "reason": "Inserted User"});
                                        }
                                    });
                        }
                        else{
                                regUserNEDB.update( { username: usr.username , _id: success._id } , {$set : { nickname : usr.nickname  }},function(err,success){
                                    if(err){
                                        //If any error occurs while saving the regUser Object
                                        res.send({"registration": "failed", "user": usr.username , "reason": err});
                                    }
                                    else{
                                            //User inserted in regUsers collections
                                        console.log("User Updated!");
                                        res.send({"registration": "failed", "user":  usr.username, "reason": "Updated User with nickname"});
                                    }
                                });
                        }

            }
  })

})


module.exports = router;
