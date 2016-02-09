import {
  REFRESH_REQUEST,
  REFRESH_SUCCESS,
  REFRESH_FAILURE,
  SHOW_DEVICE_DETAILS,
  HIDE_DEVICE_DETAILS,
  TOGGLE_NETWORK_THROTTLING,
  THROTTLE_DEVICE_REQUEST,
  THROTTLE_DEVICE_SUCCESS,
  SELECT_PROFILE
} from './actions'

const INITIAL_STATE = {
  isRefreshing: false,
  devices: [],
  profiles: [],
  isShowingDeviceDetails: false,
  currentDevice: {},
  defaultProfile: {},
  isThrottlingDevice: false
}

export default (state = INITIAL_STATE, action) => {
  let currentDevice
  let devices

  switch (action.type) {
    case REFRESH_REQUEST:
      return Object.assign({}, state, {
        isRefreshing: true
      })

    case REFRESH_SUCCESS:
      const { profiles } = action

      return Object.assign({}, state, {
        isRefreshing: false,
        devices: action.devices,
        profiles,
        defaultProfile: profiles[0]
      })

    case REFRESH_FAILURE:
      return Object.assign({}, state, {
        isRefreshing: false
      })

    case SHOW_DEVICE_DETAILS:
      return Object.assign({}, state, {
        isShowingDeviceDetails: true,
        currentDevice: action.device
      })

    case HIDE_DEVICE_DETAILS:
      return Object.assign({}, state, {
        isShowingDeviceDetails: false,
        currentDevice: {}
      })

    case TOGGLE_NETWORK_THROTTLING:
      currentDevice = Object.assign({}, state.currentDevice)
      currentDevice.has_profile = !currentDevice.has_profile

      // FIXME: Special-casing the string "None".
      if (currentDevice.has_profile) {
        if (currentDevice.profile === 'None') {
          const { name } = state.defaultProfile

          currentDevice.profile = name
        }
      } else {
        currentDevice.profile = 'None'
      }

      return Object.assign({}, state, {
        currentDevice
      })

    case THROTTLE_DEVICE_REQUEST:
      return Object.assign({}, state, {
        isThrottlingDevice: true
      })

    case THROTTLE_DEVICE_SUCCESS:
      const { device } = action

      devices = state.devices.slice()

      for (let i = 0; i < devices.length; ++i) {
        if (devices[i].dhcp.mac === device.dhcp.mac) {
          devices[i] = device

          break
        }
      }

      return Object.assign({}, state, {
        isThrottlingDevice: false,
        devices
      })

    case SELECT_PROFILE:
      const { profile } = action

      currentDevice = Object.assign({}, state.currentDevice, {
        has_profile: true,
        profile
      })

      return Object.assign({}, state, {
        currentDevice
      })

    default:
      return state
  }
}
