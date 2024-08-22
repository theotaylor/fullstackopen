import { useState, useEffect } from 'react'
import axios from 'axios'

//5a1058eff6068775101209741411e592
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([])

  const api_key = import.meta.env.VITE_SOME_KEY
  
  useEffect(() => {
    const response = axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountries([])
  }

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country))
    } else {
      setSelectedCountries([...selectedCountries, country])
    }
  }

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      find countries<Search search={search} handleSearch={handleSearch}/>
      <ListShowing 
        filteredCountries={filteredCountries} 
        toggleCountry={toggleCountry}
        selectedCountries={selectedCountries}
        api_key={api_key}
      />
    </div>
  )
}

const Search = ({search, handleSearch}) => <input value={search} onChange={handleSearch}/>

const ListShowing = ({filteredCountries, toggleCountry, selectedCountries, api_key}) => { 
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (filteredCountries.length > 1) {
    return (
      filteredCountries.map(country => 
      <div key={country.ccn3}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ margin: '6px'}}>{country.name.common}</p>
          <button onClick={() => toggleCountry(country)}>
          {selectedCountries.includes(country) ? "close" : "show"}
        </button>
        </div>
        {selectedCountries.includes(country) && <Country country={country} api_key={api_key}/>}         
      </div>)
    )
  } else if (filteredCountries.length === 1 ) {
    return (
      <Country country={filteredCountries[0]} api_key={api_key}/>
    )
  } else {
    return <p>No countries found</p>
  }
}

const Country = ({country, api_key}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First API call to get the coordinates (lat and lon)
        const geoResponse = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&appid=${api_key}`
        )
        
        if (geoResponse.data.length > 0) {
          const { lat, lon } = geoResponse.data[0]

          // Second API call to get the weather data
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
          )
          
          setWeather(weatherResponse.data)
        }
      } catch (error) {
        console.error("Failed to get weather data", error)
      }
    }

    fetchWeather()

  }, [country.capital, api_key])
  console.log(weather)

  const languages = Object.values(country.languages)
  const imgStyle = { width: "200px" }

  const getImageSrc = (descr) => {
    let iconCode = ""

    switch (descr) {
      case "clear sky":
        iconCode = "01"
        break
      case "few clouds":
        iconCode = "02"
        break
      case "scattered clouds":
        iconCode = "03"
        break
      case "broken clouds":
        iconCode = "04"
        break
      case "shower rain":
        iconCode = "09"
        break
      case "rain":
        iconCode = "10"
        break
      case "thunerstorm":
        iconCode = "11"
        break
      case "snow":
        iconCode = "13"
        break
      case "mist":
        iconCode = "50"
        break        
    } 
    return `https://openweathermap.org/img/wn/${iconCode}d.png`
  }
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>
      <h4>languages:</h4>
      <ul>{languages.map(language => <li key={language}>{language}</li>)}</ul>
      <img style={imgStyle} src={country.flags.png} />
      <h3>{`Weather in ${country.capital}`}</h3>
      {weather ? (
        <div>
          <p>temperature: {weather.main.temp}°F</p>
          <img src={getImageSrc(weather.weather[0].description)} alt="" />
          <p>wind: {weather.wind.speed}m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}


export default App
