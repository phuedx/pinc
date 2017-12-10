'use strict'

function createDeviceService (dhcpService, profileService) {
  function createDevice (client) {
    const profile = profileService.getProfile(client.ip)

    return {
      dhcp: client,
      has_profile: profile !== profileService.NONE,
      profile
    }
  }

  function getDevices () {
    return dhcpService.getActiveClients()
      .then((clients) => clients.map(createDevice))
  }

  function getDevice (mac) {
    return dhcpService.getActiveClient(mac)
      .then((client) => createDevice(client))
  }

  function setDeviceProfile (device, profile) {
    return profileService.setProfile(device.dhcp.ip, profile)
  }

  return {
    getDevices,
    getDevice,
    setDeviceProfile
  }
}

module.exports = createDeviceService
