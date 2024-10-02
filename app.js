require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 4000;

const researchRouter = require("./routes/researchRouter");
const collegeRouter = require("./routes/collegeRouter");
const eventRouter = require("./routes/eventRouter");
const authRouter = require("./routes/authRouter");

const mongoose = require("mongoose");

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// routes
app.use("/api/researches", researchRouter);
app.use("/api/colleges", collegeRouter);
app.use("/api/events", eventRouter);
app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
