// Create folders and package.json files for each partial in bootstrap-sass

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var sass = require('node-sass');
var colors = require('colors');

var dir = './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/';
var mixinsDir = './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/mixins/';
var partials = fs.readdirSync(dir);
var mods;

var pkgBase = require('./bower_components/bootstrap-sass/package.json');
pkgBase.dependencies = {
  'bootstrap-mixins': '^' + pkgBase.version,
  'bootstrap-variables': '^' + pkgBase.version,
};

  // Temporarily delete github info
  delete pkgBase.repository;
  delete pkgBase.bugs;


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
  if (!fs.existsSync(path.join(__dirname, './modules/mixins/'))) {
    fs.mkdirSync(path.join(__dirname, './modules/mixins'));
  }
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  fs.writeFileSync(dirname + mixin.filename, mixin.contents);
});


// Partials
partials = partials.filter(function(partial) {
  return partial !== 'undefined' && partial.match(/\.scss$/);
});

mods = partials.map(function(filename) {

  // Create name from partial filename
  var name = filename.replace(/^\_|\.scss$/g,'');
  var filepath = path.join(__dirname, dir + filename);
  var pkg = _.cloneDeep(pkgBase);
  var contents = '';
  var css = '';

  // Format package.json
  pkg.name = 'bootstrap-' + name;
  pkg.description = 'Bootstrap ' + name + ' modularized with boostrap-modules';
  pkg.main = filename;
  pkg.style = name + '.css';
  if (name === 'navbar') {
    pkg.dependencies['bootstrap-forms'] = '^' + pkg.version;
  }

  contents = fs.readFileSync(filepath, 'utf8');
  var data = [
    '@import "variables";',
    '@import "mixins";',
    // bootstrap-sass has a mixin in forms that navbar uses
    name === 'navbar' ? '@import "forms";' : '',
    contents,
  ].join('\n');
  try {
    css = sass.renderSync({
      data: data,
      includePaths: [ dir, mixinsDir ]
    }).css;
  } catch(e) {
    console.log('Could not compile ' + filename);
  }

  return {
    filename: filename,
    name: name,
    contents: contents,
    css: css,
    pkg: pkg
  }

});

mods.forEach(function(mod) {
  if (!fs.existsSync(path.join(__dirname, './modules/' + mod.name))) {
    fs.mkdirSync(path.join(__dirname, './modules/' + mod.name));
  }
  // Write scss
  fs.writeFileSync(path.join(__dirname, './modules/' + mod.name + '/' + mod.filename), mod.contents); 
  // Write css
  if (mod.css.length > 0) {
    fs.writeFileSync(path.join(__dirname, './modules/' + mod.name + '/' + mod.name + '.css' ), mod.css); 
  }
  // Write package.json
  fs.writeFileSync(path.join(__dirname, './modules/' + mod.name + '/' + 'package.json'), JSON.stringify(mod.pkg, null, 2)); 
});

