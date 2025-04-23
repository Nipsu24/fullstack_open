import { useState } from 'react'

const Persons = ({ person }) => {
	return <div>{person.name} {person.number}</div>
  }

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456', id: 1 },
		{ name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
		{ name: 'Dan Abramov', number: '12-43-234345', id: 3 },
		{ name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
	]) 
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	
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

	return (
		<div>
			<h2>Phonebook</h2>
			<form>
				<div>
					filter shown with <input
					value={filter}
					onChange={handleFilterChange}/>
				</div>
			</form>
			<h2>add a new</h2>
			<form onSubmit={addName}>
				<div>
					name: <input 
					value={newName}
					onChange={handleNameChange}/>
				</div>
				<div>
					number: <input 
					value={newNumber}
					onChange={handleNumberChange}/>
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
			<h2>Numbers</h2>
				<div>
					{filteredPersons.map(person => (
						<Persons key={person.name} person={person} />
					))}
				</div>
		</div>
	)
}

export default App
