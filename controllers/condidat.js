const httpError = require("../models/error");

const condidat = require("../models/condidat");

const { validationResult } = require("express-validator");
const generator = require("generate-password");

const jwt = require("jsonwebtoken");
const offre = require("../models/offre");
const nodemailer = require("nodemailer");
const entreprise = require("../models/entreprise");

const log = console.log;
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "jmaiiasma2021@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "asma2021", // TODO: your gmail password
  },
});

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  let existinguser;
  try {
    existinguser = await condidat.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new condidat({
    name,
    email,
    password,
    competences: [],
    formations: [],
    experiences: [],
  });

  try {
    createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let mailOptions = {
    from: "jmaiiasma2021@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Confirmation de creation de compte",
    text: "Votre mot de passe est " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  let token;
  try {
    token = jwt.sign(
      { userId: createduser.id, email: createduser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    CondidatId: createduser.id,
    email: createduser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("ivalid input passed", 422));
  }

  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await condidat.findOne({ email: email });
  } catch {
    return next(new httpError("ivalid input passed", 422));
  }
  if (!existingUser || existingUser.password !== password) {
    return next(new httpError("invalid input passed", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ condidat: existingUser, token: token });
};

const getCondidat = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await condidat.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ condidat: existingUser });
};

const getCondidatById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await condidat.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ condidat: existingUser });
};

const updateCondidat = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, dateNaissance, sexe, age, email } = req.body;
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await condidat.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.name = name;
  existingUser.dateNaissance = dateNaissance;
  existingUser.sexe = sexe;
  existingUser.age = age;
  existingUser.photo = req.file.path;
  existingUser.email = email;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ Condidat: existingUser });
};

const deletecondidat = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);

  let existingUser;

  try {
    existingUser = await condidat.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingUser) {
    return next(new httpError("condidat does not exist", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

const getCondidatByOffreId = async (req, res, next) => {
  const id = req.params.id;

  // let places;
  let existingCondidat;
  try {
    existingCondidat = await offre.findById(id).populate("condidats");
  } catch (err) {
    const error = new httpError(
      "Fetching condidats failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingCondidat || existingCondidat.condidats.length === 0) {
    return next(
      new httpError("Could not find condidats for the provided user id.", 404)
    );
  }

  res.json({
    condidat: existingCondidat.condidats.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const postulerOffre = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { idCondidat, idOffre } = req.body;

  let existingOffre;
  try {
    existingOffre = await offre.findById(idOffre);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  let existingCondidat;
  try {
    existingCondidat = await condidat.findById(idCondidat);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  for (i = 0; i <= existingCondidat.offres.length; i++) {
    if (existingCondidat.offres[i] == idOffre) {
      const error = new httpError("Vous avez dejà postuler à cet offre", 500);
      return next(error);
    }
  }

  try {
    existingCondidat.offres.push(existingOffre);
    await existingCondidat.save();
    existingOffre.condidats.push(existingCondidat);
    await existingOffre.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!", 500);
    return next(error);
  }

  res.status(201).json({
    existingCondidat: existingCondidat,
  });
};

const convocationEntretient = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const { date, entrepriseId } = req.body;
  const id = req.params.id;

  let existingUser;
  try {
    existingUser = await condidat.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  let existingEntreprise;
  try {
    existingEntreprise = await entreprise.findById(entrepriseId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  console.log(date);
  console.log(existingUser.email);
  console.log(existingEntreprise.nom_entreprise);

  let mailOptions = {
    from: "jmaiiasma2021@gmail.com", // TODO: email sender
    to: existingUser.email, // TODO: email receiver
    subject: "Convocation pour entretient",
    text:
      "La societe" +
      existingEntreprise.nom_entreprise +
      " vous invite a passer un entretient le  " +
      date,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ Condidat: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getCondidat = getCondidat;
exports.getCondidatById = getCondidatById;
exports.updateCondidat = updateCondidat;
exports.deletecondidat = deletecondidat;
exports.getCondidatByOffreId = getCondidatByOffreId;
exports.postulerOffre = postulerOffre;
exports.convocationEntretient = convocationEntretient;
