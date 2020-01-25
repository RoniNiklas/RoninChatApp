const conversationRouter = require('express').Router()
const Conversation = require('../models/conversation')

conversationRouter.get('/', async (request, response) => {
    const conversations = await Conversation.find()
    response.json(conversations.map(conversation => conversation.toJSON()))
    response.status(200)
})

conversationRouter.get('/:id', async (request, response) => {
  const conversation = await Conversation.findById(request.params.id)
  response.json(conversation.toJSON())
  response.status(200)
})

conversationRouter.post('/', async (request, response) => {
    let receivedConversation = request.body
    const conversation = new Conversation(
        receivedConversation
    )
    try {
        const savedConversation = await conversation.save()
        response.json(savedConversation.toJSON())
      } catch (error) {
        if (error.name === 'ValidationError') {
          return response.status(400).send({ error: error.message })
        }
    
        console.log('unknown error:', error)
        next(error)
      }
})

module.exports = conversationRouter