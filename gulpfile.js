//---------------------------------------------------------------------------------------
// Configs
//---------------------------------------------------------------------------------------

var development = {
	html: 'builds/development/',
	sass: 'builds/development/sass/',
	js 	: 'builds/development/js/',
	img : 'builds/development/imgs/'
};

var production  = {
	html: 'builds/production/',
	css : 'builds/production/css/',
	js 	: 'builds/production/js/',
	img : 'builds/production/imgs'
};

//---------------------------------------------------------------------------------------
// vars & plugins
//---------------------------------------------------------------------------------------

var gulp 			= require('gulp'),
	fs 				= require('fs'),
	babel 			= require('gulp-babel'),
	BS 				= require('browser-sync').create(),
	autoprefixer 	= require('gulp-autoprefixer'),
	concat 			= require('gulp-concat'),
	uglify 		    = require('gulp-uglify'),
	minifycss		= require('gulp-minify-css'),
	plumber 		= require('gulp-plumber'),
	sass 	 	    = require('gulp-sass'),
	gulpif 			= require('gulp-if'),
	minifyhtml		= require('gulp-minify-html'),
	sourcemaps		= require('gulp-sourcemaps'),
	cache = require('gulp-cache'),
	imagemin = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	imageminZopfli = require('imagemin-zopfli'),
	imageminMozjpeg = require('imagemin-mozjpeg'), //need to run 'brew install libpng'
	imageminGiflossy = require('imagemin-giflossy');

//-	
var data 			= '';
var fileName 		= '';


//---------------------------------------------------------------------------------------
// init development: creating std files
//---------------------------------------------------------------------------------------

gulp.task('initD', function (done) {
	Object.keys(development).forEach(function(e, i){
		 if(i != Object.keys(development).length-1){
			switch(e){
				case 'html':
					fileName = './index.html'
					var data ='<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title></title>\n\t<link rel="stylesheet" href="css/style.min.css">\n</head>\n<body>\n\n\t<script src="js/script.min.js"></script>\n</body>\n</html>';
					//var html= pd.xml(data);
				break;

				case 'sass':
					fileName = './0_base.scss'
					data = '';
				break;

				case 'js':
					fileName = './0_base.js'
					data = '';
				break;
			}
			var path = development[e] + fileName;
				fs.exists(path, function(exists) {
			    	if (exists) {
			        done()
				    }
				    else
				    {
				    		fs.writeFile(path, data, 'utf8' , (err) => {
							  if (err) console.log(err);
							  	done()
							});
				    }
			});	
		}
		else{
			//reset for watch
		}
	})
})


//---------------------------------------------------------------------------------------
// init production: creating std files
//---------------------------------------------------------------------------------------

gulp.task('initP', function (done) {
	Object.keys(production).forEach(function(e, i){
		 if(i != Object.keys(production).length-1){
			switch(e){
				case 'html':
					fileName = './index.html'
					var data ='<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title></title>\n\t<link rel="stylesheet" href="css/style.min.css">\n</head>\n<body>\n\n\t<script src="js/script.min.js"></script>\n</body>\n</html>';
					// var html= pd.xml(data);
				break;

				case 'css':
					fileName = 'style.min.css'
					data = '';
				break;

				case 'js':
					fileName = 'script.min.js'
					data = '';
				break;
			}
			var path = production[e] + fileName;
				fs.exists(path, function(exists) {
			    	if (exists) {
			        done()
				    }
				    else
				    {
				    		fs.writeFile(path, data, 'utf8' , (err) => {
							  if (err) console.log(err);
							  	done()
							});
				    }
			});	
		}
	})
})


//---------------------------------------------------------------------------------------
// init development & production: creating folders
//---------------------------------------------------------------------------------------

gulp.task('dir', function () {
    return gulp.src('*.*', {read: false})
		.pipe(gulp.dest(development.html))
		.pipe(gulp.dest(development.sass))
		.pipe(gulp.dest(development.js))
		.pipe(gulp.dest(development.img))
		.pipe(gulp.dest(production.html))
		.pipe(gulp.dest(production.css))
		.pipe(gulp.dest(production.js))
		.pipe(gulp.dest(production.img))
});


