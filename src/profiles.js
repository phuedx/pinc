'use strict'

const readFileSync = require('fs').readFileSync
const Promise = require('bluebird')
const exec = require('./exec')

const NONE = 'None'

// The root qdisc is a PRIO classful qdisc with three default bands and six bands for the network
// throttling profiles. By basing the "flow ID" at three, we ignore the three default bands.
const BASE_FLOW_ID = 3

const BASE_HANDLE = 1

const INTERFACE = 'eth0'

//
const FILTER_HANDLE_MAJOR = 800

function createProfileService (profilesFile) {
  const profiles = JSON.parse(readFileSync(profilesFile))
  let profileCache = {}
  let handle = BASE_HANDLE

  function getProfile (ip) {
    if (!profileCache[ip]) {
      return NONE
    }

    return profileCache[ip].profile
  }

  function getFlowID (profile) {
    for (let i = 0; i < profiles.length; ++i) {
      if (profiles[i].name === profile) {
        return i + BASE_FLOW_ID
      }
    }

    return null
  }

  function createHandle () {
    return handle++
  }

  function deleteCurrentFilter (ip) {
    if (!profileCache[ip]) {
      return Promise.resolve()
    }

    const handle = profileCache[ip].handle

    return exec(
      `sudo tc filter del dev ${INTERFACE} protocol ip parent 1: handle ${FILTER_HANDLE_MAJOR}::${handle} prio 3 u32`
    ).then(() => {
      delete profileCache[ip]
    })
  }

  function addFilter (ip, profile) {
    const handle = createHandle()
    const flowID = getFlowID(profile)

    exec(
      `sudo tc filter add dev ${INTERFACE} protocol ip parent 1: handle ::${handle} prio 3 u32 match ip dst ${ip}/32 flowid ${flowID}`
    ).then(() => {
      profileCache[ip] = {
        profile,
        handle
      }
    })
  }

  function setProfile (ip, profile) {
    return new Promise((resolve, reject) => {
      if (getProfile(ip) === profile) {
        return resolve()
      }

      if (profile === NONE) {
        return deleteCurrentFilter(ip)
      }

      const flowID = getFlowID(profile)

      if (flowID === null) {
        return reject(new Error(`The profile "${profile}" isn't defined.`))
      }

      return deleteCurrentFilter(ip)
        .then(() => addFilter(ip, profile))
    })
  }

  function getProfiles () {
    return profiles
  }

  return {
    getProfile,
    setProfile,
    getProfiles,
    NONE
  }
}

module.exports = createProfileService
