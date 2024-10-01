require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 4000;

const collegeRouter = require("./routes/collegeRouter");
const userRouter = require("./routes/userRouter");

const mongoose = require("mongoose");

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// routes
app.use("/api/colleges", collegeRouter);
app.use("/api/users", userRouter);

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
