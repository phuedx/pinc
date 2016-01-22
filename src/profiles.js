'use strict'

const readFileSync = require('fs').readFileSync
const Promise = require('bluebird')
const exec = require('child_process').exec

const NONE = 'None'

// The root qdisc is a PRIO classful qdisc with three default bands and six bands for the network
// throttling profiles. By basing the "flow ID" at three, we ignore the three default bands.
const BASE_FLOW_ID = 3

function createProfileService (profilesFile) {
  const profiles = JSON.parse(readFileSync(profilesFile))
  let profileCache = {}

  function getProfile (ip) {
    return profileCache[ip] || NONE
  }

  function getFlowID (profile) {
    for (let i = 0; i < profiles.length; ++i) {
      if (profiles[i].name === profile) {
        return i + BASE_FLOW_ID
      }
    }

    return null
  }

  function setProfile (ip, profile) {
    return new Promise((resolve, reject) => {
      const flowID = getFlowID(profile)

      if (flowID === null) {
        return reject(new Error(`The profile "${profile}" isn't defined.`))
      }

      exec(
        `sudo tc filter add dev wlan0 protocol ip parent 1: prio 3 u32 match ip dst ${ip}/32 flowid ${flowID}`,
        (err) => {
          if (err) {
            return reject(err)
          }

          profileCache[ip] = profile

          resolve()
        }
      )
    })
  }

  function getProfiles () {
    return profiles
  }

  return {
    getProfile,
    setProfile,
    getProfiles
  }
}

module.exports = createProfileService
