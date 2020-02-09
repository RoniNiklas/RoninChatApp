import React, { useState, useEffect } from 'react'
import conversationService from '../../services/conversation'
import ConversationListItem from './ConversationListItem'
import Spinner from '../Spinner'

const ConversationList = () => {
    const [conversations, setConversations] = useState()
    const [popularConversations, setPopularConversations] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const fetched = await conversationService.getAll()
            setConversations(fetched)
            setPopularConversations(Array.from(fetched).sort((conversationA, conversationB) => conversationB.messages.length - conversationA.messages.length).slice(0, 10))
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="container">
                <div className="row" style={{ width: "100%", textAlign: "center" }} >
                    <div className="col-sm">
                        <h2 style={{margin:"30px"}}>All Conversations</h2>
                        {conversations ?
                            <div>
                                {conversations.map(conversation => <ConversationListItem key={conversation.id} conversation={conversation} />)}
                            </div>
                            :
                            <Spinner />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ConversationList