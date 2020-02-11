import React, { useState, useEffect } from 'react'
import conversationService from '../../services/conversation'
import ConversationListItem from './ConversationListItem/ConversationListItem'
import Spinner from '../Spinner'
import "./ConversationList.css"

const ConversationList = () => {
    const [conversations, setConversations] = useState()
    const [popularConversations, setPopularConversations] = useState()

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
            <h2 className="list-header">All Conversations</h2>
            <div className="conversation-list">
                {conversations ?
                    <>
                        {conversations.map(conversation => <ConversationListItem key={conversation.id} conversation={conversation} />)}
                    </>
                    :
                    <Spinner />
                }
            </div>
        </>
    )
}
export default ConversationList