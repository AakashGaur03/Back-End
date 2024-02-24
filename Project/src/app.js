import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // This is used to store some files or folder at our own server so to store public assessts the name "public" is not important it isa named because we made a public Folder

app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users",userRouter)


export { app };
