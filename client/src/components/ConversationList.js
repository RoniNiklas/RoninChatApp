import React, { useState, useEffect } from 'react'
import conversationService from '../services/conversation'
import ConversationItem from './ConversationListItem'
import Spinner from 'react-bootstrap/Spinner'

const ConversationList = () => {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const data = await conversationService.getAll()
            setList(data)
            setLoading(false)
        }
        fetchData()
    }, [count])

    return (
        <div className="container">
            <div className="row" style={{ width: "100%" }} >
                <div className="col-sm">
                    {loading ?
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        :
                        <div>
                            {list.map(conversation => <ConversationItem key={conversation.title} conversation={conversation} />)}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
export default ConversationList