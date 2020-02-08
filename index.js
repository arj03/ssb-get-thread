const pull = require('pull-stream')
const sort = require('ssb-sort')

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

      if (!sbot.query) {
        const err = "ssb-query plugin not installed!"
        console.log(err)
        return cb(err)
      }

      sbot.get(msgId, (err, rootMsg) => {
        if (err) return cb(err)

        pull
        (
          sbot.query.read({
            query: [{
              $filter: {
                value: {
                  content: { root: msgId },
                }
              }
            }]
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

