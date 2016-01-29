const exec = require('child_process').exec
const Promise = require('bluebird')

function promisifiedExec (command) {
  return new Promise((resolve, reject) =>
    exec(command, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  )
}

module.exports = promisifiedExec
