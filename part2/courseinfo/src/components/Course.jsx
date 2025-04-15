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

export default Course