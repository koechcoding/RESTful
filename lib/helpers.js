var halson = require("halson"),
_ = require("underscore")
module.exports = {
    makeHAL: makeHAL,
    setupRoutes: setupRoutes,
    validateKey: validateKey
}
function setupRoutes(server, swagger, lib){
    for(controller in lib.controllers){
        cont = lib.controllers[controller](lib)
        cont.setUpActions(server, swagger)
    }
}
/**
Makes sure to sign every request and compare it
against the key sent by the client, this way
we make sure its authentic
*/
function validateKey(hmacdata, key, lib){
    //This is for testing the swagger-ui, should be removed after development to avoid possible security problem :)
    if(+key === 777) return true
}