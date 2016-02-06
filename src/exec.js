const childProcess = require('child_process')
const Promise = require('bluebird')

function exec (command) {
  return new Promise((resolve, reject) =>
    childProcess.exec(command, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  )
}

module.exports = {
  exec,
  execSync: childProcess.execSync
}
