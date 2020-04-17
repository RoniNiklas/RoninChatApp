import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import Front from './components/Front/Front'
import ConversationView from './components/ConversationView/ConversationView'
import ConversationList from './components/ConversationList/ConversationList'
import Menu from "./components/Menu/Menu"
import ConferenceRoom from './components/ConferenceRoom/ConferenceRoom'
import ConferenceLobby from "./components/ConferenceLobby/ConferenceLobby"

import mediaDeviceService from "./services/mediaDevices"

import './App.css'

const App = () => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("alfie")
  const [devices, setDevices] = useState()
  useEffect(() => {
    const checkDevices = async () => {
      setDevices({
        chosen: {
          audio: await mediaDeviceService.hasMicrophone(),
          video: await mediaDeviceService.hasCamera()
        },
        available: {
          audio: await mediaDeviceService.hasMicrophone(),
          video: await mediaDeviceService.hasCamera()
        }
      })
    }
    checkDevices()
  }, [])
  console.log("DEVICES", devices)
  console.log("drawing app")
  return (
    <div id="app-wrapper" className="app-wrapper">
      <Menu />
      <Route exact path="/" component={Front} />
      <Route exact path="/list/" component={ConversationList} />
      <Route exact path="/conversations/:id" component={ConversationView} />
      <Route exact path="/conference/:id" render={({ match }) => (name && devices && password)
        ? <ConferenceRoom id={match.params.id} name={name} setName={setName} setPassword={setPassword} devices={devices} password={password} />
        : <ConferenceLobby setName={setName} devices={devices} setDevices={setDevices} password={password} setPassword={setPassword} />
      } />
    </div>
  )
}

export default App;
