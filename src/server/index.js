'use strict'

const IS_PROD = require('./is_prod')
const CLIENT_LEASES_FILE = IS_PROD ? '/var/lib/dhcp/dhcpd.leases' : `${__dirname}/../../fixtures/dhcpd.leases`
const PROFILES_FILE = `${__dirname}/../../profiles.js`
const PORT = process.env.PORT || 8080

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const createDhcpService = require('./dhcp')
const createProfileService = require('./profiles')
const createDeviceService = require('./devices')

const dhcpService = createDhcpService(CLIENT_LEASES_FILE)
const profileService = createProfileService(PROFILES_FILE)
const deviceService = createDeviceService(dhcpService, profileService)

const app = express()

const error = (code, res) => (e) =>
  res.status(code).end(e.message)

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('./public'))

app.get(
  '/devices',
  (req, res) =>
    deviceService.getDevices()
      .then((devices) => res.json(devices))
      .catch(error(500, res)) // Internal Server Error
)

app.get(
  '/devices/:mac',
  (req, res) =>
    deviceService.getDevice(req.params.mac)
      .then((device) => {
        if (!device) {
          return res.status(404) // Not Found
            .end()
        }

        res.json(device)
      })
      .catch(error(500, res)) // Internal Server Error
)

app.put(
  '/devices/:mac',
  (req, res) => {
    if (!req.body.profile) {
      return res.status(400)
        .end();
    }

    deviceService.getDevice(req.params.mac)
      .then((device) =>
        deviceService.setDeviceProfile(device, req.body.profile)
      )
      .then(() =>
        res.status(204).end() // No Content
      )
      .catch(error(400, res)) // Bad Request
  }
)

app.get(
  '/profiles',
  (req, res) =>
    res.json(profileService.getProfiles())
)

app.listen(PORT)
