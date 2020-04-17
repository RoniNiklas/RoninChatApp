const conferenceRouter = require('express').Router()
const conferenceService = require("../services/conference")

conferenceRouter.post("/new", async (request, response) => {
    const conference = conferenceService.add(request.body.password)
    response.json(conference)
})

conferenceRouter.get("/:id", async (request, response) => {
    const conference = conferenceService.get(request.params.id)
    conference && delete conference.password
    conference 
        ? response.json(conference).status(200)
        : response.status(404).send({message: "No conference with that title found."})
})

module.exports = conferenceRouter
