var marked = require('/home/toddbranch/marked')
    , fs = require('fs')
    , path = require('path')
    , ejs = require('ejs')
    , template_382 = ejs.compile(fs.readFileSync('template_382.ejs', { encoding: 'ascii' }))
    , template_383 = ejs.compile(fs.readFileSync('template_383.ejs', { encoding: 'ascii' }))
    , template_SummerSeminar = ejs.compile(fs.readFileSync('template_SummerSeminar.ejs', { encoding: 'ascii' }))
    , template_main = ejs.compile(fs.readFileSync('template_main.ejs', { encoding: 'ascii' }))

var extractTitleIfExists = function(fullTitleStringArray) {
    var pageTitle = "";

    if (fullTitleStringArray)
    {
        var splitTitleStringArray = fullTitleStringArray[0].split("'");
        var pageTitle = splitTitleStringArray[1];
    }

    return pageTitle;
}

var parseMarkdownSingleFile = function(file, template, title) {
    var rawText = fs.readFileSync(file, { encoding: 'ascii' });
    
    var fullTitleStringArray = rawText.match(/title = '.+'/gi);

    var pageTitle = extractTitleIfExists(fullTitleStringArray);

    if (pageTitle !== "")
    {
        title += " - " + pageTitle;
        rawText = rawText.replace(fullTitleStringArray[0],"");
    }

    var markdown = marked(rawText);

    var html = template({markdown: markdown, title: title });
    fs.writeFileSync(path.dirname(file) + '/' + path.basename(file, '.md') + '.html', html);
}

var parseMarkdownRecursive = function(directory, template, title) {
    var files = fs.readdirSync(directory);

    for (var i = 0; i < files.length; i++) {
        var currentFile = directory + '/' + files[i];

        switch (path.extname(files[i])) {
            case '.md':
                parseMarkdownSingleFile(currentFile, template, title);
                break;
            case '':
                if (fs.statSync(currentFile).isDirectory() == true)
                    parseMarkdownRecursive(currentFile, template, title);
                break;
            default:
                //do nothing
                break;
        }
    }
}

console.log('building 382...');
parseMarkdownRecursive('./site/ECE382', template_382, "ECE 382");
console.log('382 built');

console.log('building 383...');
parseMarkdownRecursive('./site/ECE383', template_383, "ECE 383");
console.log('383 built');

console.log('building Summer Seminar...');
parseMarkdownRecursive('./site/SummerSeminar', template_SummerSeminar, "Summer Seminar");
console.log('SummerSeminar built');

console.log('building front page');
parseMarkdownSingleFile('./site/index.md', template_main, "Courses");
