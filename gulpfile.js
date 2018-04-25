var config = require('./gulp.config.json');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less');
var replace = require('gulp-replace');
var path = require('path');

var runSequence = require('run-sequence');
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

gulp.task('scripts', function(){
    return gulp.src(config.vendor.scripts_min)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/static/js'))
});

gulp.task('appScripts', ['scripts'], function(){
    return gulp.src([
        'vendor/requirejs/require.js',
        'js/**/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js'))
});

gulp.task('copyIndex', ['copyPages', 'copyFragments', 'fonts', 'img'], function(){
    return gulp.src([
        'index.html',
    ])
    .pipe(gulp.dest('dist/templates/'))
});

gulp.task('img', function(){
    return gulp.src([
        'img/*',
    ])
    .pipe(gulp.dest('dist/static/img'))
});

gulp.task('copyPages', function(){
    return gulp.src([
        './pages/**/*.html',
    ])
    .pipe(gulp.dest('dist/templates/pages'))
});

gulp.task('copyFragments', function(){
    return gulp.src([
        './fragments/*',
    ])
    .pipe(gulp.dest('dist/templates/fragments'))
});

gulp.task('fonts', function(){
    return gulp.src([
        'vendor/font-awesome/fonts/*',
    ])
    .pipe(gulp.dest('dist/static/fonts'))
});

// Stylesheets Task

gulp.task('styles', function(){
    return gulp.src(config.vendor.styles)
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/static/css'))
});


gulp.task('appStyles', function(){
    return gulp.src('./css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/static/css'))
});
gulp.task('lessCompileApp', ['styles', 'appStyles'], function () {
    return gulp.src(['./less/style.less'])
    .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./dist/static/css'));
});

/** 
 * Foi realizado um override do tema padrão do bootstrap, 
 * sendo assim e preciso recompilar o less dele
 * 
 */
gulp.task('cleanBootstrapStyle', function(){
    return gulp.src('./vendor/bootstrap/dist/css/bootstrap-custom.min.css')
    .pipe(clean());
});
 
gulp.task('replace', function(){
  gulp.src('vendor/bootstrap/less/bootstrap.less')
    .pipe(replace('@import "variables.less";', '@import "../../less/variables.less";'))
    .pipe(concat('bootstrap.less'))
    .pipe(clean())
    .pipe(gulp.dest('vendor/bootstrap/less/'));
});

gulp.task('recompileBootstrap', ['cleanBootstrapStyle', 'replace'], function(){
    return gulp.src('./vendor/bootstrap/less/bootstrap.less')
    .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(cleanCSS())
    .pipe(concat('bootstrap-custom.min.css'))
    .pipe(gulp.dest('./vendor/bootstrap/dist/css'));
});


gulp.task('serve', ['default'], function(){
    
    browserSync.init({
        server:'./dist/',
        startPath: '/templates/'
    });

    gulp.watch(['./*.html', './fragments/*.html', './pages/**/*.html', './js/**/*.js', './less/*.less'], function(e){
        if(e.path.indexOf(".js") != -1){
            return gulp.run(["jshint","appScripts"]);
        }else if(e.path.indexOf(".less") != -1){
            return gulp.run("lessCompileApp");
        }else if(e.path.indexOf(".html") != -1){
            return gulp.run("copyIndex");
        }else{
            return gulp.run("default");
        }
    }).on('change', browserSync.reload);
});

gulp.task('default', function(cb){
    return runSequence('clean', ['jshint', 'appScripts', 'lessCompileApp', 'copyIndex'], cb)
});


