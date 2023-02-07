require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req,res, next) => {
  count = persons.length
  res.send(
    `
    <p>
      Phonebook has info for ${count} people
    </p>
    <p>${Date(Date.now)}</p>
    `
  )
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
  res.status(204).end()
})
.catch(error => next(error))
})

app.post('/api/persons', (req,res, next) => {
  const body = req.body

  if (!body.content){
    return res.status(400).json({
      error: 'name missing'
    })
  }else if (!body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    content: body.content,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  console.log('putissa bäkki')
  const body = req.body

  const person = {
    content: body.content,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((upd) => {
      res.json(upd)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})