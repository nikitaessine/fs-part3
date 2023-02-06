const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    content: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    content: "Ada Lovelace",
    number: "39-44-5325252"
  },
  {
    id: 3,
    content: "Dan Abramov",
    number: "12-34-4554545"
  },
  {
    id: 4,
    content: "Mary Poppendick",
    number: "044-03803830"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req,res) => {
  count = persons.length
  res.send(
    `
    <p>
      Phonebook has info for ${count} people
    </p>
    <p>${Date(Date.now)}</p>
    `
  )
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req,res) => {
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

  const name = body.content
  const found = persons.find(person => person.content === name)

  if(found){
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    content: body.content,
    number: body.number,
    id: generateId() 
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})