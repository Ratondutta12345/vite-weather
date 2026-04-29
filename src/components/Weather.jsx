import React, { useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search-icon.webp'
import weatherIcon from '../assets/weather-icon.png'
import humidityIcon from '../assets/humadity-icon.png'
import windIcon from '../assets/wind.jpg'

const Weather = () => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiKey = import.meta.env.VITE_APP_ID

  const fetchWeather = async (city) => {
    if (!city) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city,
        )}&appid=${apiKey}&units=metric`,
      )
      if (!res.ok) throw new Error('City not found')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather(query)
  }

  return (
    <div className="weather">
      <div className="card">
        <div className="header">
          <h1 className="title">Weather Forecast</h1>
          <p className="subtitle">Get real-time weather updates</p>
        </div>

        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search by city name..."
            aria-label="City"
          />
          <button
            className="icon-btn"
            onClick={() => fetchWeather(query)}
            aria-label="Search"
          >
            <img src={search_icon} alt="search" />
          </button>
        </div>

        {/* Weather Icon and City Name */}
        <div className="weather-header-section">
          <div className="weather-icon-section">
            <img
              src={weatherIcon}
              alt="weather icon"
              className="permanent-weather-icon"
            />
          </div>
          <div className="city-info">
            <h2 className="city-name">
              {data ? `${data.name}, ${data.sys?.country}` : 'Search city for weather'}
            </h2>
            <p className="condition-description">
              {data ? `${data.weather[0].main} • ${data.weather[0].description}` : 'Enter a city and hit search'}
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Fetching weather data...</p>
          </div>
        )}

        {error && <div className="error">⚠️ {error}</div>}

        {/* Humidity and Wind Section */}
        {data && (
          <div className="quick-info-section">
            <div className="quick-info-card humidity-quick">
              <img src={humidityIcon} alt="humidity" className="quick-icon" />
              <div className="quick-data">
                <span className="quick-label">Humidity</span>
                <span className="quick-value">{data.main.humidity}%</span>
              </div>
            </div>

            <div className="quick-info-card wind-quick">
              <img src={windIcon} alt="wind" className="quick-icon" />
              <div className="quick-data">
                <span className="quick-label">Wind Speed</span>
                <span className="quick-value">{Math.round(data.wind.speed)} m/s</span>
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="weather-content">
            <div className="temp-section">
              <div className="main-temp">{Math.round(data.main.temp)}°C</div>
              <div className="feels-like">Feels like {Math.round(data.main.feels_like)}°C</div>
            </div>

            <div className="divider"></div>

            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{data.main.pressure} mb</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">Visibility</div>
                <div className="detail-value">{(data.visibility / 1000).toFixed(1)} km</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">UV Index</div>
                <div className="detail-value">N/A</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">Cloud Cover</div>
                <div className="detail-value">{data.clouds.all}%</div>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🌤️</div>
            <p>Search for a city to see weather information</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Weather
