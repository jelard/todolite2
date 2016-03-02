/**
 * Created by jmacalino on 3/1/2016.
 */
var gulp = require("gulp");
var del = require("del");
var args = require("yargs").argv;
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

var buildPath = "./";
var tempPath = "./temp";
var indexHtmlPath = "./app/Index.html";
var codeFiles = ["./app/*.js","./app/**/*.js"];


var $ = require("gulp-load-plugins")({lazy:true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(codeFiles)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest("./"));
});

gulp.task("fonts", ["clean-fonts"], function() {
    log("Copying fonts");

    return gulp
        .src("./bower_components/font-awesome/fonts/**/*.*")
        .pipe(gulp.dest(buildPath + "/fonts"));
});

gulp.task("clean-fonts", function() {
   return clean( buildPath + "/fonts/**/*.*");
});

gulp.task('clean-styles', function() {
  return  clean("./styles/**/*.css" );
});

gulp.task('clean', function() {
    var files = [].concat(
        './Index.html',
         './js/**/*.js',
        './styles/**/*.css'
    );
    return clean(files);
});

gulp.task('templatecache', ['clean'], function() {
    log('Creating AngularJS $templateCache');

    var options = {
        module: 'app',
            standAlone: false,
            root: '/'
    }

    return gulp
        .src(["./app/**/*.html", "!./app/Index.html"])
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
           "templates.js",
           options
        ))
        .pipe(gulp.dest(tempPath));
});

gulp.task('optimize', ['inject'], function() {
    log('Optimizing the javascript, css, html');

    var assets = $.useref({searchPath: ['./app', './']});
    var templateCache = tempPath + "/templates.js";
    var jsLibFilter = $.filter("**/lib.js",{restore:true});
    var jsAppFilter = $.filter("**/app.js",{restore:true});
    var cssFilter = $.filter("**/*.css",{restore:true});

    return gulp
        .src(indexHtmlPath)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        .pipe($.if('*.css', $.rev())) // just grab css
        .pipe($.if('*.js', $.rev())) // just grab js
        .pipe($.revReplace())
        .pipe(gulp.dest("./"))
        .pipe($.rev.manifest())
        .pipe(gulp.dest("./"));
});

gulp.task("serve", function(){
   log("Serving up the Index Html for Dev...");
    var options = {
        files: ["./app/Index.html","./app/*.js", "./app/**/*.js", "./app/css/*.css"],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        server:{
            baseDir:["./", "./app"],
            index:"./app/Index.html"
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'todo-lite2',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync.init(options);

});

gulp.task('inject', ['wiredep',  'templatecache'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(indexHtmlPath)
        .pipe($.inject(gulp.src("./app/styles/**/*.css")))
        .pipe(gulp.dest("./app"));
});

gulp.task("wiredep", function(){
   log("Injecting bower and custom js into html...");

   var options = {
       bowerJson: require("./bower.json"),
       directory:"./bower_components/",
       ignorePath:"../.."
   };

    var wiredep = require("wiredep").stream;

    return gulp.src("./app/Index.html")
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(["./app/*.js","./app/**/*.js"])))
        .pipe(gulp.dest("./app"))

});


////////////


function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

