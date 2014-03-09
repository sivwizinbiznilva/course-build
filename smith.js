var marked = require('marked')
    , fs = require('fs')
    , path = require('path')
    , ejs = require('ejs')
    , Metalsmith = require('metalsmith');

var args = process.argv;

if (args.length != 5)
  console.log("Format is <node course_path template_path course_id>");
else
{
  build(args[2], args[3], args[4]);
}

function build(coursePath, templatePath, course_id)
{
  if (fs.existsSync(templatePath) && fs.existsSync(coursePath))
  {
    course_id = course_id || "";

    Metalsmith(coursePath)
              .use(myMarked)
              .use(template)
              .build();
  } else
  {
    console.log("Either the course path or template path do not exist.");
  }
}

function myMarked(files, metalsmith, done) {

  for (var file in files) {
    var content = files[file].content;
    content = marked(content);
    files[file].content = content;
  }

  done();

};

function template(files, metalsmith, done) {

  var template = ejs.compile(fs.readFileSync('./template.ejs'
    , { encoding: 'ascii' }));

  for (var file in files) {
    var html = template({markdown: markdown, title: title });
    files[file].content = html;
    console.log(html);
  }

  done();
};
