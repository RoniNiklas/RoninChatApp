import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Front from './components/Front/Front'
import ConversationView from './components/ConversationView/ConversationView'
import ConversationList from './components/ConversationList/ConversationList'
import Menu from "./components/Menu/Menu"
import ConferenceRoom from './components/ConferenceRoom/ConferenceRoom'
import ConferenceLobby from "./components/ConferenceLobby/ConferenceLobby"
import NameChangeForm from "./components/NameChangeForm/NameChangeForm"

import './App.css'

const App = () => {
  const [name, setName] = useState(localStorage.getItem("name"))
  const [useAudio, setUseAudio] = useState(true)
  const [useVideo, setUseVideo] = useState(true)
  return (
    <div id="app-wrapper" className="app-wrapper">
      <Menu />
      <Route exact path="/" component={Front} />
      <Route exact path="/list/" component={ConversationList} />
      <Route exact path="/conversations/:id" component={ConversationView} />
      <Route exact path="/conference/:id" render={({ match }) => name
        ? <ConferenceRoom id={match.params.id} name={name} useAudio={useAudio} useVideo={useVideo} />
        : <ConferenceLobby setName={setName} useAudio={useAudio} setUseAudio={setUseAudio} setUseVideo={setUseVideo} useVideo={useVideo} />
      } />
      <Route exact path="/user/" render={() => <NameChangeForm setName={setName} />} />
    </div>
  )
}

export default App;
