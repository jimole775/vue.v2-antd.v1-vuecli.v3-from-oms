const path = require('path')
const currentDir = __dirname
function resolve (base, args) {
    args = Array.from(args)
    args.unshift(base)
    args.unshift(currentDir)
    return path.join.apply(path, args)
}

global.path = {}
global.path.root = function () { return resolve('../', arguments) }
global.path.server = function () { return resolve('/', arguments) }
global.path.api = function () { return resolve('api', arguments) }
global.path.common = function () { return resolve('common', arguments) }
global.path.db = function () { return resolve('data-base', arguments) }
global.path.utils = function () { return resolve('utils', arguments) }

global.const = {}
global.const.demo_name = 'builder-demo'
