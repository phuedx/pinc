'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const deviceService = require('./src/devices')

const PORT = process.env.PORT || 8080

const app = express()

app.use(bodyParser.json())

app.get(
  '/devices',
  (req, res) =>
    deviceService.getDevices()
      .then((devices) => res.json(devices))
)

app.get(
  '/devices/:mac',
  (req, res) =>
    deviceService.getDevice(req.params.mac)
      .then((device) => {
        if (!device) {
          return res.status(404 /* Not Found */)
            .end()
        }

        res.json(device)
      })
)

app.put(
  '/devices/:mac',
  (req, res) =>
    deviceService.getDevice(req.params.mac)
      .then((device) => {
        if (!req.body.profile) {
          return res.status(400 /* Bad Request */)
            .end()
        }

        return deviceService.setDeviceProfile(device, req.body.profile)
      })
      .then(() =>
        res.status(204 /* No Content */).end()
      )
      .catch(() =>
        res.status(400 /* Bad Request */).end()
      )

)

app.listen(PORT)
