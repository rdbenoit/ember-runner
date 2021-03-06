var async = require('async'),
    less = require('less'),
    stylus = require('stylus'),
    nib = require('nib');

var handlersManager = new function() {
  this.handlers = {};
  
  this.add = function(name, handler) {
    this.handlers[name] = handler;
  };
  
  this.retrieveHandlers = function(selectedHandlers) {
    var handlers = [],
        handler, i;

    for(i = 0; i < selectedHandlers.length; i++ ) {
      handler = selectedHandlers[i];
      handlers.push(this.handlers[handler]);
    }
    
    return handlers;
  };
  
  this.run = function(starter, selectedHandlers, callback) {
    var handlers = [starter].concat(this.retrieveHandlers(selectedHandlers));    
    async.waterfall(handlers, callback);
  };
  
}();

module.exports = handlersManager;

// ============
// = HANDLERS =
// ============

handlersManager.add("removeRequires", function(context, callback) {
  var regexp = new RegExp("require\\([\"']([a-zA-Z_\\-\\/]*)[\"']\\)\\;", "g"),
      matches = [], match, buffer;
  
  buffer = context.buffer;
  
  while(match = regexp.exec(buffer)) {
    matches.push(match[0]);    
  }
  
  matches.forEach(function(match) {
    buffer = buffer.replace(match, '');
  });
  
  context.buffer = buffer;
  
  callback(null, context);
});

handlersManager.add("encloseExportFunction", function(context, callback) {
  context.buffer = "(function(exports) {" + context.buffer + "\n})({});";  
  callback(null, context);
});

handlersManager.add("includeTemplate", function(context, callback) {
  context.buffer = context.buffer.replace(/\r?\n|\r/g, '');
  context.buffer = "\nEmber.TEMPLATES['" + context.file.name + "'] = Ember.Handlebars.compile('" + context.buffer + "');\n";  
  callback(null, context);
});

// =======================
// = STYLESHEET HANDLERS =
// =======================

// This handlers is only to allow process, but do nothing.
handlersManager.add("css", function(context, callback) {
  callback(null, context);
});

handlersManager.add("less", function(context, callback) {
  less.render(context.buffer, function(err, css) {
    context.buffer = css;
    callback(null, context);
  });
});

// [TODO] Will be implemented
handlersManager.add("scss", function(context, callback) {
  context.buffer = "\n/* [SORRY] " + context.file.name + context.file.extname + " not generated, scss is not currently supported. */\n";
  callback(null, context);
});

// ==========
// = Stylus =
// ==========

handlersManager.add("styl", function(context, callback) {  
  stylus(context.buffer).use(nib()).render(function(err, css) {
    if (err) {
      context.buffer = "\\/* [LESS: ERROR] " + context.file.name + context.file.extname + " not generated, cause: \n" + err + "*\\/";
      console.log(context.buffer);
    } else {
      context.buffer = css;
    }
      
    callback(null, context);
  });
});