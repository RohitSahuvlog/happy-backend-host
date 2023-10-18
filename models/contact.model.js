// Create a schema for the data
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    querydetails: String,
});

const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel;