const adminroute = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/user.models");
const Event = require("../models/upcoming-event.model");
const multer = require('multer')
const storage = require("../middlewares/fileconfig");
const { Query } = require("mongoose");
const queryModel = require("../models/query.model");
const cloudinary = require("cloudinary").v2; // Import cloudinary as v2
const fileUpload = require("express-fileupload");
const streamifier = require('streamifier');


const upload = multer({ storage: storage });
dotenv.config();

adminroute.use(fileUpload());

adminroute.get("/events", async (req, res) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ create_at: -1 });
        res.status(200).send(events);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

adminroute.get("/prev-events", async (req, res) => {
    try {
        let pastEvents = await Event.find({ isActive: false }).sort({ create_at: -1 });
        res.status(200).send(pastEvents);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});


adminroute.post("/upcoming-events", async (req, res) => {
    try {
        if (!req.files || !req.files.thumbnail) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        const uploadedFile = req.files.thumbnail;

        const stream = streamifier.createReadStream(uploadedFile.data);

        const cloudinaryResponse = await new Promise((resolve, reject) => {
            stream.pipe(
                cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
            );
        });

        const eventData = {
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            googleFormLink: req.body.googleFormLink,
            thumbnail: cloudinaryResponse.secure_url,
            detailedDescription: req.body.detailedDescription,
            eventSummary: req.body.eventSummary,
        };

        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();

        res.status(201).send(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

adminroute.post("/edit-events/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const updatedEventData = {
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            googleFormLink: req.body.googleFormLink,
            detailedDescription: req.body.detailedDescription,
            eventSummary: req.body.eventSummary,
        };

        const existingEvent = await Event.findById(eventId);

        if (!existingEvent) {
            return res.status(404).send({ error: "Event not found" });
        }

        existingEvent.set({ ...existingEvent, ...updatedEventData });

        const updatedEvent = await existingEvent.save();

        res.status(200).send(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



adminroute.delete("/events/:eventId", async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).send({ error: "Event not found" });
        }
        res.send({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});


// User routes
adminroute.get("/getuserlist", async (req, res) => {
    try {
        const userList = await User.find().sort({ create_at: -1 });

        res.status(200).send(userList);
    } catch (error) {
        console.error("Error in getuserlist:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

adminroute.get('/getfeedback', async (req, res) => {
    try {
        const userList = await queryModel.find().sort({ create_at: -1 });
        res.status(200).json(userList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminroute.delete("/feedback/:eventId", async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const deletedEvent = await queryModel.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).send({ error: "query not found" });
        }
        res.send({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});


module.exports = { adminroute };
