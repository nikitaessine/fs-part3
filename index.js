const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})