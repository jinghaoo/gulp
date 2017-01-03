
var gulp = require('gulp'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin')
	autoprefixer = require('gulp-autoprefixer'),
	rev = require('gulp-rev'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	revCollector = require('gulp-rev-collector'),
	htmlmin = require('gulp-htmlmin');

// 处理css
gulp.task('css', function () {

	return gulp.src('./public/less/main.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(autoprefixer())
		.pipe(rev())
		.pipe(gulp.dest('./release/public/css'))
		.pipe(rev.manifest())
		.pipe(rename('css-mainfest.json'))
		.pipe(gulp.dest('./release/rev'));

});

// 图片处理
gulp.task('image', function () {

	return 	gulp.src(['./public/images/**/*', './uploads/**/*'], {base: './'})
		.pipe(imagemin())
		.pipe(rev())
		.pipe(gulp.dest('./release/'))
		.pipe(rev.manifest())
		.pipe(rename('image-manifest.json'))
		.pipe(gulp.dest('./release/rev'));
});

// md5名
gulp.task('useref', function () {

	return gulp.src('./index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.js', rev()))
		.pipe(gulp.dest('./release'))
		.pipe(rev.manifest())
		.pipe(rename('js-manifest.json'))
		.pipe(gulp.dest('./release/rev'));

});

// 压缩html
gulp.task('html', function () {

	return gulp.src('./views/*.html')
		.pipe(htmlmin())
		.pipe(gulp.dest('./release/views'));

});

// 其它内容
gulp.task('other', function () {

	gulp.src(['./api/*', './public/fonts/*'], {base: './'})
		.pipe(gulp.dest('./release'));

});

// 路径替换
gulp.task('rev', ['css', 'image', 'useref'], function () {
	gulp.src(['./release/rev/*.json', './release/index.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./release'));
});


gulp.task('default', ['rev', 'other', 'html']);


gulp.task('watch', function () {
	gulp.watch('./index.html', ['default'], function(event) {

	});	
});
