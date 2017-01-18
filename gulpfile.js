var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var gutil = require("gulp-util");
var paths = require('./gulp.config.js')();
var del = require('del');
var devConnect = plug.connectMulti();
var relConnect = plug.connectMulti();
var pkg = require('./package.json');
var plato = require('plato');
var webpack = require("webpack");
var stream = require("webpack-stream");
var webpackDevConfig = require("./webpack.dev.config.js");
var webpackDebugConfig = require("./webpack.debug.config.js");
var webpackReleaseConfig = require("./webpack.release.config.js");
var sourcemaps = require('gulp-sourcemaps');
var path = require("path");

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version: v<%= pkg.version %>',
    ' * @license: <%= pkg.license %>',
    ' */',
    ''].join('\n');

var args = require("yargs")
    .command("gulp", "--help")
    .command("gulp", "build")
    .command("gulp", "serve")
    .command("gulp", "serve:build")
    .command("gulp", "serve:dist")
    .option("d", {
        alias: "debug",
        demand: false,
        describe: "debug build",
        type: "boolean"
    })
    .option("r", {
        alias: "release",
        demand: false,
        describe: "release build",
        type: "boolean"
    })
    .help("?")
    .alias("?", "help")
    .example("gulp serve", " runs the app in dev mode with watch enabled.")
    .example("gulp serve:build", " runs a web server on /build")
    .example("gulp serve:dist", " runs a web server on /dist")
    .example("gulp build --debug", " builds the debug source inside build folder.")
    .example("gulp build --release", " builds the release source inside dist folder.")
    .epilog("Copyright 2016 TCS, Kochi")
    .argv;

var build = (args.r) ? 'release' : (args.d) ? 'debug' : 'dev';

gutil.log("Starting execution in [", gutil.colors.green(build), "] mode");

/**
 * Clean the build folder
 */
gulp.task('clean:build', function () {
    del([paths.build + '/**/*'], function (err, deletedFiles) {});
});

/**
 * Clean the dist folder
 */
gulp.task('clean:dist', function () {
    del([paths.dist + '/**/*'], function (err, deletedFiles) {});
});

/**
 * Concat all the scss files
 */
gulp.task('scss:concat', function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    return gulp.src(paths.styles)
        .pipe(plug.concat('app.scss'))
        .pipe(gulp.dest(destinationFolder + '/styles'));
});

/**
 * Convert scss to css
 * @dependencies - scss:concat
 */
gulp.task('scss:convert', ['scss:concat'], function () {
    var fileName = (build === 'release') ? 'style.min.css' : 'style.css';
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    return plug.rubySass(destinationFolder + '/styles/app.scss', {
            compass: true,
            style: (build === 'release') ? 'compressed' : 'expanded'
        }).pipe(plug.rename(fileName))
        .pipe(plug.if((build === 'release'), plug.header(banner, {
            pkg: pkg
        })))
        .pipe(gulp.dest(destinationFolder + '/styles'));
});

/**
 * Completed styles processing (also del the concat result styles.scss)
 * @dependencies - scss:convert
 */
gulp.task('scss', ['scss:convert'], function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    del(destinationFolder + '/styles/app.scss');
});

/**
 * Copy fonts to build or dist
 */
gulp.task('fonts', ['scss'], function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(destinationFolder + '/fonts'));
});

/**
 * Copy images to build or dist
 */
gulp.task('images', ['fonts'], function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    return gulp.src(paths.images)
        .pipe(gulp.dest(destinationFolder + '/images'));
});

/**
 * Copy lang json files to build or dist
 */
gulp.task('lang', ['images'], function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    if (build === 'debug') {
        return gulp.src(paths.lang)
            .pipe(gulp.dest(destinationFolder + '/lang'));
    } else {
        return gulp.src(paths.lang)
            .pipe(plug.jsonminify())
            .pipe(gulp.dest(destinationFolder + '/lang'));
    }
});

/**
 * Copy index.html to build or dist
 */
gulp.task('copy:index', ['lang'], function () {
    var destinationFolder = (build === 'release') ? paths.dist : paths.build;
    if ((build === 'release')) {
        return gulp.src(paths.app + '/' + paths.index)
            .pipe(plug.htmlReplace({
                'css': '/styles/style.min.css',
                'vendorJs': '/scripts/vendor.min.js',
                'appJs': '/scripts/app.min.js'
            }))
            .pipe(plug.minifyHtml({
                empty: true,
                quotes: true
            }))
            .pipe(gulp.dest(destinationFolder));
    } else {
        return gulp.src(paths.app + '/' + paths.index)
            .pipe(plug.htmlReplace({
                'css': '/styles/style.css',
                'vendorJs': '/scripts/vendor.js',
                'appJs': '/scripts/app.js'
            }))
            .pipe(gulp.dest(destinationFolder));
    }

});

/**
 * Webpack Bundling for Release, Debug and DEV configurations
 */
gulp.task('webpack', ['copy:index'], function () {
    if ((build === 'release')) {
        return gulp.src(webpackReleaseConfig.entry.app[0])
            .pipe(stream(webpackReleaseConfig), webpack, function () {})
            .pipe(plug.header(banner, {
                pkg: pkg
            }))
            .pipe(gulp.dest(webpackReleaseConfig.output.path));
    } else if ((build === 'debug')) {
        return gulp.src(webpackDebugConfig.entry.app[0])
            .pipe(sourcemaps.init())
            .pipe(stream(webpackDebugConfig), webpack, function () {})
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(webpackDebugConfig.output.path));
    } else {
        return gulp.src(webpackDevConfig.entry.app[0])
            .pipe(stream(webpackDevConfig), webpack, function () {})
            .pipe(gulp.dest(webpackDevConfig.output.path));
    }
});

/**
 * Watch scss/index files for changes and rebuild the files with dependencies
 * index watch will also copy fonts, images, lang
 */
gulp.task('watch:app', function () {
    gulp.watch(paths.styles, ['scss']);
    gulp.watch(paths.app + '/' + paths.index, ['copy:index']);
    return;
});

/**
 * Build the application for production : debug or release
 */
if (build === "dev") {
    gutil.log(gutil.colors.red('gulp build only works with debug or release flag'));
} else if (build === "debug") {
    gulp.task('build', ['clean:build', 'webpack']);
} else if (build === "release") {
    gulp.task('build', ['clean:dist', 'webpack']);
}

/**
 * Create local server for development
 */
gulp.task('serve', ['clean:build', 'watch:app', 'webpack']);

/**
 * Create local server for development
 */
gulp.task('run', devConnect.server({
    root: [paths.build],
    port: 8085,
    livereload: false,
    open: {
        file: 'index.html',
        browser: 'chrome'
    }
}));

/**
 * Create local server for testing debug build
 */
gulp.task('serve:build', devConnect.server({
    root: [paths.build],
    port: 8080,
    livereload: false,
    open: {
        file: 'index.html',
        browser: 'chrome'
    }
}));

/**
 * Create local server for testing release build
 */
gulp.task('serve:dist', relConnect.server({
    root: [paths.dist],
    port: 9090,
    livereload: false,
    open: {
        file: 'index.html',
        browser: 'chrome'
    }
}));
