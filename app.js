require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const port = process.env.PORT || 4000;

const researchRouter = require("./app/routes/researchRouter");
const collegeRouter = require("./app/routes/collegeRouter");
const subjectRouter = require("./app/routes/subjectRouter");
const galleryRouter = require("./app/routes/galleryRouter");
const reviewRouter = require("./app/routes/reviewRouter");
const eventRouter = require("./app/routes/eventRouter");
const sportRouter = require("./app/routes/sportRouter");
const authRouter = require("./app/routes/authRouter");
const userRouter = require("./app/routes/userRouter");

const mongoose = require("mongoose");

// middleware
app.use(
  cors({
    origin: "https://college-booking-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

console.log("cors", process.env.FRONTEND_URL);

// routes
app.use("/api/researches", researchRouter);
app.use("/api/colleges", collegeRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/events", eventRouter);
app.use("/api/sports", sportRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/", (req, res, next) => {
//   res.send("hello world");
// });

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

module.exports = app;