gulp.task('init', gulp.series('dir', 'initD', 'initP' , function(done) {
  // do more stuff
  done();
}));


//---------------------------------------------------------------------------------------
// css minifying to pruductions
//---------------------------------------------------------------------------------------

function css(){
	onContinue();
  return gulp.src(development.sass)
	.pipe(plumber({errorHandler: onErr}))
	.pipe(concat('style.min.css'))
	.pipe(sass())
	.pipe(autoprefixer('last 2 version'))
	.pipe(minifycss())
	.pipe(gulpif(onMaps, sourcemaps.init()))
	.pipe(gulpif(onMaps,sourcemaps.write()))
	.pipe(gulp.dest(production.css))
	.pipe(BS.stream())
}

exports.css = css;


//---------------------------------------------------------------------------------------
// JS Task
//---------------------------------------------------------------------------------------

function js() {
	onContinue();
  return gulp.src(development.js)
	.pipe(plumber({errorHandler: onErr}))
	.pipe(concat('script.min.js'))
	.pipe(babel())
	.pipe(uglify())

	// .pipe(gulpif(onMaps, sourcemaps.init()))
	// .pipe(gulpif(onMaps,sourcemaps.write()))
	.pipe(gulp.dest(production.js))
	.pipe(BS.stream())
};
exports.js = js;


//---------------------------------------------------------------------------------------
// HTML Task to be done manually mybe wanted to make a them from it so its not automatic
//---------------------------------------------------------------------------------------

function html() {
	onContinue();
return gulp.src(development.html)
	.pipe(plumber({errorHandler: onErr}))
	.pipe(gulpif(onMinify, 
		minifyhtml({
		empty : false,
		comments: true,
		})
	))
	.pipe(gulp.dest(production.html))
	.pipe(BS.stream())	
};
exports.html = html;


//---------------------------------------------------------------------------------------
// IMAGE Task : from https://gist.github.com/LoyEgor/e9dba0725b3ddbb8d1a68c91ca5452b5
//---------------------------------------------------------------------------------------


function img() {
	onContinue();
	return gulp.src([development.img])
        .pipe(cache(imagemin([
            //png
            imageminPngquant({
                speed: 1,
                quality: [0.95, 1] //lossy settings
            }),
            imageminZopfli({
                more: true
                // iterations: 50 // very slow but more effective
            }),
            //gif
            // imagemin.gifsicle({
            //     interlaced: true,
            //     optimizationLevel: 3
            // }),
            //gif very light lossy, use only one of gifsicle or Giflossy
            imageminGiflossy({
                optimizationLevel: 3,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //svg
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            //jpg lossless
            imagemin.jpegtran({
                progressive: true
            }),
            //jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 90
            })
        ])))
        .pipe(gulp.dest(production.img));
}
exports.img = img;

//---------------------------------------------------------------------------------------
// Watch All
//---------------------------------------------------------------------------------------

function watch(){
	onContinue();
	BS.init({
		server: ('./' + production.html)
	});
	gulp.watch(development.sass, css);
	gulp.watch(development.js, js);
	gulp.watch(development.html, html);
	gulp.watch(development.img, img);
}
exports.watch = watch;


//---------------------------------------------------------------------------------------
// Global var & functions
//---------------------------------------------------------------------------------------

var onMinify = (process.argv.indexOf('-min') != -1 );
var onMaps   = (process.argv.indexOf('-map') != -1 );

var onErr = function(err){
	console.log(err);
	this.emit('end');
};

var onContinue = function(){
	development.html ='builds/development/*.html';
	development.sass ='builds/development/sass/**/*.scss';
	development.js ='builds/development/js/**/*.js';
	development.img ='builds/development/imgs/**/*.{gif,png,jpg,svg}';

}
