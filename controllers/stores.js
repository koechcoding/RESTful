var BaseController = require("./basecontroller"),
_ = require("underscore"),
swagger = require("swagger-node-restify")

function Stores(){
}
Stores.prototype  = new BaseController()
module.exports = function(lib){
    var controller = new Stores();
    
    controller.addAction({
        'path': '/stores',
        'method': 'GET',
        'summary': 'Returns the list of stores',
        'params': [swagger.queryParam('state', 'Filter the list of stores by state', 'string')],
        'responseClass': 'Store',
        'nickname': 'getStores'
    }, function(req, res, next){
        var criteria = {}
        if(req.params.state){
            criteria.state = new RegExp(req.params.state, 'i')
        }
        lib.db.model('Store')
           .find(criteria)
           .exec(function(err, list){
              if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, list)
           })
    })
    controller.addAction({
        'path': '/stores/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the store', 'string')],
        'summary': 'Returns the data of the store',
        'responseClass': 'Store',
        'nickname': 'getStore'
    }, function(req, res, next){
        var id = req.params.id
        if(id){
            lib.db.model('Store')
               .findOne({_id: id})
               .populate('employees')
               .exec(function(err, data){
                if(err) return next(controller.RESTError('InternalServerError', err))
                if(!data) return next(controller.RESTError('ResourceNotFoundError', 'Store not found'))
                controller.writeHAL(res, data)
               })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid'))
        }
    })
    controller.addAction({
        'path': '/stores/{id}/books',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the store', 'string'),
                  swagger.queryParam('q','Search parameters for the books', 'string'),
                  swagger.queryParam('genre', 'Filter results by genre', 'string')],
        'summary': 'Return the list of books of store',
        'responseClass': 'Book',
        'nickname': 'getStoresBooks'
    }, function(req, res, next){
        var id = req.params.id
        if(id){
            var criteria = {stores: id}
            if(req.params.q){
                var expr = new RegExp('.*' + req.params.q + '.*', 'i')
                criteria.$or = [
                    {title: expr},
                    {isbn_code: expr},
                    {description: expr}
                ] 
            }
            if(req.params.genre){
                criteria.genre = req.params.genre
            }
            //even though this is the stores controller, we deal directly with books here
            lib.db.model('Book')
                .find(criteria)
                .populate('authors')
                .exec(function(err, data) {
                if(err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, data)
                })
        }
    })
}
