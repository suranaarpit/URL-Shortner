const express = require("express");
const shortId = require("shortid");
const createHttpErr = require("http-errors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  res.render("index");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}/`);
});
