const express = require('express');
const router = express.Router();
// users = require("./user.model"),
// regUser = require("./regUser.model");

request = require('request'),
Datastore = require('nedb'),
userNEDB = new Datastore ({ filename: '../../db/users.db', autoload: true }),
regUserNEDB = new Datastore ({ filename: '../../db/regUsers.db', autoload: true });
const bcrypt = require('bcrypt');




//   router.get("/register/:username/:password/:nickname",function(req,res){
//     console.log(req.params);
//     request.put({
//         url: 'http://localhost:3000/register',
//         method:"PUT",
//         json:true,
//         body: {
//                         username : req.params.username,
//                         pwd      : req.params.password,
//                         nickname : req.params.nickname
//         }
//     },
//         function (error, response, body) {
//                // console.log(response.body)
//                 res.send(response.body);
//         }
//     );
//   })



  router.put("/register",function(req,res){
    console.log(req.body);
    let usr = {
      username : req.body.username,
      password : req.body.pwd,
      nickname : req.body.nickname
    }

    regUserNEDB.findOne( { username : usr.username },function(err,success){
        if(err){
          //  res.send(err);
         /// res.send(err);
          res.send({"registration": "failed", "user": usr.username , "reason": err});
        }
        else{
           // console.log(success);
            if(success==null){
               //encrypt userPassword
               const saltRounds = 10;
               bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(usr.password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                    }
                    //SAving User To  regUSers Collection Since the user doesn't exists to db.
                    console.log(hash);
                    usr.password = hash;
                    regUserNEDB.insert(usr,function(err,success){
                            if(err){
                                //If any error occurs while saving the regUser Object
                                res.send({"registration": "failed", "user": usr.username , "reason": err});
                            }
                            else{
                                //User inserted in regUsers collections
                                console.log("User saved!");
                                res.send({"registration": "succeeded", "user":  usr.username, "reason": ""});
                            }
                        });

                    });
                })
            }
            else{
                    //SAving User To MongoDB regUSers Collection Since the user doesn't exists to db.
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
                //User already exists in regUsers collections
               // res.send({"registration": "failed", "user": usr.username , "reason": "UserName already exists"});
            }
        }
    });

  })

  /*
  *
  * Returns all users present in regUserDB
  */
//   router.get("/allUsers/:regUser/:regPass",function(req,res){

//     var promise = new Promise(function(resolve,reject){
//         checkUser(req.params.regUser,req.params.regPass,function(auth,msg){
//             if(auth){
//                 resolve();
//             }
//             else{
//                 reject(msg)
//             }
//         })
//     })

//     promise.then(function(){
//         regUserNEDB.find( { }, { _id: 0, username: 1 },function(err,success){
//             if(err){

//                 res.send({"error while fetching all users from db": err});
//             }
//             else{
//                 console.log(success)
//                 var d = new Date();
//                 res.send({"date": d.toString(),"users": success });
//             }
//         })
//     })
//     .catch(function(err){
//         if(err){
//             console.log(err);
//             res.send(err)
//         }
//     })
//   })



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
//   */
//  router.get("/nickname/:regUser/:regPass/:username",function(req,res){

//     var promise = new Promise(function(resolve,reject){

//         checkUser(req.params.regUser,req.params.regPass,function(auth,msg){
//             if(auth){
//                 resolve();
//             }
//             else{
//                 reject(msg)
//             }
//         })

//     });

//     promise.then(function(){

//         regUserNEDB.findOne( { "username": req.params.username },function(err,success){
//             if(err){

//                 res.send({"error while fetching all users from db": err});
//             }
//             else{
//                 console.log(success)
//                 if(success==null){
//                     res.send({"user": req.params.username, "error": "Not Found"});
//                 }
//                 else{
//                     res.send({"user": req.params.username, "nickname": success.nickname});
//                 }
//             }
//         })
//    })
//     .catch(function(err){
//         if(err){
//             console.log(err);
//             res.send(err)
//         }
//     })
// })



module.exports = router;
