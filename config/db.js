
const mongoose = require("mongoose")
const cron = require("node-cron");
const Event = require("../models/upcoming-event.model");
const moment = require('moment-timezone');
require("dotenv").config()
const winston = require('winston');

const connection = mongoose.connect(process.env.mongo_url);
cron.schedule('59 23 * * *', async () => {
    // cron.schedule("*/1 * * * * *", async () => {
    const currentDate = moment().tz('Asia/Kolkata').format("YYYY-MM-DD");

    console.log("Current", currentDate)
    try {
        const pastEvents = await Event.find({ isActive: true, eventDate: { $lt: currentDate } });

        for (const event of pastEvents) {
            event.isActive = false;
            await event.save();
        }

        console.log(`Updated ${pastEvents.length} events as inactive.`);
    } catch (error) {
        console.error("Error updating events:", error);
        winston.error("Error updating events:", error);
    }
});

module.exports = { connection }