import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
	const [entry, setEntry] = useState('')
	const [countries, setCountries] = useState([])

useEffect(() => {
		console.log('effect run, entry is now', entry)
		console.log('fetching data..')
		axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
		.then(response => {
			console.log('Fetched countries:', response.data)
			setCountries(response.data)
		})
		
}, [])

	const handleChange = (event) => {
		event.preventDefault()
		setEntry(event.target.value)
		console.log(event.target.value)
	}

const filteredCountries = countries.filter(country =>
	country.name.common.toLowerCase().includes(entry.toLowerCase())
)

if (filteredCountries.length > 10) {

}
	return (
		<>
		<form>
			find countries <input value={entry} onChange={handleChange}/>
		</form>
		<div>
			{filteredCountries.length > 10 ? (<div>Too many matches, specify another filter</div>) : (
			filteredCountries.map((country) => (
				<div key={country.name.common}>{country.name.common} </div>
			))
		)}

		</div>
		</>
	)
}

export default App
