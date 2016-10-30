
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var path = require('path')

var rewriteUrl = function(replacePath) {
    return function(req, opt) {  // gets called with request and proxy object
        var queryIndex = req.url.indexOf('?');
        var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";
        req.url = req.path.replace(opt.path, replacePath) + query;
        gutil.log("rewriting ", req.originalUrl, req.url);
    };
};

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);


// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("test", function(callback){
	gutil.log(gutil.env);
	callback();
});

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// with this dev-server, index.html should not go with django's {% static '/path/to/static/resources' %}

	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";	// for speed up
	myConfig.debug = true;

	var backendServerEndpoint = gutil.env['backend-server-endpoint'] || 'http://localhost:8090';
	var webpackServerHost = gutil.env['webpack-server-host'] || 'localhost';
	var webpackServerPort = gutil.env['webpack-server-port'] || '8080';
	var webpackServerEndpoint = "http://"+webpackServerHost+":"+webpackServerPort;

	gutil.log('backendServerEndpoint:', backendServerEndpoint);
	// below is unnecessary
	// myConfig.output.publicPath = 'http://localhost:8080/assets/'

	// event with HotModuleReplacementPlugin, we still need to add
	// "webpack-dev-server/client?http://localhost:8080", "webpack/hot/dev-server"
	// to entry point
	// myConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080", "webpack/hot/dev-server");
	myConfig.entry.app.unshift("webpack-dev-server/client?"+webpackServerEndpoint, "webpack/hot/dev-server");
	// plz refer to https://github.com/webpack/webpack/issues/1151#issuecomment-162792966
	myConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		//, hot: true // not working, plz refer to https://github.com/webpack/webpack/issues/1151#issuecomment-162792966

		// contentBase where the index.html will be
		// due to modular dev process
		// contentBase: path.resolve('./main/templates')

		// this proxy should go before publicPath options
		// plz stick to https://webpack.github.io/docs/webpack-dev-server.html
		// proxy: [
		//     {
		//     	path: /api\/*/
		//     	// , target: "http://localhost:8090"
		//     	, target: backendServerEndpoint
	  //     }
		// ]

		publicPath: '/static/' // will be listening under
		, stats: {
			colors: true
		}
	//}).listen(8080, "localhost", function(err) {
	}).listen(webpackServerPort, webpackServerHost, function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		// gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
		gutil.log("[webpack-dev-server]", webpackServerEndpoint+"/webpack-dev-server/index.html");
	});
});

// below is not good since
// 1. project folder structure need to change every time django app is edited
// 2. livereload localhost:35729/livereload.js will be added to entry point 'myConfig.entry.app.unshift("//localhost:35729/livereload.js")'

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh

//gulp.task("build-dev", ["webpack:build-dev"], function() {
//	gulp.watch([
//	            "main/static/**/*"
//	            , "authx/static/**/*"
//	            , "account/static/**/*"
//	            , "friend/static/**/*"
//	            , "tag/static/**/*"
//	], ["webpack:build-dev"]);
//});

// create a single instance of the compiler to allow caching
//var devCompiler = webpack(myDevConfig);
//
//gulp.task("webpack:build-dev", function(callback) {
//	// run webpack
//	// modify some webpack config options
//	var myDevConfig = Object.create(webpackConfig);
//	myDevConfig.devtool = "sourcemap";
//	myDevConfig.debug = true;
//	devCompiler.run(function(err, stats) {
//		if(err) throw new gutil.PluginError("webpack:build-dev", err);
//		gutil.log("[webpack:build-dev]", stats.toString({
//			colors: true
//		}));
//		callback();
//	});
//});
