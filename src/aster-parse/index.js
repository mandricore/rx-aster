'use strict'

var Rx = require('rx')
var extname = require('path').extname

// Yes, this needs to be single global storage for any versions of aster-parse installed.
var parsers = global['aster-parse'] || (global['aster-parse'] = {})

function parse (options) {
  return function (files) {
    return files
      .groupBy(function (file) { return extname(file.path).toLowerCase() || '.' })
      .flatMap(function (files) {
        var ext = files.key
        var parser = parsers[ext] || parse.registerParser(ext, require('aster-parse-' + ext.slice(1)))

        return parser(options)(files)
      })
  }
}

parse.registerParser = function (ext, parser) {
  let name = ext.toLowerCase()
  parsers[name] = parser
  return parsers[name]
}

module.exports = parse
