var BaseController = require("./basecontroller"),
swagger = require("swagger-node-restify")

function BookSales() {
}
BookSales.prototype = new BaseController();
module.exports = function(lib){
    var controller = new BookSales();

    //list
    controller.addAction({
        'path': '/authors',
        'method': 'GET',
        'summary': 'Returns the list of authors across all stores',
        'params': [swagger.queryParam('genre', 'filter authors by genre of their books', 'string'),
                   swagger.queryParam('q', 'Search parameter', 'string')],
        'responseClass': 'Author',
        'nickname': 'getAuthors'
    }, function(req, res, next){
        var criteria = {}
        if(req.params.q){
            var expr = new RegExp('.*' + req.params.q + '.*', 'i')
        }
    })
}
