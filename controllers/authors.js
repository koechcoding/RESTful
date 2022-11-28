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
            criteria.$or = [
              {name: expr},
              {description: expr}
            ]
        }
        var filterByGenre = false || req.params.genre
        if(filterByGenre){
            lib.db.model("Book")
                  .find({genre: filterByGenre})
                  .exec(function(err, books){
                    if(err) return next(controller.RESTError('InternalServerError', err))
                    findAuthors(_.pluck(books, '_id'))
                  })
        } else{
           findAuthors()
        }
        function findAuthors(bookIds){
            if(bookIds){
                criteria.books = {$in: bookIds}
            }
            lib.db.model("Author")
                  .find(criteria)
                  .exec(function(err, authors){
                    if(err) return next(controller.RESTError('InternalServerError', err))
                    controller.writeHAL(res, authors)
                  })
        } 
    })
    //get
controller.addAction({
    'path': '/authors/{id}',
    'summary': 'Returns all the data from one specific author',
    'method': 'GET',
    'responseClass': 'Author',
    'nickname': 'getAuthor'
    }, function (req, res, next) {
    var id = req.params.id
        if(id) {
        lib.db.model('Author')
            .findOne({_id: id})
            .exec(function(err, author) {
        if(err) return next(controller.RESTError('InternalServerError', err))
        if(!author) {
        return next(controller.RESTError('ResourceNotFoundError', 'Author not found'))
        }
        controller.writeHAL(res, author)
        })
        } else {
        next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
        }
    })
}
