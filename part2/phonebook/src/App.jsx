import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Persons = ({ person, deletePerson }) => {
	return (
		<div>
			{person.name} {person.number} 
			<button onClick={deletePerson}>
				delete
			</button>
		</div>
	)
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
		personService
		.getAll()
		.then(initialPersons => {
			setPersons(initialPersons)
		})
	}, [])

	const addName = (event) => {
		event.preventDefault()
		for (let i = 0; i < persons.length; i++) {
			if (newName === persons[i].name && newNumber === persons[i].number) {
				window.alert(`${newName} is already added to the phonebook`)
				return ;
			}
			else if (newName === persons[i].name && newNumber != persons[i].number) {
				updateNumber(newNumber, persons[i].id)
				return ;
			}
		}
		const newPersonObject = {
			name: newName,
			important: true,
			id: String(persons.length + 1),
			number: newNumber,
		}
		personService
		.create(newPersonObject)
		.then(returnedPerson => {
			setPersons(persons.concat(returnedPerson))
			setNewName('')
			setNewNumber('')
		})
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

	const deletePerson = (id) => {
		const person = persons.find(p => p.id === id)
		if (window.confirm(`Delete ${person.name}?`)) {
			personService
				.remove(id)
				.then(() => {
					setPersons(persons.filter(p => p.id != id))
				})
				.catch(error => {
					alert(`The person '${person.name}' was already deleted from the server`)
					setPersons(persons.filter(p => p.id !== id))
				})
		}
	}

	//called in addName if name exists but number deviates
	const updateNumber = (newNumber, id) => {
		const person = persons.find(p => p.id === id)
		const updatedPersonObject = {...person, number: newNumber}
		if (window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
			personService
			.update(id, updatedPersonObject)
			.then(() => {
				setPersons(persons.map(p => (p.id === id ? updatedPersonObject : p)));
				setNewName('')
				setNewNumber('')
			})
		}
	}

	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	const ShownPersons = ({filteredPersons, newNumber, deletePerson, updateNumber}) => {
		return (
			<div>
				{filteredPersons.map(person => (
					<Persons 
						key={person.id}
						person={person}
						deletePerson={() => deletePerson(person.id)}
					/>
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
			<ShownPersons 
				filteredPersons={filteredPersons}
				newNumber={newNumber} 
				deletePerson={deletePerson} 
			/>
		</div>
	)
}

export default App
