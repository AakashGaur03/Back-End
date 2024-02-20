import express from "express"; // when using import remember to do type : module in package.json

const app = express();

// app.get("/", (req, res) => {
//   res.send("Server is ready");
// });

app.use(express.static('dist'))             //.use is a middleware

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "JOKE1",
      content: "This is JOKE1",
    },
    {
      id: 2,
      title: "JOKE2",
      content: "This is JOKE2",
    },
    {
      id: 3,
      title: "JOKE3",
      content: "This is JOKE3",
    },
    {
      id: 4,
      title: "JOKE4",
      content: "This is JOKE4",
    },
  ];

  res.send(jokes)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at ${port}`);
});
