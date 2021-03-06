var fs = require('fs'),
    File = require('./file'),
    path = require('path');

var helpers = new function() {

  this.walk = function(dir, aditionalOptions, done) {
    var results = {
      dirs: [],
      files: []
    };
    
    var options = {
      ignoreDotFiles: true,
      ignoreTestsFiles: true,
      ignoreTmpsFiles: true
    };
    
    if (done === undefined) {
      done = aditionalOptions;
      aditionalOptions = undefined;
    }
    
    // Merge aditional options with options
    if (aditionalOptions) {
      for(var key in aditionalOptions) {
        options[key] = aditionalOptions[key];
      }
    }
    
    fs.readdir(dir, function(err, list) {
      var cleanList = [], exclude;
      
      if (err) return done(err);
      
      // remove unneeded files
      list.forEach(function(file) {
        exclude = false;        
        
        if (options.ignoreDotFiles && file.match(/(.git|.sass|.bpm|.DS_Store)/)) exclude = true;
        if (options.ignoreTestsFiles && file.match(/test/)) exclude = true;
        if (options.ignoreTmpsFiles && file.match(/(tmp|tmps|Gemfile|VERSION|README|Rake)/)) exclude = true;
        if (file.match(/\.md$/)) exclude = true;
        
        if (!exclude) cleanList.push(file);
      });
      
      var pending = cleanList.length;
      
      if (pending === 0) return done(null, results);
      
      cleanList.forEach(function(file) {
        file = dir + '/' + file;
        fs.lstat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            results.dirs.push(new File({
              path: file,
              package: options.package,
              isDirectory: true
            }));
            
            helpers.walk(file, options, function(err, res) {
              results.dirs = results.dirs.concat(res.dirs);
              results.files = results.files.concat(res.files);
              
              if (--pending === 0) done(null, results);
            });
          } else {
            results.files.push(new File({
              path: file,
              package: options.package
            }));
            
            if (--pending === 0) done(null, results);
          }
        });
      });
    });
    
  };

}();

module.exports = helpers;