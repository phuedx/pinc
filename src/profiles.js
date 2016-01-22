'use strict'

const Promise = require('bluebird')
const exec = require('child_process').exec

const NONE = 'none'
const PROFILES = {
  'GPRS': '1:3',
  'Regular 2G': '1:4',
  'Good 2G': '1:5',
  'Regular 3G': '1:6',
  'Good 3G': '1:7',
  'Regular 4G': '1:8'
}

let profiles = {}

function getProfile (ip) {
  return profiles[ip] || NONE
}

function setProfile (ip, profile) {
  return new Promise((resolve, reject) => {
    const flowID = PROFILES[profile]

    if (!flowID) {
      return reject(new Error(`The profile "${profile}" isn't defined.`))
    }

    exec(
      `sudo tc filter add dev wlan0 protocol ip parent 1: prio 3 u32 match ip dst ${ip}/32 flowid ${flowID}`,
      (err) => {
        if (err) {
          return reject(err)
        }

        profiles[ip] = profile

        resolve()
      }
    )
  })
}

module.exports = {
  getProfile,
  setProfile
}
