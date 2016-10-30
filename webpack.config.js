var path = require('path')
  , webpack = require('webpack')


  module.exports = {
  	context : __dirname,

  	resolve : {
  		// Use only if you expect to have a hierarchy within these folders. Otherwise you may want to use the resolve.root option instead.
  		modulesDirectories : [ 'node_modules', 'bower_components' ],
  		root : [
  		   // path.resolve('./node_modules'),
  		   //path.resolve('./main/static/main/scripts')
  		],
  		alias: {
  			// temp solution to whose package.json/bower.json with malformed main field settings (missing or array)
  			// with this settings, those scss, css, less will need to explicitly define
  			// using absolutely path for flexibility
  			// refer to https://webpack.github.io/docs/configuration.html#resolve-alias
  			// weird... why need always ends with a '$'
  		    // ionic$: 'ionic/release/js/ionic.js'
  		    // , 'ionic-angular$': 'ionic/release/js/ionic-angular.js'
  		    // , 'angular-timeline$': 'angular-timeline/dist/angular-timeline.js'
  		    // , 'ionic-filter-bar$': 'ionic-filter-bar/dist/ionic.filter.bar.js'
  		    // , 'ion-sticky': 'ion-sticky/ion-sticky.js'
  		},
  		extensions : [ '', '.js', '.jsx' ]
  	},

  	entry : {
      // since dependency name also works
      // vendor: [
      //   'jquery'
      // ],
  		app : [
        './main.js',
        // below module is not necessary to include here
        // './a.js',
        // './b.js',
        // './c.js',
      ]
      , main1: [
        './main1'
      ]
      , main2: [
        './main2'
      ]
  	},
  	output : {
  		path : path.resolve('./static'), // bridge point to django
  		filename : '[name].js',
      chunkFilename: '[name]-[hash].js',
  		publicPath : '/static/'
  	},

  	plugins : [
        // usually multiple CommonsChunkPlugin for different pacakge logic
  	    new webpack.optimize.CommonsChunkPlugin({
          name: 'common'
  	    	// reverse the chunk name order!!!
  	    	// https://github.com/webpack/webpack/issues/1016
    			//names: ['A', 'B', ...], // means new CommonsChunkPlugin({name: 'A'}), new CommonsChunkPlugin({name: 'B'}), ... that shared the same CommonsChunkPlugin
    			//,filename: 'common.js' // usually the will be the [name].js
          , chunks: ['main1', 'main2'] // could be entry points or dependency name
    			//, chunks: ['main', 'main2']	// which chunks(those in entry section) to become this common chunk
    	    //	,minChunks: Infinity	// refer to http://jonathancreamer.com/advanced-webpack-part-1-the-commonschunk-plugin/#webpackplugins for minChunks explanation
    		})
        , new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor'
          // names: ['app', 'vendor']
          , chunks: ['app', 'jquery'] // could be entry points or dependency names
          , minChunks: Infinity
    		})
  	    , new webpack.ProvidePlugin({
  	        '$': 'jquery',
            '_': 'lodash'
  	    })
  	],

  	module : {
  		loaders : [
  			{
  				test: /\.(png|gif|jpe?g|ico)$/,
  				loader: 'url-loader?limit=8192' // the parameter in the url-loader is for inlining images if they are equal or under 8kb.
  			}
  			/*
  			// unnecessary, will go with template over templateUrl
  			// plz refer to http://tech.smarpshare.com/truongsinh/angular-template-vs-templateurl-the-move-toward-true-modular-development/
  			,{
  				test: /\.html$/,
  				loader: 'ngtemplate!html-loader'
  			}
  			*/
  			,{
  				test: /\.html$/,
  				loader: 'html-loader'
  			}
  		],
  	},

  	devtool : 'source-map'
    // devtool : 'eval'
  }
