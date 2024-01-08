import express from "express";
import mongoose from "mongoose";
import Posts from "./postModel.js";
import Cors from "cors";
import Pusher from "pusher";
import dotenv from "dotenv";

// App Config
const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb://localhost:27017/mydatabase";

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap1",
  useTLS: true,
});

// Middleware
app.use(express.json());
app.use(Cors());

// DB Config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");

  // Instead of change stream, use watch for changes
  const postWatch = Posts.watch();
  postWatch.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      console.log("Trigerring Pusher");
      pusher.trigger("posts", "inserted", {
        change: change,
      });
    } else {
      console.log("Error trigerring Pusher");
    }
  });
});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"));
app.post("/upload", async (req, res) => {
  try {
    const dbPost = req.body;
    const data = await Posts.create(dbPost);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/sync", async (req, res) => {
  try {
    const data = await Posts.find().exec();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
