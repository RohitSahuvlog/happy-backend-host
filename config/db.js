
const mongoose = require("mongoose")
const cron = require("node-cron");
const Event = require("../models/upcoming-event.model");
const moment = require('moment');
require("dotenv").config()
const connection = mongoose.connect(process.env.mongo_url)
// cron.schedule('59 23 * * *', async () => {
cron.schedule("*/6 * * * * *", async () => {
    const currentDate = moment().format("YYYY-MM-DD");


    try {
        const pastEvents = await Event.find({ isActive: true, eventDate: { $lt: currentDate } });

        for (const event of pastEvents) {
            event.isActive = false;
            await event.save();
        }

        console.log(`Updated ${pastEvents.length} events as inactive.`);
    } catch (error) {
        console.error("Error updating events:", error);
    }
});

module.exports = { connection }