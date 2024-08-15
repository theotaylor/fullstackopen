import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    const updatedAll = updatedGood + neutral + bad
    setAll(updatedAll)
    setAverage((updatedGood - bad) / updatedAll)
    setPositive((updatedGood / updatedAll) * 100)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    const updatedAll = good + updatedNeutral + bad
    setAll(updatedAll)
    setAverage((good - bad) / updatedAll)
    setPositive((good / updatedAll) * 100)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    const updatedAll = good + neutral + updatedBad
    setAll(updatedAll)
    setAverage((good - updatedBad) / updatedAll)
    setPositive((good / updatedAll) * 100)
  }

  return (
    <div>
      <h3>give feedback</h3>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <h3>statistics</h3>
      <Statistics 
        good={good}
        neutral={neutral}
        all={all}
        average={average}
        positive={positive}
        />
    </div>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine value={props.good} text="good" /> 
          <StatisticLine value={props.neutral} text="neutral" />
          <StatisticLine value={props.bad} text="bad" />
          <StatisticLine value={props.all} text="all" />
          <StatisticLine value={props.average} text="average" />
          <StatisticLine value={`${props.positive} %`} text="positive"/> 
        </tbody>
      </table>
    )    
  }
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
      <td>{props.additional}</td>
    </tr>
  )
}

export default App