const express = require("express");
const shortId = require("shortid");
const createHttpErr = require("http-errors");
const mongoose = require("mongoose");
const path = require("path");
const { shortUrl } = require("./models/url");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/shortURL-Database")
  .then(() => console.log("Mongoose Connetced"))
  .catch((error) => console.log("Error in Connection..."));

app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  res.render("index");
});
app.post("/", async (req, res, next) => {
  try {
    let { url } = req.body;
    if (!url) {
      throw createHttpErr.BadRequest("Provide a Valid URL");
    }
    const urlExists = await shortUrl.findOne({ url });
    if (urlExists) {
      res.render("index", {
        short_url: `http://localhost:${PORT}/${urlExists.shortId}`,
      });
      return;
    }
    const ShortUrl = new shortUrl({ url: url, shortId: shortId.generate() });
    // console.log(ShortUrl)
    const result = await ShortUrl.save();
    res.render("index", {
      short_url: `http://localhost:${PORT}/${result.shortId}`,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/:shortId", async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const result = await shortUrl.findOne({ shortId });
    if (!result) {
      throw createHttpErr.NotFound("Short URL doesn't exists !");
    }
    res.redirect(result.url);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  next(createHttpErr.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("index", { error: err.message });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}/`);
});
