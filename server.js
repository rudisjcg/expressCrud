import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from './middlewares.js';
import api from './api/index.js';
dotenv.config();

const app = express();
const mongoURI = process.env.MONGO_URI;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello node Api With Vercel");
});

mongoose
  .connect(mongoURI)
    .then(() => {
      console.log("connected to Mongo!, and app listening on port 3500, Ready to go!");
      app.listen(3500);
    })
    .catch((error) => {
      console.log("error connecting to Mongo", error);
    });

app.use('/api/', api);
app.use(notFound);
app.use(errorHandler);

export default app;