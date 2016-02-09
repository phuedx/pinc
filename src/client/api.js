/* global BASE_API_URL */

import fetch from 'isomorphic-fetch'

function internalFetch (path, options, json) {
  if (typeof json === 'undefined') {
    json = true
  }

  return fetch(`${BASE_API_URL}${path}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      if (!json) {
        return response
      }

      return response.json()
    })
}

export function getDevices () {
  return internalFetch('/devices')
}

export function getProfiles () {
  return internalFetch('/profiles')
}

export function updateDevice (device) {
  const body = JSON.stringify({
    profile: device.profile
  })
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }

  return internalFetch(
    `/devices/${device.dhcp.mac}`,
    options,

    // PUT /devices/:mac returns 204 No Content on success so don't try to JSON-decode the response
    // body.
    false
  )
}
