import React from 'react';
import './App.css';
import ConversationList from './components/ConversationList'
import NewConversationForm from './components/NewConversationForm'
import ConversationView from './components/ConversationView'
import Menu from './components/Menu'
import { Route, Link, Redirect } from 'react-router-dom'

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
