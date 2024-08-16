import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

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