import React, { useState, useEffect } from 'react'
import conversationService from '../services/conversation'
import ConversationItem from './ConversationListItem'
import Spinner from 'react-bootstrap/Spinner'

const ConversationList = (props) => {
    const [conversation, setConversation] = useState({})
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const data = await conversationService.getOne(props.match.params.id)
            setConversation(data)
            setLoading(false)
        }
        fetchData()
    }, [count])

    return (
        <div className="container">
            <div className="row" style={{ width: "100%" }} >
                <h5>{conversation.title}</h5>
                <div className="col-sm">
                    {loading ?
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        :
                        <div>
                            {conversation.messages.map(msg => <p>{msg}</p>)}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
export default ConversationList