const controlllers = require(".");
var BaseController = require("./basecontrolle"),
_ = require("underscore"),
swagger = require("swagger-node-restify")

function Books(){

}
Books.prototype = new BaseController()

module.exports = function(lib){
    var controller = new Books();
    /**
    Helper function for the POST action
    */
   function mergeStores(list1, list2) {
    var stores1 = {}
    var stores2 = {}
    _.each(list1, function(st){
        if(st.store)
          stores1[st.store] = st.copies
    })
    _.each(list2, function(st){
        if(st.store)
          store2[st.store] = st.copies
    })
    var stores = _.extend(stores1, stores2)
    return_.map(stores, function(v, k){
        return {store: k, copies: v}
    })
   }
   controller.addAction({
    'path': '/books',
    'method': 'GET',
    'summary': 'Returns the list of books',
    'params': [ swagger.queryParam('q', 'Search term', 'string'), swagger.queryParam('genre', 'Filter by genre', 'string')],
    'responseClass': 'Book',
    'nickname': 'getBooks'
   },  function(req,res, next){
    var criteria = {}
    if(req.param.q){
        var expr = new RegExp('.*' + req.params.q + '.*')
        criteria.$or = [
            {title: expr},
            {isbn_code: expr},
            {description: expr}
        ]
    }
    if(req.params.genre){
        criteria.genre = req.params.genre
    }
   })

}