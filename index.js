const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    res.json(persons)
})

app.get('/info', (req,res) => {
  count = persons.length
  res.send(
    `5
    <p>
      Phonebook has info for ${count} people
    </p>
    <p>${Date(Date.now)}</p>
    `
  )
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person){
    res.json(person)
  }else{
    res.status(404).end()
  }
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

  const person = {
    content: body.content,
    number: body.number,
    id: generateId() 
  }

  persons = persons.concat(person)

  res.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})