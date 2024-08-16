import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

  const hook = () => {
    console.log('effect')
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response)
    })
  }

  useEffect(hook, [])
  console.log('render', notes.length, 'notes')

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleNameAdd = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberAdd = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const isPersonAlreadyExisting = persons.some(person => person.name === newName)
    if (isPersonAlreadyExisting) {
      alert(`${newName} is already in the phone book`)
      return
    }
    const newPerson = {name: newName, number: newNumber}
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = persons.filter(persons => 
    persons.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Search newSearch={newSearch} handleSearch={handleSearch}/>  
      <h3>add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameAdd={handleNameAdd}
        handleNumberAdd={handleNumberAdd}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons}/>
    </div>
  )
}

const Search = ({newSearch, handleSearch}) => <input value={newSearch} onChange={handleSearch}/>

const PersonForm = ({newName, newNumber, addPerson, handleNameAdd, handleNumberAdd}) => {

  return (
    <form onSubmit={addPerson}>
      <div>
        name:<input value={newName} onChange={handleNameAdd}/>
      </div>
      <div>
        number:<input value={newNumber} onChange={handleNumberAdd} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons}) => {
  return (
    persons.map(person => <Person key={person.name} name={person.name} number={person.number}/>)
  )
}

const Person = ({name, number}) => <p>{name} {number}</p>

export default App