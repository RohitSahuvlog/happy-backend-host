const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: String,
        required: true,
    },
    googleFormLink: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    detailedDescription: {
        type: String,
        required: true,
    },
    eventSummary: {
        type: String,
        // required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

const Event = mongoose.model("upcomingevent", eventSchema);

module.exports = Event;
