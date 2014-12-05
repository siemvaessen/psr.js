module.exports = function(grunt) {

  // Build coffee files into js
  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          'build/psr.js': [
            'src/psr.coffee',
            'src/figure.coffee',
            'src/persons_of_concern.coffee',
            'src/demographics.coffee',
            'src/timeseries.coffee'
          ] // compile and concat into single file
        }
      },
    },
    watch: {
      scripts: {
        files: ['src/*.coffee'],
        tasks: ['coffee'],
        options: {
          spawn: false,
        },
      },
    }
  });

  // Load the plugin that provides the "coffee", "watch" task.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['coffee']);

};
