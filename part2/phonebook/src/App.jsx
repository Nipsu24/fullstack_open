import { useState } from 'react'

const Persons = ({ person }) => {
	return <div>{person.name}</div>
  }

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'test' }
	]) 
	const [newName, setNewName] = useState('')

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
		}
		setPersons(persons.concat(newPersonObject))
		setNewName('')
	}

	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<form onSubmit={addName}>
				<div>
					name: <input 
					value={newName}
					onChange={handleNameChange}/>
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
			<h2>Numbers</h2>
				<div>
					{persons.map(person => (
						<Persons key={person.name} person={person} />
					))}
				</div>
		</div>
	)
}

export default App
