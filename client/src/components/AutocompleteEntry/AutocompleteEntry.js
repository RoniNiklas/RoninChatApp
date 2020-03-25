import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

import PropTypes from 'prop-types'

import './AutocompleteEntry.css'

const AutocompleteEntry = ({ suggestion, handleClick }) => {
  return (
    <ListGroup data-testid='autocomplete-entry' className="list-group-flush">
      <ListGroupItem onClick={() => handleClick("/conversations/" + suggestion.id)}> {suggestion.title} </ListGroupItem>
    </ListGroup>
  )
}

AutocompleteEntry.propTypes = {
  suggestion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  handleClick: PropTypes.func.isRequired
}

export default AutocompleteEntry
