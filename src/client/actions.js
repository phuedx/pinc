import { Promise } from 'es6-promise'
import { getDevices, getProfiles, updateDevice } from './api'

export const REFRESH_REQUEST = 'refresh_request'
export const REFRESH_SUCCESS = 'refresh_success'
export const REFRESH_FAILURE = 'refresh_failure'

export const SHOW_DEVICE_DETAILS = 'show_device_details'
export const HIDE_DEVICE_DETAILS = 'hide_device_details'

export const TOGGLE_NETWORK_THROTTLING = 'toggle_network_throttling'

export const THROTTLE_DEVICE_REQUEST = 'throttle_device_request'
export const THROTTLE_DEVICE_SUCCESS = 'throttle_device_success'
export const THROTTLE_DEVICE_FAILURE = 'throttle_device_failure'

export const SELECT_PROFILE = 'select_profile'

function refreshRequest () {
  return {
    type: REFRESH_REQUEST
  }
}

function refreshSuccess (devices, profiles) {
  return {
    type: REFRESH_SUCCESS,
    devices,
    profiles
  }
}

function refreshFailure (error) {
  return {
    type: REFRESH_FAILURE,
    error
  }
}

export function refresh () {
  return (dispatch) => {
    dispatch(refreshRequest())

    Promise.all([
      getDevices(),
      getProfiles()
    ]).then(
      ([devices, profiles]) => dispatch(refreshSuccess(devices, profiles)),
      error => refreshFailure(error)
    )
  }
}

export function showDeviceDetails (device) {
  return {
    type: SHOW_DEVICE_DETAILS,
    device
  }
}

export function hideDeviceDetails () {
  return {
    type: HIDE_DEVICE_DETAILS
  }
}

export function toggleNetworkThrottling () {
  return {
    type: TOGGLE_NETWORK_THROTTLING
  }
}

function throttleDeviceRequest () {
  return {
    type: THROTTLE_DEVICE_REQUEST
  }
}

function throttleDeviceSuccess (device) {
  return {
    type: THROTTLE_DEVICE_SUCCESS,
    device
  }
}

function throttleDeviceFailure (error, device) {
  return {
    type: THROTTLE_DEVICE_FAILURE,
    error,
    device
  }
}

export function throttleDevice (device) {
  return (dispatch) => {
    dispatch(throttleDeviceRequest())

    updateDevice(device).then(
      () => {
        dispatch(throttleDeviceSuccess(device))

        // FIXME: The `throttleDevice` action shouldn't know that after the device has been
        // successfully throttled, the `hideDeviceDetails` and `refresh` actions should be
        // dispatched.
        dispatch(hideDeviceDetails())
      },
      error => throttleDeviceFailure(error, device)
    )
  }
}

export function selectProfile (profile) {
  return {
    type: SELECT_PROFILE,
    profile
  }
}
