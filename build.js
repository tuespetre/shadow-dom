const fs = require('fs');
const browserify = require('browserify');
const exorcist = require('exorcist');
const uglify = require('uglify-js');
const uglifyOptions = require('./uglify.json');

ensureDistFolder();

uglifyOptions.reserved.props.push(...uglify.readDefaultReservedFile().props);

const files = {
    unminified: './dist/shadow-dom.js',
    minified: './dist/shadow-dom.min.js',
    map: './dist/shadow-dom.min.js.map'
};

browserify('./src/main.js')
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(fs.createWriteStream(files.unminified, 'utf8'))
    .on('finish', () => {
        console.log('Unminified build complete');
    });

browserify('./src/main.js', { debug: true })
    .transform('babelify', { presets: ['es2015'], sourceMaps: false })
    .bundle()
    .pipe(exorcist(files.map))
    .pipe(fs.createWriteStream(files.minified, 'utf8'))
    .on('finish', () => {
        const uglified = uglify.minify(files.minified, {
            inSourceMap: files.map,
            outSourceMap: files.map,
            compress: {
                properties: false
            },
            mangle: true, 
            mangleProperties: {
                ignore_quoted: true,
                reserved: uglifyOptions.reserved.props
            }
        });
        fs.writeFileSync(files.minified, uglified.code);
        fs.writeFileSync(files.map, uglified.map);
        console.log('Minified build complete');
    });

function ensureDistFolder() {
    try {
        fs.mkdirSync('./dist');
    }
    catch (error) {
        if (error.code != 'EEXIST') {
            throw error;
        }
    }
}