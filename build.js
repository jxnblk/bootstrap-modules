
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var dir = './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/';
var mixinsDir = './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/mixins/';
var partials = fs.readdirSync(dir);

var pkgBase = require('./bower_components/bootstrap-sass/package.json');

  // Temporarily delete github info
  delete pkgBase.repository;
  delete pkgBase.bugs;


partials = partials.filter(function(partial) {
  return partial !== 'undefined' && partial.match(/\.scss$/);
});

var mods = partials.map(function(filename) {
  console.log(filename);
  var name = filename.replace(/^\_/,'');
  name = name.replace(/\.scss$/,'');
  var pkg = _.cloneDeep(pkgBase);
  pkg.name = 'bootstrap-' + name;
  pkg.description = 'Bootstrap ' + name + ' modularized with boostrap-modules';
  pkg.main = filename;
  return {
    filename: filename,
    name: name,
    contents: fs.readFileSync(path.join(__dirname, dir + filename), 'utf8'),
    pkg: pkg
  }
});

mods.forEach(function(mod) {
  if (!fs.existsSync(path.join(__dirname, './modules/' + mod.name))) {
    fs.mkdirSync(path.join(__dirname, './modules/' + mod.name));
  }
  fs.writeFileSync(path.join(__dirname, './modules/' + mod.name + '/' + mod.filename), mod.contents); 
  fs.writeFileSync(path.join(__dirname, './modules/' + mod.name + '/' + 'package.json'), JSON.stringify(mod.pkg, null, 2)); 
});

// Mixins
var mixinsFilenames = fs.readdirSync(mixinsDir); 

var mixins = mixinsFilenames.map(function(filename) {
  var name = filename.replace(/^\_|\.scss$/, '');
  var filepath = path.join(__dirname, mixinsDir + filename);
  return {
    filename: filename,
    name: name,
    contents: fs.readFileSync(filepath, 'utf8'),
  }
});

mixins.forEach(function(mixin) {
  var dirname = path.join(__dirname, './modules/mixins/mixins/');
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  fs.writeFileSync(dirname + mixin.filename, mixin.contents);
});

