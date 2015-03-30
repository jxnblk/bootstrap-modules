
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var sass = require('node-sass');
var validate = require('css-validator');

var dirname = path.join(__dirname, '../modules/');
var variablesDir = path.join(__dirname, '../modules/variables');
var mixinsDir = path.join(__dirname, '../modules/mixins');
var mods = fs.readdirSync(dirname);

mods = mods.filter(function(mod) {
  return mod !== 'undefined' && !mod.match(/^\./);
});


mods = mods.map(function(mod) {
  if (mod.match(/\./)) { return false }
  var contents = '@import "../variables/variables";\n@import "../mixins/mixins";\n\n';
  if (mod === 'navbar') {
    contents += '@import "../forms/forms";\n';
  }
  contents += fs.readFileSync(dirname + mod + '/_' + mod + '.scss', 'utf8');
  return {
    path: mod,
    source: dirname + mod,
    contents: contents
  }
});

mods = mods.filter(function(mod, i) {
  return mod !== false && typeof mod.path !== 'undefined';
});


var compiled = [];


mods.forEach(function(mod) {
  try {
    var css = sass.renderSync({
      data: mod.contents,
      includePaths: [dirname, mod.source, variablesDir, mixinsDir]
    }).css;
    compiled.push({ name: mod.path, css: css });
  } catch(e) {
    console.log('Error parsing ' + mod.path);
  }
});


describe('bootstrap-modules', function() {

  it('should compile to a string', function(done) {
    compiled.forEach(function(mod) {
      assert.equal(typeof mod.css, 'string');
    });
    done();
  });

  it('should create valid css', function(done) {
    compiled.forEach(function(mod) {
      validate({ text: mod.css }, function(err, data) {
        if (err) throw err;
        assert.equal(data.validity, true);
      });
    });
    done();
  });

});
