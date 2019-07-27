const pull = require('pull-stream')

sort = require('ssb-sort')

exports.manifest = {
  get: 'async'
}

exports.name = 'get-thread'

exports.version = require('./package.json').version

exports.permissions = {
  anonymous: { allow: ['get'] }
}

exports.init = function (sbot, config) {
  return {
    get: function(msgId, cb) {
      console.log("getting msg", msgId)
      if (!msgId) return cb("msg not found:" + msgId)

      sbot.get(msgId, (err, rootMsg) => {
	pull
	(
	  sbot.backlinks.read({
	    query: [ {$filter: { dest: msgId }} ]
	  }),
	  pull.filter((msg) => {
	    return msg.value.private !== true
	  }),
	  pull.collect((err, messages) => {
	    if (err) return cb(err)

	    cb(null, [rootMsg, ...sort(messages).map(m => m.value)])
	  })
	)
      })
    }
  }
}

