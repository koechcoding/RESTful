var BaseController = require("./basecontroller"),
swagger = require("swagger-node-restify")

function BookSales() {
}
BookSales.prototype = new BaseController();
module.exports = function(lib){
    var controller = new BookSales();
}
