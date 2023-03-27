import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function WeatherApp() {
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [time, setTime] = useState(new Date());

  const apiKey = '00443c85fae241be2056a8e8d5a68301';

  useEffect(() => {
    if (city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setTemperature(data.main.temp);
          setWeather(data.weather[0].main);
        })
        .catch(error => console.log(error));
    }
  }, [city]);

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  let emoji;
  let isDaytime;
  if (weather === 'Clear') {
    if (time.getHours() >= 6 && time.getHours() < 18) {
      emoji = '☀️';
      isDaytime = true;
    } else {
      emoji = '🌙';
      isDaytime = false;
    }
  } else if (weather === 'Clouds') {
    emoji = '☁️';
    isDaytime = true;
  } else if (weather === 'Rain') {
    emoji = '🌧️';
    isDaytime = true;
  } else if (weather === 'Snow') {
    if (temperature < 0) {
      emoji = '❄️🥶';
    } else {
      emoji = '❄️';
    }
    isDaytime = true;
  }

  function handleSearch(event) {
    event.preventDefault();
    const city = event.target.elements.city.value;
    setCity(city);
  }

  return (
    <div className={`container${isDaytime ? '' : ' night'}`}>
      <h1>Weather App</h1>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="city">
          <Form.Label>Enter a city:</Form.Label>
          <Form.Control type="text" placeholder="e.g. London, Paris" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {temperature && (
        <>
          <p>{emoji} Current temperature: {temperature}°C</p>
          <p>{emoji === '🌧️' ? 'Bring an umbrella!' : null}</p>
        </>
      )}
      {!temperature && <p>Please enter a city to see the current temperature.</p>}
    </div>
  );
}

export default WeatherApp;
