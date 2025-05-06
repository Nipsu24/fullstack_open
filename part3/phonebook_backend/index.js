require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(express.json())

const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
  })

  app.get('/api/persons/info', (request, response) => {
	Person.countDocuments({}).then(count => {
		const currentTime = new Date()
		const message = `Phonebook has info for ${count} people.<br><br>${currentTime}`
		response.send(message)
	})
  })

  app.get('/api/persons/:id', (request, response) => {
	note.findById(request.params.id).then(person => {
		response.json(person)
	})
  })

//   app.delete('/api/persons/:id', (request, response) => {
// 	const id = request.params.id
// 	persons = persons.filter(person => person.id !== id)
  
// 	response.status(204).end()
//   })

  const generateId = () => {
	const randNbr = Math.round(Math.random(1000) * 1000)
	return String(randNbr)
  }
  
  app.post('/api/persons', (request, response) => {
	const body = request.body
  
	if (!body.name || !body.number) {
	  return response.status(400).json({ 
		error: 'name or number missing' 
	  })
	}
	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
	// else if (persons.find(person => person.name === body.name)) {
	// 	return response.status(400).json({ 
	// 		error: 'name must be unique' 
	// 	  })
	// }
	
	// const person = {
	//   name: body.name,
	//   number: body.number,
	//   id: generateId(),
	// }
  
	// persons = persons.concat(person)
  
	// response.json(person)
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })