var restify = require("restify"),
    colors = require("colors"),
    lib = require("./lib"),
    swagger = require("swagger-node-restify"),
    config = lib.config
var server = restify.createServer(lib.config.server)