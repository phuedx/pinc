'use strict'

const e = require('./exec')
const exec = e.exec
const execSync = e.execSync

const NONE = 'None'

// The root qdisc is a PRIO classful qdisc with three default bands and an
// additional band for each of the network throttling profiles. By basing the
// "flow ID" at three, we ignore the three default bands.
const BASE_FLOW_ID = 3

const BASE_HANDLE_MINOR = 1

const EGRESS_INTERFACE = 'eth0'

// Filter handles are always of the form "<MAJOR>::<MINOR>". If a handle isn't specified when a
// filter is created, then MAJOR will default to 800 and MINOR will default to either the last
// specified number plus one or 800 otherwise. N.B. that we're only ever varying the MINOR part of
// the filter's handle.
const FILTER_HANDLE_MAJOR = 800

function createProfileService (profilesFile) {
  const profiles = require(profilesFile)
  let profileCache = {}
  let handleMinor = BASE_HANDLE_MINOR

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

  function createHandleMinor () {
    return handleMinor++
  }

  function formatHandle (major, minor) {
    let result = ''

    if (major) {
      result += major.toString(16)
    }

    result += ':'

    if (minor) {
      result += minor.toString(16)
    }

    return result
  }

  function deleteCurrentFilter (ip) {
    if (!profileCache[ip]) {
      return Promise.resolve()
    }

    const handleMinor = profileCache[ip].handleMinor
    const handle = formatHandle(FILTER_HANDLE_MAJOR, handleMinor)

    return exec(
      `sudo tc filter del dev ${EGRESS_INTERFACE} protocol ip parent 1: handle ${handle} prio 3 u32`
    ).then(() => {
      delete profileCache[ip]
    })
  }

  function addFilter (ip, profile) {
    const handleMinor = createHandleMinor()
    const flowID = getFlowID(profile)
    const handle = formatHandle(undefined, handleMinor)

    return exec(
      `sudo tc filter add dev ${EGRESS_INTERFACE} protocol ip parent 1: handle ${handle} prio 3 u32 match ip dst ${ip}/32 flowid ${flowID}`
    ).then(() => {
      profileCache[ip] = {
        profile,
        handleMinor
      }
    })
  }

  function setProfile (ip, profile) {
    if (getProfile(ip) === profile) {
      return Promise.resolve()
    }

    if (profile === NONE) {
      return deleteCurrentFilter(ip)
    }

    const flowID = getFlowID(profile)

    if (flowID === null) {
      return Promise.reject(new Error(`The profile "${profile}" isn't defined.`))
    }

    return deleteCurrentFilter(ip)
      .then(() => addFilter(ip, profile))
  }

  function getProfiles () {
    return profiles
  }

  function createFilter (profile, i) {
    const flowID = i + BASE_FLOW_ID
    let parentHandle = formatHandle(1, flowID)

    const handleMajor = (i + 1) * 10
    let handle = formatHandle(handleMajor)

    const rate = profile.bandwidth
    const delay = profile.rtt

    // Create a Token Bucket Filter (TBF) classless qdisc with the desired maximum rate and a
    // reasonably low latency.
    execSync(
      `sudo tc qdisc add dev ${EGRESS_INTERFACE} parent ${parentHandle} handle ${handle} tbf rate ${rate}kbit buffer 1600 latency 50ms`
    )

    parentHandle = handle
    handle = formatHandle(handleMajor + 1)

    execSync(
      `sudo tc qdisc add dev ${EGRESS_INTERFACE} parent ${parentHandle} handle ${handle} netem delay ${delay}ms`
    )
  }

  function createFilters () {
    const bands = profiles.length + BASE_FLOW_ID

    // Delete the root qdisc.
    try {
      execSync(`sudo tc qdisc del dev ${EGRESS_INTERFACE} root`)
    } catch (e) {
      // `tc` will report that there's a root qdisc when one hasn't been added
      // but will fail when you try to delete it. This will often be the case after the Raspbeery Pi
      // has booted.
    }

    // Add a PRIO classful qdisc with the default priomap as the root qdisc. As well as the
    // default bands (bands one through three), a band is required for each of the network
    // throttling profiles.
    execSync(
      `sudo tc qdisc add dev ${EGRESS_INTERFACE} root handle 1: prio bands ${bands} priomap 1 2 2 2 1 2 0 0 1 1 1 1 1 1 1 1`
    )

    profiles.map(createFilter)
  }

  return {
    getProfile,
    setProfile,
    getProfiles,
    NONE,
    createFilters
  }
}

module.exports = createProfileService
