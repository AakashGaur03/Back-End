import { useState,useEffect } from 'react'
import './App.css'
import axios from "axios";


function App() {
  const [jokes, setJokes] = useState([]);
  console.log(jokes)
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/jokes")                      
      .then((res) => {
        setJokes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
        <div>Hello</div>
        <h1>Hello</h1>
      <p>Jokes : {jokes.length}</p>
      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <h5>{joke.content}</h5>
        </div>
      ))}
    </>
  )
}

export default App
