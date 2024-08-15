const Course = ( {course} ) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
}

const Content = ({ parts }) => 
  <>
    {parts.map(part => <Part key={part.id} part={part}/>)}
  </>

const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Total = ({ parts }) => {
    const sum = parts.reduce((total, part) => total + part.exercises, 0)
    return (
        <h4>
            Total of {sum} exercises
        </h4>
    )
}

export default Course

