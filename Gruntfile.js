module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dev: ['generated'],
      dist: ['dist']
    },
   
    concat: {
      options: {
	separator: ';'
      },
      dev: {
	src: ['vendor/angular.min.js', 'vendor/**/*.js', 'app/scripts/**/*.js'],
	dest: 'generated/js/app.js'
      }
    },

    copy: {
      devInit: {
	files: [
	  {expand: true, cwd: 'app/pages', src: ['**'], dest: 'generated/'},
	  {expand: true, cwd: '/node_modules', src: ['bootstrap/dist/fonts/*', 'font-awesome/fonts/*'], dest: 'generated/fonts'},
	  {expand: true, cwd: 'app/images', src: ['**'],  dest: 'generated/images'} 
	]
      },
      devHtml: {
	files: [
	  {expand: true, cwd: 'app/pages', src: ['**'], dest: 'generated/'}
	]
      }
    },

    karma: {
      unit: {
	options: {
	  basePath: './',
	  files: [
	    'spec/**/*.js',
	    'app/scripts/**/*.js',
	    'vendor/**/*.js',
	    'generated/js/app.js'
	  ],
	  frameworks: ['jasmine'],
	  preprocessors: {},
	  reporters: ['progress', 'html'],
	  port: 9876,
	  colors: true,
	  autoWatch: true,
	  browsers: ['PhantomJS'],
	  captureTimeout: 20000,
	  singleRun: false,
	  reportSlowerThan: 500,
	  plugins: [
	    'karma-jasmine',
	    'karma-phantomjs-launcher',
	    'karma-html-reporter'
	  ],
	  htmlReporter: {
	    outputDir: 'generated/reports',
	  }
	},
	autoWatch: true
      }
    },


    less: {
      dev: {
	files: {
	  "generated/css/app.css" : "app/styles/styles.less"
	}
      }
    },


    ngtemplates: {
      app: {
	cwd: 'app',
	src: 'templates/**/*.html',
	dest: 'app/scripts/templates.js'
      }
    },

    watch: {
      options : {
	livereload: true
      },
      less: {
	files: ['app/styles/*.less'],
	tasks: ['less:dev']
      },
      html: {
	files: ['app/pages/*.html'],
	tasks: ['copy:devHtml']
      },
      js: {
	files: ['app/scripts/**/*.js'],
	tasks: ['concat:dev']
      },
      templates: {
	files: ['app/templates/*.html'],
	tasks: ['ngtemplates']
      }
    }
  });


  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.registerTask('connect', 'Start a custom static web server.', function() {
    var connect = require('connect');
    grunt.log.writeln('Starting static web server in "generated" on port 8000.');
    connect(connect.static('generated')).listen(8000);
  });


  grunt.registerTask('bugz', 'bugz', function() {
    grunt.log.writeln('test');
  });


  grunt.registerTask('archetype', 'Create directory structure & config files', function() {
    grunt.file.write('.gitignore', 
		     '.DS_Store\n'
		     + '/node_modules\n'
		     + '/bower_modules\n'
		     + '/generated\n'
		     + '/vendor\n');

    grunt.file.write('app/styles/styles.less', 
		     '@import "base.less";\n'
		    +'@import "layout.less";\n'
		    +'@import "module.less";\n'
		    +'@import "state.less";\n'
		    +'@import "theme.less";\n');

    grunt.file.write('app/styles/base.less',
		     '@import "../../bower_components/bootstrap/less/bootstrap.less";\n'
		    +'@import "../../bower_components/font-awesome/less/font-awesome.less";\n'
		    +'.nav, .pagination, .carousel, .panel-title a { cursor: pointer; }\n');

    grunt.file.write('app/styles/layout.less', '');
    grunt.file.write('app/styles/module.less', '');
    grunt.file.write('app/styles/state.less', '');
    grunt.file.write('app/styles/theme.less', '');
    grunt.file.write('app/scripts/app.js', '');
    grunt.file.write('app/images/.gitkeep', '');
    grunt.file.write('app/static/.gitkeep', '');
    grunt.file.write('app/pages/index.html', '');
    grunt.file.write('app/templates/.gitkeep', '');
    grunt.file.write('config/.gitkeep', '');
    grunt.file.write('tasks/.gitkeep', '');
    grunt.file.write('dist/.gitkeep', '');
    grunt.file.write('generated/.gitkeep', '');
    grunt.file.write('spec/helpers/.gitkeep', '');
    grunt.file.write('vendor/.gitkeep', '');
  });

  grunt.registerTask('scaffold',['archetype']);
  grunt.registerTask('new', ['archetype']);
  grunt.registerTask('run', ['clean:dev',  'copy:devInit', 'ngtemplates', 'less:dev', 'concat:dev', 'connect', 'watch']);
  grunt.registerTask('spec', ['karma']);
  grunt.registerTask('build', []);
}
