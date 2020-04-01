import React from 'react'
import { Route } from 'react-router-dom'
import Front from './components/Front/Front'
import ConversationView from './components/ConversationView/ConversationView'
import ConversationList from './components/ConversationList/ConversationList'
import Menu from "./components/Menu/Menu"
import ConferenceRoom from './components/ConferenceRoom/ConferenceRoom'

import './App.css'

const App = () => {
  return (
    <div id="app-wrapper" className="app-wrapper">
      <Menu />
      <Route exact path="/" component={Front} />
      <Route exact path="/list/" component={ConversationList} />
      <Route exact path="/conversations/:id" component={ConversationView} />
      <Route exact path="/video/" component={ConferenceRoom} />
    </div>
  );
}

export default App;
