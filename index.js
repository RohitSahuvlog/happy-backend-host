const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { authentication } = require("./middlewares/authentication");
const { authroute } = require("./router/auth.route");
const { userrouter } = require("./router/user.route");
const { adminroute } = require("./router/admin.route");
const { authorization } = require("./middlewares/authrisation");
const cloudinary = require('cloudinary').v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const path = require("path");
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/auth", authroute);
app.use("/api/user", userrouter);
// app.use(authentication);
// authorization(["admin"]),
app.use("/api/admin", adminroute);

// Define a route for downloading files
app.use('/uploads/:filename', (req, res) => {
  const fileName = req.params.filename.toString();
  const filePath = path.join(__dirname, 'uploads', fileName);

  const fileExtension = path.extname(fileName).toLowerCase();
  let contentType = 'application/octet-stream';

  if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  } else if (fileExtension === '.pdf') {
    contentType = 'application/pdf';
  }

  res.setHeader('Content-Disposition', 'inline; filename=' + fileName); // Change "attachment" to "inline"
  res.setHeader('Content-Type', contentType);

  res.sendFile(filePath, function (err) {
    if (err) {
      console.error('Error serving file:', err);
      res.status(500).send('Error serving file');
    }
  });
});


app.listen(PORT, async (req, res) => {
  try {
    await connection;
    console.log("connect to mongodb");
  } catch {
    console.log(" error connect to mongodb");
  }

  console.log(`server is start at ${PORT}`);
});

// "mongodb+srv://sahu86744:rohitsahu54321@cluster0.ciixm9b.mongodb.net/?retryWrites=true&w=majority"
