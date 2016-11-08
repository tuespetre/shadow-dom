const fs = require('fs');
const browserify = require('browserify');
const exorcist = require('exorcist');

try {
    fs.mkdirSync('./dist');
}
catch (error) {
    if (error.code != 'EEXIST') {
        throw error;
    }
}

const unminified = browserify('./src/main.js')
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(fs.createWriteStream('./dist/shadow-dom.js', 'utf8'));

unminified.on('finish', () => console.log('Unminified build complete'));

const minified = browserify('./src/main.js', { debug: true })
    .transform('babelify', { presets: ['es2015'] })
    .transform('uglifyify')
    .bundle()
    .pipe(exorcist('./dist/shadow-dom.min.js.map'))
    .pipe(fs.createWriteStream('./dist/shadow-dom.min.js', 'utf8'));

minified.on('finish', () => console.log('Minified build complete'));