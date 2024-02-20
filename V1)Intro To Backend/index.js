require('dotenv').config()
const express = require("express");
// import { express } from "express";

const app = express();
// const port = 3000;
const port = process.env.PORT

const githubData ={
    "login": "AakashGaur03",
    "id": 140057004,
    "node_id": "U_kgDOCFkZrA",
    "avatar_url": "https://avatars.githubusercontent.com/u/140057004?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/AakashGaur03",
    "html_url": "https://github.com/AakashGaur03",
    "followers_url": "https://api.github.com/users/AakashGaur03/followers",
    "following_url": "https://api.github.com/users/AakashGaur03/following{/other_user}",
    "gists_url": "https://api.github.com/users/AakashGaur03/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/AakashGaur03/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/AakashGaur03/subscriptions",
    "organizations_url": "https://api.github.com/users/AakashGaur03/orgs",
    "repos_url": "https://api.github.com/users/AakashGaur03/repos",
    "events_url": "https://api.github.com/users/AakashGaur03/events{/privacy}",
    "received_events_url": "https://api.github.com/users/AakashGaur03/received_events",
    "type": "User",
    "site_admin": false,
    "name": null,
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 15,
    "public_gists": 0,
    "followers": 0,
    "following": 0,
    "created_at": "2023-07-20T08:15:21Z",
    "updated_at": "2024-02-01T16:23:16Z"
  }

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/twitter',(req,res)=>{
    res.send("Twitter")
})
app.get('/login',(req,res)=>{
    res.send('<h1>Please Login</h1>')
})

app.get('/youtube',(req,res)=>{
    res.send('<h2>Chai Code</h2>')
})

app.get('/github',(req,res)=>{
    res.json(githubData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.listen(port)