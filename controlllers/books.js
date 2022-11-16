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
   
}