const Header = (props) => {
	console.log(props)
	return (
		<div>
			<h1>{props.title}</h1>
		</div>
	)
}

const Content = (props) => {
	console.log(props)
	return (
		<div>
			<Part partTitle = {props.part1} partExAmount = {props.exAmount1} />
			<Part partTitle = {props.part2} partExAmount = {props.exAmount2} />
			<Part partTitle = {props.part3} partExAmount = {props.exAmount3} />
		</div>
	)
}

const Total = (props) => {
	console.log(props)
	return (
		<div>
			<p>
			Number of exercises {props.totalAmount}
			</p>
		</div>
	)
}

//Called in Content
const Part = (props) => {
	console.log(props)
	return (
		<div>
			<p>
			{props.partTitle} {props.partExAmount}
			</p>
		</div>
	)
}

const App = () => {
	const course = 'Half Stack application development'
	const part1 = 'Fundamentals of React'
	const exercises1 = 10
	const part2 = 'Using props to pass data'
	const exercises2 = 7
	const part3 = 'State of a component'
	const exercises3 = 14
  
	return (
	  <>
		<Header title={course} />
		<Content part1 = {part1} exAmount1 = {exercises1} 
		 part2 = {part2} exAmount2 = {exercises2} 
		 part3 = {part3} exAmount3 = {exercises3} />
		<Total totalAmount = {exercises1 + exercises2 + exercises3}/>
	  </>
	)
  }
  
  export default App
