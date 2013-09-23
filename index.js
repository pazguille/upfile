var win = window,
    doc = win.document,
    bind = (window.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
    CHANGE = (bind !== 'addEventListener') ? 'onchange' : 'change';

/**
 * Create a new instance of Upfile.
 * @constructor
 * @param {HTMLElement} el A given HTML element to create an instance of Flipload.
 * @param {Object} [options] Options to customize an instance.
 * @param {String} [options.className] Add a custom className to the reverse element to add custom CSS styles.
 * @returns {upfile} Returns a new instance of Upfile.
 */
function Upfile(el, options) {

    if (el === undefined) {
        throw new Error('"Upfile(el, [options])": It must receive an element.');
    }

    this.initialize(el, options);
}

Upfile.prototype.initialize = function(el, options) {
    var that = this;

    this.el = el;
    this.container = this.el.parentNode;
    this.labelNode = this.container.children[0];
    this._renderList();

    this.files = [];

    this._enabled = true;

    this.el[bind](CHANGE, function () {
        that._addFiles(this.files);
    });

    this.el.upfile = this;

    return this;
};

Upfile.prototype._addFiles = function (files) {
    var len = files.length,
        i = 0;

    this.labelNode.className = 'upfile-hide';
    this.listNode.className = this.listNode.className.replace(/upfile-hide/, '');

    for (i; i < len; i += 1) {
        this.listNode.appendChild(this._renderFile(files[i].name));
    }
}

Upfile.prototype._renderList = function() {
    this.listNode = doc.createElement('ol');
    this.listNode.className = 'upfile-list upfile-hide';

    this.container.appendChild(this.listNode);

    return this;
};

Upfile.prototype._renderFile = function (name) {
    var li = doc.createElement('li');
    li.innerHTML = name;

    return li;
}

// Expose Upfile
exports = module.exports = Upfile;