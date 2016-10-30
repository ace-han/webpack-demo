var $ = require('jquery')

$(function(){
  $('#pre_a').on('click', function(){
    console.log('amd style lazy loading');
    // commonjs  style
    require.ensure([], function(require) {
        console.log('module a fetched')
        var a = require('./a')
        a.init();
    }, 'module_a');
  })

  $('#b').on('click', function(){
    // amd style doesnot support named chunk
    require.ensure([], function(require){
      require('./b').sayHello()
    }, 'module_b')
  })
})
