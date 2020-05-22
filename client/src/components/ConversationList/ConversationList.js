import React, { useState, useEffect } from 'react'
import conversationService from '../../services/conversation'
import ConversationListItem from './ConversationListItem/ConversationListItem'
import Spinner from '../Spinner/Spinner'
import "./ConversationList.css"

const ConversationList = () => {
    const [conversations, setConversations] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const fetched = await conversationService.getAll()
            setConversations(fetched)
        }
        fetchData()
    }, [])

    return (
        <>
            <h2 className="list-header">All Conversations</h2>
            <div className="conversation-list">
                {conversations
                    ? <>
                        {conversations.map(conversation => <ConversationListItem key={conversation.id} conversation={conversation} />)}
                    </>
                    : <Spinner />
                }
            </div>
        </>
    )
}
export default ConversationList