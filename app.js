const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');



const condidatRoute = require("./routes/condidat");
const entrepriseRoute = require("./routes/entreprise");
const offreRoute = require("./routes/offre");
const formationRoute = require("./routes/formation");
const competanceRoute = require("./routes/competance");
const experienceRoute = require("./routes/experience");



const httperror = require("./models/error");

const mongoose = require("mongoose");

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use("/api/condidat",condidatRoute);
app.use("/api/entreprise", entrepriseRoute);
app.use("/api/offre", offreRoute);
app.use("/api/formation", formationRoute);
app.use("/api/competance", competanceRoute);
app.use("/api/experience", experienceRoute);





app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});

mongoose
  .connect(
    "mongodb+srv://job:job@cluster0.bx2lg.mongodb.net/job?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
