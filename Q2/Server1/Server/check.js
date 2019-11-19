
const bcrypt = require('bcrypt');

password = '1234';

const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        if(err){
            console.log(err);
        }
        console.log(hash);
        console.log("hey")
        bcrypt.compare("1234", hash, function(err, res) {
            console.log(res);
            console.log("true");
        });
    });
});


