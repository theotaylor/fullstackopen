import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [most, setMost] = useState(0)


  const handleVote = () => {
    const updatedPoints = points.map((point, index) => {
      if (index === selected) {
        return point += 1
      } else {
        return point
      }
    })
    setPoints(updatedPoints)
    console.log(updatedPoints)
    //return the index of the element with the highest number - from updatedPoints array
    const maxValue = updatedPoints.reduce((a, b) => Math.max(a, b))
    console.log("maxValue:", maxValue)
    setMost(updatedPoints.indexOf(maxValue))
    console.log("most", most)
  } 

  const handleGetAnecdote = () => {
    const randInt = Math.round((Math.random() * (anecdotes.length - 1)))
    console.log(randInt)
    setSelected(randInt)
  }

  return (
    <div>
      <div>      
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
      </div>
      <div>has {points[selected]} votes</div>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleGetAnecdote}>next anecdote</button>
      <div>
        <h1>Anecdote with most votes</h1>
        {anecdotes[most]}
      </div>
      <div>has {points[most]} votes</div>
    </div>
  )
}

export default App