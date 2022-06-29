const mongoose = require("mongoose");

const shortURLSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortId: { type: String, required: true },
});

const shortUrl = mongoose.model("shortUrl", shortURLSchema);

module.exports = { shortURLSchema, shortUrl };
