import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);
  useEffect(() => {
    axios
      .get("/api/jokes")                      // Add proxy in vite.config.js to remove CORS
      //  TO remove CORS error either do proxy or white list your url from backend
      .then((res) => {
        setJokes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <p>Jokes : {jokes.length}</p>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <h5>{joke.content}</h5>
        </div>
      ))}
    </>
  );
}

export default App;




// One Bad practice to serve the code is to run build command and move dist file to backend folder and in backend add line
// app.use(express.static('dist'))

// From this the app will serve from https://localhost:3000 but every time we do any single change in our front end and want to propogate that change in the application then we have to again do npm run build and move that folder to backend So this is a bad practice  