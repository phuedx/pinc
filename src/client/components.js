import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import ActionCached from 'material-ui/svg-icons/action/cached'
import Paper from 'material-ui/Paper'
import { List, ListItem } from 'material-ui/List'
import ActionTrendingDown from 'material-ui/svg-icons/action/trending-down'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { connect } from 'react-redux'
import {
  refresh,
  showDeviceDetails,
  hideDeviceDetails,
  toggleNetworkThrottling,
  throttleDevice,
  selectProfile
} from './actions'

const App = ({
  isRefreshing,
  refresh,
  devices,
  profiles,
  showDeviceDetails,
  isShowingDeviceDetails,
  hideDeviceDetails,
  currentDevice,
  defaultProfile,
  toggleNetworkThrottling,
  throttleDevice,
  isThrottlingDevice,
  selectProfile
}) => (
  <div>
    <AppBar
      title='PiNC'
      showMenuIconButton={false}
      iconElementRight={
        <IconButton disabled={isRefreshing} onTouchTap={refresh}><ActionCached /></IconButton>
      }
    />
    <Paper>
      <List>
      {devices.map((device) => (
        <ListItem
          key={device.dhcp.mac}
          primaryText={device.dhcp.hostname}
          onTouchTap={() => showDeviceDetails(device)}
          leftIcon={device.has_profile ? <ActionTrendingDown /> : null}
          secondaryText={device.has_profile ? device.profile : null}
        />
      ))}
      </List>
    </Paper>
    <Dialog
      title='Network Throttling'
      open={isShowingDeviceDetails}

      // FIXME: With no `onRequestClose` handler defined, the dialog is modal anyway.
      modal

      actions={[
        <FlatButton
          label='Cancel'
          secondary
          onTouchTap={hideDeviceDetails}
          disabled={isThrottlingDevice}
        />,
        <FlatButton
          label='Save'
          primary
          onTouchTap={() => throttleDevice(currentDevice)}
          disabled={isThrottlingDevice}
        />
      ]}
    >
      <Toggle
        label='Enabled'
        defaultToggled={currentDevice.has_profile}
        onToggle={toggleNetworkThrottling}
      />
      <SelectField
        floatingLabelText='Profile'
        disabled={!currentDevice.has_profile}
        value={currentDevice.has_profile ? currentDevice.profile : defaultProfile.name}
        onChange={(_1, _2, profile) => selectProfile(profile)}
      >
        {profiles.map(({ name }) => (
          <MenuItem
            key={name}
            value={name}
            primaryText={name}
          />
        ))}
      </SelectField>
    </Dialog>
  </div>
)

const identity = (x) => x
const actions = {
  refresh,
  showDeviceDetails,
  hideDeviceDetails,
  toggleNetworkThrottling,
  throttleDevice,
  selectProfile
}

export default connect(identity, actions)(App)
