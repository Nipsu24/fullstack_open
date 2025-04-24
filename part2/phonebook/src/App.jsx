import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({ person }) => {
	return <div>{person.name} {person.number}</div>
  }

const Filter = (props) => {
	return (
		<form>
			<div>
				filter shown with <input
				value={props.value}
				onChange={props.onChange}/>
			</div>
		</form>
	)
}

const PersonForm = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>
				name: <input 
				value={props.newName}
				onChange={props.onNameChange}/>
			</div>
			<div>
				number: <input 
				value={props.newNumber}
				onChange={props.onNumberChange}/>
				</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

	useEffect(() => {
		console.log('effect')
		axios
			.get('http://localhost:3001/persons')
			.then(response => {
			console.log('promise fulfilled')
			setPersons(response.data)
			})
	}, [])

	const addName = (event) => {
		event.preventDefault()
		for (let i = 0; i < persons.length; i++) {
			if (newName === persons[i].name) {
				window.alert(`${newName} is already added to the phonebook`)
				return ;
			}
		}
		const newPersonObject = {
			name: newName,
			important: true,
			id: String(persons.length + 1),
			number: newNumber,
		}
		setPersons(persons.concat(newPersonObject))
		setNewName('')
		setNewNumber('')
	}

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const filteredPersons = persons.filter(person =>
		person.name.toLowerCase().includes(filter.toLowerCase())
	)

	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	const ShownPersons = (props) => {
		return (
			<div>
				{props.filteredPersons.map(person => (
					<Persons key={person.name} person={person} />
				))}
			</div>
		)
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter value={filter} onChange={handleFilterChange} />
			<h2>add a new</h2>
			<PersonForm 
				newName={newName} 
				onNameChange={handleNameChange} 
				newNumber={newNumber} 
				onNumberChange={handleNumberChange} 
				onSubmit={addName}/>
			<h2>Numbers</h2>
			<ShownPersons filteredPersons={filteredPersons}/>
		</div>
	)
}

export default App
