

// const express = require('express');
// const router = express.Router();
var request = require('request');

// var user=0;
// for(user=0;user<=6;user+=1){
    
// }

var username = "tejaB";
var nickname = "teja";

var user=0;
for(user=0;user<6;user+=1){
    username=username+user;
    nickname=nickname+user;
    request.put({
        url: 'http://localhost:4200/register',
        method:"PUT",
        json:true,
        body: { 
                        username : username,
                        nickname : nickname
        }
    },
        function (error, response, body) {
                console.log(response.body)
               
        }
    );
} 





