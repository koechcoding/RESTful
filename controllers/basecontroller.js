
var _ = require("underscore"),
        restify = require("restify"),
        colors = require("colors"),
        halson = require("halson")
function BaseController(){
    this.action = []
    this.server = null
}
BaseController.prototype.setUpActions = function(app, sw){
    this.server = app
    _.each(this.actions, function(act){
        var method = act['spec']['method']
        //a bit of a logging message to help us understand what's going on in the hood
        console.log("Setting up auto-doc for (", method, ") - ", act['spec'] ['nickname'])
        sw['add' + method](act)
        app[method.toLowerCase()](act['spec']['path'], act['action'])
    })
}
BaseController.prototype.addAction = function(spec, fn){
    var newAct = {
        'spec': spec,
        action: fn
    }
    this.actions.push(newAct)
}
BaseController.prototype.RESTError = function(type, msg){
    if(restify[type]){
        return new restify[type](msg.toString())
    } else {
        console.log("Type " + type + " of error not found".red)
    }
}
/**
Takes care of calling the "toHAL" method on every resource before writing it
back to the client
*/
BaseController.prototype.writeHAL = function(res, obj){
    if(Array.isArray(obj)){
        var newArr = []
    _.each(obj, function(item, k){
        item = item.toHAL()
        newArr.push(item)
    })
    obj = halson(newArr)
    }else{
        if(obj && obj.toHAL)
          obj = obj.toHAL()
    }
    if(!obj){
        obj = {}
    }
    res.json(obj)
}

module.exports = BaseController;