var marked = require('marked')
    , fs = require('fs')
    , path = require('path')
    , ejs = require('ejs')
    , template = ejs.compile(fs.readFileSync('template.ejs', { encoding: 'ascii' }))
    , config = require('./config')

var parseMarkdownRecursive = function(directory) {
    var files = fs.readdirSync(directory);

    for (var i = 0; i < files.length; i++) {
        var currentFile = directory + '/' + files[i];

        switch (path.extname(files[i])) {
            case '.md':
                var markdown = marked(fs.readFileSync(currentFile, { encoding: 'ascii' }));
                var html = template({markdown: markdown, title: 'ECE382', styleServer: config.styleServer});
                fs.writeFileSync( directory + '/' + path.basename(currentFile, '.md') + '.html', html);
                break;
            case '':
                if (fs.statSync(currentFile).isDirectory() == true)
                    parseMarkdownRecursive(currentFile);
                break;
            default:
                //do nothing
                break;
        }
    }
}

console.log('building...')
parseMarkdownRecursive('./site');
console.log('built')
