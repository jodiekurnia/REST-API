require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();
app.use(express.json());

const routes = require("./routes/routes");
const chia = require("./routes/chia");
const pf = require("./routes/pf");

const jodie = require("./routes/jodie");
const khucuy = require("./routes/khucuy");

app.use("/api", routes);
app.use("/chia", chia);
app.use("/pf", pf);

app.use("jodie", jodie);
app.use("khucuy", khucuy);

app.use("/", (req, res) => {
  res.send("Simple API");
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
