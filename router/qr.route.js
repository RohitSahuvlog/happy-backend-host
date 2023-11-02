const express = require('express');
const Qrrouter = express.Router();
const Link = require('../models/qrcode.model');

// Create a new link
Qrrouter.post('/links', async (req, res) => {
    try {
        const { url } = req.body;

        const link = new Link({ url });
        await link.save();

        res.status(201).json(link);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a link.' });
    }
});

// Get the stored link
Qrrouter.get('/links', async (req, res) => {
    try {
        const link = await Link.findOne({}, 'url -_id');
        if (!link) {
            return res.status(404).json({ error: 'Link not found.' });
        }

        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the link.' });
    }
});

module.exports = Qrrouter;
