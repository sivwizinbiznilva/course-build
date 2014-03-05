var marked = require('marked')
    , fs = require('fs')
    , path = require('path')
    , ejs = require('ejs')

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

function build(coursePath, templatePath, course_id)
{
  if (fs.existsSync(templatePath) && fs.existsSync(coursePath))
  {
    course_id = course_id || "";
    var template = ejs.compile(fs.readFileSync(templatePath, { encoding: 'ascii' }));
    parseMarkdownRecursive(coursePath, template, course_id);
  } else
  {
    console.log("Either the course path or template path do not exist.");
  }
}

var args = process.argv;

if (args.length != 5)
  console.log("Format is <node course_path template_path course_id>");
else
{
  build(args[2], args[3], args[4]);
}
