
// From module strip-yaml-header
var pattern = pattern = '^(' +
      '((= yaml =)|(---))' +
      '$([\\s\\S]*?)' +
      '\\2' +
      '$' +
      (process.platform === 'win32' ? '\\r?' : '') +
      '(?:\\n)?)';
var yamlRegexp = new RegExp(pattern, 'm');
function replaceByBr(text) {
  return text.replace(yamlRegexp, function (all) {
    var lines = all.split("\n");
    return (new Array(lines.length)).join("");
  });

}
function normalize(markdown) {
  if (yamlRegexp.test(markdown)) {
    return replaceByBr(markdown);
  }
  return markdown;
}

module.exports = function(grunt) {

  var i = 0;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        process: function(src, filepath) {
          i++;
          if (i == 1) { return src;}
          return normalize(src);
        }
      },
      dist: {
        src: ['docs/intro.md',
              'docs/features/quick-start.md',
              'docs/features/*'],
        dest: 'docs/full.md'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};
