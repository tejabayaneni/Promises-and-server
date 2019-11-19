


var request = require('request');





request.get({
    url: 'http://localhost:3000/nickname/Teja',
    method:"GET",
},
    function (error, response,body) {
        console.log("#=========for two existing users=======(User1)#");
        console.log(response.body);
    }
);





request.get({
    url: 'http://localhost:3000/nickname/Teja1',
    method:"GET",
},
    function (error, response,body) {
        console.log("#=========for two existing users=======(User2)#");
        console.log(response.body);
    }
);





request.get({
    url: 'http://localhost:3000/nickname/abcd',
    method:"GET",
},
    function (error, response,body) {
        console.log("#=========one name not in the user database=========#");
        console.log(response.body);
    }
);
