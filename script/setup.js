const PROFILES_FILE = `${__dirname}/../profiles.js`

const createProfileService = require('../src/server/profiles')

createProfileService(PROFILES_FILE)
  .createFilters()