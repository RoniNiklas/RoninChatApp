import React from 'react'
import { Route } from 'react-router-dom'
import Front from './components/Front/Front'
import ConversationView from './components/ConversationView/ConversationView'
import ConversationList from './components/ConversationList/ConversationList'
import Menu from "./components/Menu/Menu"
import VideoChatRoom from './components/VideoChatRoom/VideoChatRoom'

import './App.css'

const App = () => {
  return (
    <div id="app-wrapper" className="app-wrapper">
      <Menu />
      <Route exact path="/" component={Front} />
      <Route exact path="/list/" component={ConversationList} />
      <Route exact path="/conversations/:id" component={ConversationView} />
      <Route exact path="/video/" component={VideoChatRoom} />
    </div>
  );
}

export default App;
