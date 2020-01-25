
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const conversationSchema = new mongoose.Schema({
    key: String,
    messages: [],
    description: String,
    title: String,
    image: String,
    permanent: Boolean,
    public: Boolean,
})

conversationSchema.statics.format = (conversation) => {
    return {
        key: conversation.key,
        title: conversation.title,
        description: conversation.description,
        messages: conversation.messages,
    }
}

conversationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation