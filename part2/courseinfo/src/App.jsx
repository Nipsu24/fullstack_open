const Course = (props) => {
	return (
		<>
			{props.course.map((course) => {
				const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
				return (
					<div key={course.id}>
						<h2>{course.name}</h2>
						{course.parts.map((part) => (
							<p key={part.id}>
								{part.name} {part.exercises}
							</p>
						))}
						<b>total of {total} exercises</b>
					</div>
				);
			})}
		</>
	);
};

const App = () => {
	const course = [
		{
			id: 1,
			name: 'Half Stack application development',
			parts: [
				{
					name: 'Fundamentals of React',
					exercises: 10,
					id: 1
				},
				{
					name: 'Using props to pass data',
					exercises: 7,
					id: 2
				},
				{
					name: 'State of a component',
					exercises: 14,
					id: 3
				},
				{
					name: 'Redux',
					exercises: 11,
					id: 4
				}
			]
		},
		{
			id: 2,
			name: 'Node.js',
			parts: [
				{
					name: 'Routing',
					exercises: 3,
					id: 1
				},
				{
					name: 'Middlewares',
					exercises: 7,
					id: 2
				}
			]
		}
	]
	return (
		<>
			<h1> Web development curriculum</h1>
			<Course course={course} /> 
		</>
	)
}

export default App
