function doConfig() {

    var config = {
        app: 'app',
        build: 'build',
        dist: 'dist',
        index: 'index.html',
        fonts: [
            './bower_components/bootstrap-sass/assets/fonts/**/*',
            './bower_components/font-awesome/fonts/**/*'
        ],
        images: [
            'app/content/images/*.*'
        ],
        styles: [
            'app/content/styles/_inc.scss',
            'app/content/styles/_variables.scss',
            'app/content/styles/_mixins.scss',
            'app/content/styles/core.scss',
            './bower_components/nvd3/build/nv.d3.css',
            'app/*/*.scss'
        ],
        scripts: {
            vendor: [
                './bower_components/jquery/dist/jquery.min.js',
                './bower_components/moment/min/moment.min.js',
                './bower_components/lodash/dist/lodash.min.js',
                './bower_components/noty/js/noty/packaged/jquery.noty.packaged.min.js',
                './bower_components/angular/angular.min.js',
                './bower_components/angular-animate/angular-animate.min.js',
                './bower_components/angular-sanitize/angular-sanitize.min.js',
                './bower_components/angular-ui-router/release/angular-ui-router.min.js',
                './bower_components/angular-breadcrumb/release/angular-breadcrumb.min.js',
                './bower_components/angularjs-slider/dist/rzslider.min.js',
                './bower_components/angular-translate/angular-translate.min.js',
                './bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
				'./bower_components/jQRangeSlider/jQAllRangeSliders-min.js',
				'./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'./bower_components/d3/d3.min.js',
				'./bower_components/angular-nvd3/dist/angular-nvd3.min.js',
				'./bower_components/nvd3/build/nv.d3.js',
				'customer/interact.min.js'
            ],
            app: [
                'app/**/*module*js',
                'app/*/**/*.js',
                'app/*.js'
            ]
        },
        html: [
            'app/*/*html'
        ],
        lang: [
            'app/lang/**/locale_en-US.json'
        ]
    };
    return config;
}

module.exports = doConfig;
