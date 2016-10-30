// a.js

module.exports = {
    sayHello:function(){
        alert('Hello World a!');
    }
    ,init: function(){
      var jquery = require('jquery');
      jquery('#a').on('click', function(){
        console.log('click in a later binding')
      })
    }
};
