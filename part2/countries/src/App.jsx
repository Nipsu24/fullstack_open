import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => (
	<div key={country.name.common}>
		<h1>{country.name.common}</h1>
		<div>Capital: {country.capital}</div>
		<div>Area: {country.area}</div>
		<h1>Languages</h1>
		<ul>
			{Object.values(country.languages).map((language) => (
				<li key={language}>{language}</li>
			))}
		</ul>
		<img src={country.flags.png} alt={`Flag of ${country.name.common}. ${country.flags.alt}`} />
	</div>
)

const CountryList = ({ countries, setSelectedCountry }) => (
	<div>
		{countries.map((country) => (
			<div key={country.name.common}>{country.name.common}
				<button onClick={() => setSelectedCountry(country)}> Show </button>
			</div>
		))}
	</div>
)

const TooManyMatches = () => (
	<div>Too many matches, specify another filter</div>
)

const App = () => {
	const [entry, setEntry] = useState('')
	const [countries, setCountries] = useState([])
	const [selectedCountry, setSelectedCountry] = useState(null)

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
		setSelectedCountry(null);
	}

	const filteredCountries = countries.filter(country =>
		country.name.common.toLowerCase().includes(entry.toLowerCase())
	)

	const renderContent = () => {
		if (selectedCountry) {
			return <CountryDetails country={selectedCountry} />
		}
		else if (filteredCountries.length > 10) {
			return <TooManyMatches />;
		} 
		else if (filteredCountries.length === 1) {
			return <CountryDetails country={filteredCountries[0]} />
		} 
		else {
			return <CountryList countries={filteredCountries} setSelectedCountry={setSelectedCountry}/>
		}
	};

	return (
		<>
			<form>
				find countries <input value={entry} onChange={handleChange}/>
			</form>
			<div>{renderContent()}</div>
    	</>
  )
}

export default App
