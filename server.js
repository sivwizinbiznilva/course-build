var http = require('http')
    , static = require('node-static')
    , file = new(static.Server)('./site')


http.createServer( function(req, res) {
    req.addListener('end', function() {
        file.serve(req, res)
    }).resume()
}).listen(8000)

console.log('listening on 8000')
