(function (window) {
    'use strict';

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
        this._renderList();

        this.el[bind](CHANGE, function () {
            that._updateList(this.files);
        });

        this.el.upfile = this;

        return this;
    };

    Upfile.prototype._updateList = function (files) {
        var len = files.length,
            i = 0;

        this.listNode.innerHTML = '';

        if (len !== 0) {
            this.labelNode.className += ' upfile-hide';
            this.listNode.className = this.listNode.className.replace(/\s?upfile-hide\s?/, '');

            for (i; i < len; i += 1) {
                this.listNode.appendChild(this._renderFile(files[i].name));
            }

        } else {
            this.listNode.className += ' upfile-hide';
            this.labelNode.className = this.labelNode.className.replace(/\s?upfile-hide\s?/, '');
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

    /**
     * Expose Viewport
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('Upfile', [], function () {
            return Upfile;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = Upfile;

    // Default
    } else {
        window.Upfile = Upfile;
    }

}(this));