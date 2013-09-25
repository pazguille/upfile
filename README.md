# Upfile JS

Makes file inputs a pleasure to use with progressive enhancement.

## Installation

    $ component install pazguille/upfile

See: [https://github.com/component/component](https://github.com/component/component)

### Standalone
Also, you can use the standalone version:
```html
<script src="upfile.js"></script>
```

## How-to

First, you should add the CSS file to your markup:
```html
<link rel="stylesheet" href="upfile.css">
```

You should use the following HTML code on your files inputs:
```html
<div class="upfile">
    <label class="upfile-label">Select files...</label>
    <input id="demoInputFile" type="file" name="files[]" class="upfile-button" multiple>
</div>
```

Then, you can start to use it and enjoy!
```js
var Upfile = require('upfile');
    inputFile = document.getElementById('demoInputFile'),
    fileUploader = new Upfile(inputFile);
```
[View demo page](http://pazguille.github.io/upfile/)

## API

### Upfile(el, [options])
Create a new instance of `Upfile`.
- `el`: A given `HTMLElement` file input to create an instance of `Upfile`.
- `options`: An optional options `Object` to customize an instance.

```js
var upfile = new Upfile(el, [options]);
```

### Upfile#enable()
Enables an instance of `Upfile`.

```js
upfile.enable();
```

### Upfile#disable()
Disables an instance of `Upfile`.

```js
upfile.disable();
```

## Contact
- Guillermo Paz (Frontend developer - JavaScript developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)


## License
Copyright (c) 2013 [@pazguille](http://twitter.com/pazguille) Licensed under the MIT license.
