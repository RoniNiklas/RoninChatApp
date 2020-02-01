import React, { useState, useEffect } from 'react'
import conversationService from '../services/conversation'
import ConversationListItem from './ConversationListItem'
import Spinner from './Spinner'
import ConversationCarousel from './ConversationCarousel'

const ConversationList = () => {
    const [conversations, setConversations] = useState([])
    const [popularConversations, setPopularConversations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const fetched = await conversationService.getAll()
            setConversations(fetched)
            setPopularConversations(fetched.sort((conversationA, conversationB) => conversationA.messages.length - conversationB.messages.length).slice(0, 10))
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="container">
                <div className="row" style={{ width: "100%", textAlign: "center" }} >
                    <div className="col-sm">
                        {loading ?
                            <Spinner />
                            :
                            <div>
                                <ConversationCarousel conversations={popularConversations} />
                            </div>
                        }
                    </div>
                </div>
                <div className="row" style={{ width: "100%", textAlign: "center" }} >
                    <div className="col-sm">
                        {loading ?
                            <Spinner />
                            :
                            <div>
                                {conversations.map(conversation => <ConversationListItem key={conversation.id} conversation={conversation} />)}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ConversationList