var config = require('./gulp.config.json');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var es = require('event-stream');
var browserSync = require('browser-sync').create();
var jsonServer = require("gulp-json-srv");
 
// Gulp Mock Server Tasks
var server = jsonServer.create({
    port: 3003,
    baseUrl: '/api/',
});
 
gulp.task("mock-server", function(){
    return gulp.src("mock-server/*.json")
        .pipe(server.pipe());
});

gulp.task("watch-mock", function () {
    gulp.watch("mock-server/*.json");
});

gulp.task("start-mock",['mock-server', 'watch-mock']);


// Application Tasks
gulp.task('clean', function(){
    return gulp.src('dist/')
    .pipe(clean())
});

gulp.task('jshint', function(){
    return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts',['appScripts'], function(){
    return gulp.src(config.vendor.scripts_min)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('appScripts', function(){
    return gulp.src([
        'vendor/requirejs/require.js',
        'js/**/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('copyIndex', ['copyPages', 'copyFragments', 'fonts', 'img'], function(){
    return gulp.src([
        'index.html',
    ])
    .pipe(gulp.dest('dist/'))
});

gulp.task('img', function(){
    return gulp.src([
        'img/*',
    ])
    .pipe(gulp.dest('dist/img'))
});

gulp.task('copyPages', function(){
    return gulp.src([
        './pages/*',
    ])
    .pipe(gulp.dest('dist/pages'))
});

gulp.task('copyFragments', function(){
    return gulp.src([
        './fragments/*',
    ])
    .pipe(gulp.dest('dist/fragments'))
});

gulp.task('fonts', function(){
    return gulp.src([
        'vendor/font-awesome/fonts/*',
    ])
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('styles', ['appStyles'], function(){
    return gulp.src(config.vendor.styles)
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('appStyles', function(){
    return gulp.src('css/*.css')
    .pipe(concat('style.min.css'))
    // .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});


gulp.task('serve', ['default'], function(){
    
    browserSync.init({
        server:'./dist/'
    });

    gulp.watch(['./*.html', './js/**/*.js', './css/*.css'], function(e){
        if(e.path.indexOf(".js") != -1){
            return gulp.run(["jshint","scripts"]);
        }else if(e.path.indexOf(".css") != -1){
            return gulp.run("styles");
        }else if(e.path.indexOf(".html") != -1){
            return gulp.run("copyIndex");
        }else{
            return gulp.run("default");
        }
    }).on('change', browserSync.reload);
});

gulp.task('default', function(cb){
    return runSequence('clean', ['jshint', 'scripts', 'styles', 'copyIndex'], cb)
});


