
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("upfile/index.js", function(exports, require, module){
var win = window,
    doc = win.document,
    bind = (win.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
    CHANGE = (bind !== 'addEventListener') ? 'onchange' : 'change';

/**
 * Create a new instance of Upfile.
 * @constructor
 * @param {HTMLElement} el A given HTML element to create an instance of Upfile.
 * @returns {upfile} Returns a new instance of Upfile.
 */
function Upfile(el) {

    if (el === undefined) {
        throw new Error('"Upfile(el)": It must receive an element.');
    }

    this._initialize(el);
}

Upfile.prototype._initialize = function (el) {
    var that = this;

    this.el = el;
    this.container = this.el.parentNode;
    this.labelNode = this.container.children[0];
    that.labelNode.style.lineHeight = this.container.clientHeight + 'px';

    this._renderList();

    this.el[bind](CHANGE, function () {
        that._updateList(this.files);

        var obj = that.listNode.getBoundingClientRect(),
            listHeight = obj.bottom - obj.top,
            labelHeight = (listHeight > win.parseInt(that.labelNode.style.lineHeight, 10) ? listHeight : that.container.clientHeight);

        that.labelNode.style.height = that.labelNode.style.lineHeight = labelHeight + 'px';
    });

    this.el.upfile = this;

    return this;
};

Upfile.prototype._updateList = function (files) {
    var len = files.length,
        i = 0;

    this.listNode.innerHTML = '';

    if (len !== 0) {

        if (this.labelNode.className.search(/\s?upfile-label-hidden/) === -1) {
            this.labelNode.className += ' upfile-label-hidden';
            this.listNode.className = this.listNode.className.replace(/\s?upfile-hide/, '');
        }

        for (i; i < len; i += 1) {
            this.listNode.appendChild(this._renderFile(files[i].name));
        }

    } else {
        this.listNode.className += ' upfile-hide';
        this.labelNode.className = this.labelNode.className.replace(/\s?upfile-label-hidden/, '');
    }

    return this;
};

Upfile.prototype._renderList = function () {
    this.listNode = doc.createElement('ol');
    this.listNode.className = 'upfile-list upfile-hide';

    this.container.appendChild(this.listNode);

    return this;
};

Upfile.prototype._renderFile = function (name) {
    var li = doc.createElement('li');
    li.innerHTML = name;

    return li;
};

/**
 * Enables an instance of Upfile.
 * @memberof! Upfile.prototype
 * @function
 * @returns {upfile} Returns the instance of Upfile.
 */
Upfile.prototype.enable = function () {
    this.el.removeAttribute('disabled');

    return this;
};

/**
 * Disables an instance of Upfile.
 * @memberof! Upfile.prototype
 * @function
 * @returns {upfile} Returns the instance of Upfile.
 */
Upfile.prototype.disable = function () {
    this.el.setAttribute('disabled', 'disabled');

    return this;
};

// Expose Upfile
exports = module.exports = Upfile;
});
require.alias("upfile/index.js", "upfile/index.js");

