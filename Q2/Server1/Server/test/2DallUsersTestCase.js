


var request = require('request');


request.get({
    url: 'http://localhost:3000/allUsers',
    method:"GET",
},
    function (error, response,body) {
            console.log(response.body);
    }
);
