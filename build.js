const fs = require('fs');
const browserify = require('browserify');
const exorcist = require('exorcist');
const uglify = require('uglify-js');

try {
    fs.mkdirSync('./dist');
}
catch (error) {
    if (error.code != 'EEXIST') {
        throw error;
    }
}

const files = {
    unminified: './dist/shadow-dom.js',
    minified: './dist/shadow-dom.min.js',
    map: './dist/shadow-dom.min.js.map'
};

const uglifyOptions = { 
    output: {
        keep_quoted_props: true
    },
    compress: {
        properties: false
    },
    mangle: true, 
    mangleProperties: false /*{
        ignore_quoted: true    
    }*/
};

const unminified = browserify('./src/main.js')
    .transform('babelify', { 
        presets: ['es2015'],
    })
    .bundle()
    .pipe(fs.createWriteStream(files.unminified, 'utf8'));

unminified.on('finish', () => {
    console.log('Unminified build complete');
});

const minified = browserify('./src/main.js', { debug: true })
    .transform('babelify', { 
        presets: ['es2015'],
        sourceMaps: false 
    })
    .transform('uglifyify', uglifyOptions)
    .bundle()
    .pipe(exorcist(files.map))
    .pipe(fs.createWriteStream(files.minified, 'utf8'));

minified.on('finish', () => {
    const uglified = uglify.minify(files.minified, Object.assign({
        inSourceMap: files.map,
        outSourceMap: files.map
    }, uglifyOptions));
    fs.writeFileSync(files.minified, uglified.code);
    fs.writeFileSync(files.map, uglified.map);
    console.log('Minified build complete');
});