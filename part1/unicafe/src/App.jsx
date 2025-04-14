import { useState } from 'react'

const Header = (props) => (
	<h1>
		{props.title}
	</h1>
)

const Button = ({onClick, text}) => ( 
	<button onClick={onClick}>
		{text}
	</button> 
)

const StatisticLine = (props) => (
	<div>
		{props.text} {props.value} {props.suffix || ''}
	</div>
)

const Statistics = ({ good, neutral, bad }) => {
	const total = good + neutral + bad;
	if (total === 0) {
		return (
		<div>
			No feedback given
		</div>
		)
	}

	const average = ((good * 1) + (neutral * 0) + (bad * -1)) / total;
	const positive = (good / total) * 100;
	return (
		<div>
			<StatisticLine text='good' value={good} />
			<StatisticLine text='neutral' value={neutral} />
			<StatisticLine text='bad' value={bad} />
			<StatisticLine text='all' value={total} />
			<StatisticLine text='average' value={average} />
			<StatisticLine text='positie' value={positive} suffix='%' />
		</div>
	)
}

const App = () => {
	const title='give feedback'
	const title2='statistics'
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const increaseGood = () => {
		console.log('increase good, value before', good)
		const updatedGood = good + 1
		setGood(updatedGood)
		console.log('increase good, value after', updatedGood)
	}

	const increaseNeutral = () => {
		console.log('increase neutral, value before', neutral)
		const updatedNeutral = neutral + 1
		setNeutral(updatedNeutral)
		console.log('increase neutral, value after', updatedNeutral)
	}

	const increaseBad = () => {
		console.log('increase bad, value before', bad)
		const updatedBad = bad + 1
		setBad(updatedBad)
		console.log('increase bad, value after', updatedBad)
	}

	return (
		<>
			<Header title={title} />
			<Button onClick={increaseGood} text="good" />
			<Button onClick={increaseNeutral} text="neutal" />
			<Button onClick={increaseBad} text="bad" />
			<Header title={title2} />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</>
	)
}

export default App