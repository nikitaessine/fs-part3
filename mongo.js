const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
  `mongodb+srv://tekisihme:${password}@cluster0.tcqgyj5.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  content: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)



const person = new Person({
  content: name,
  number: phone,
})

if (process.argv.length === 3){

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.content,person.number)
    })
    mongoose.connection.close()
  })
}
if (process.argv.length > 3){
  person.save().then(() => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
}