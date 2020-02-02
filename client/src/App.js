import React from 'react';
import './App.css';
import ConversationList from './components/ConversationList/ConversationList'
import NewConversationForm from './components/Menu/NewConversationForm'
import ConversationView from './components/ConversationView/ConversationView'
import Menu from './components/Menu/Menu'
import { Route } from 'react-router-dom'

const App = () => {
  return (
    <div id="AppWrapper" className="App">
      <Menu/ >
      <Route exact path="/" component={ConversationList}/>
      <Route exact path="/newConversation" component={NewConversationForm}/>
      <Route exact path="/conversations/:id" component={ConversationView}/>
    </div>
  );
}

export default App;
