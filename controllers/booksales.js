var BaseController = require("./basecontroller"),
swagger = require("swagger-node-restify")
function BookSales(){

}
BookSales.prototype = new BaseController()
module.exports = function(lib){
    var controller = new BaseController();

    controller.addAction({
        'path': '/booksales',
        'method': 'GET',
        'summary': 'Returns the list of book sales',
        'params': [swagger.queryParam('start_date', 'Filter sales done after (or on)this date', 'string'),
                    swagger.queryParam('end_date', 'Filter sales done on or before this date', 'string'),
                    swagger.queryParam('store_id', 'Filter sales done on this store', 'string')
          ],
        'responseClass': 'BookSale',
        'nickname': 'getBookSales'
    })
}