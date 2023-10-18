const router = require("express");
const userrouter = router();
const Event = require("../models/upcoming-event.model");
const contactModel = require("../models/contact.model");


userrouter.get("/contacts", (req, res) => {
  contactModel.find({}, (err, contacts) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch contacts" });
    } else {
      res.status(200).json(contacts);
    }
  });
});

userrouter.post("/contacts", async (req, res) => {
  const { name, email, querydetails } = req.body;

  const contact = new contactModel({
    name,
    email,
    querydetails
  });

  try {
    await contact.save();
    await sendEmailNotification(name, email, querydetails);
    res.status(201).json({ message: "Contact created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save contact or send email" });
  }
});

module.exports = {
  userrouter,
};
