import React from 'react'
import Front from './components/Front/Front'
import ConversationView from './components/ConversationView/ConversationView'
import ConversationList from './components/ConversationList/ConversationList'
import Menu from "./components/Menu/Menu"
import useWindowDimensions from "./utils/useWindowDimensions"
import { Route } from 'react-router-dom'

import './App.css'

const App = () => {
  const { height, width } = useWindowDimensions();
  return (
    <div id="app-wrapper" className="app-wrapper">
      <Menu />
      <Route exact path="/" component={Front} />
      <Route exact path="/list/" component={ConversationList} />
      <Route exact path="/conversations/:id" component={ConversationView} />
    </div>
  );
}

export default App;
