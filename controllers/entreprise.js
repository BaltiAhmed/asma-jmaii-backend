const httpError = require("../models/error");

const entreprise = require("../models/entreprise");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const {
    nom,
    nom_entreprise,
    site_web,
    tel,
    adresse,
    description,
    secteur,
    email,
    password,
  } = req.body;
  let existinguser;
  try {
    existinguser = await entreprise.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new entreprise({
    nom,
    nom_entreprise,
    site_web,
    tel,
    adresse,
    image: req.file.path,
    description,
    secteur,
    email,
    password,
    offres: [],
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

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
    entrepriseId: createduser.id,
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
    existingUser = await entreprise.findOne({ email: email });
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
  res.status(200).json({ entreprise: existingUser, token: token });
};

const getEntreprise = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await entreprise.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ entreprises: existingUser });
};

const getEntrepriseById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await entreprise.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ entreprise: existingUser });
};
const updateEntreprise = async (req, res, next) => {
  /* const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  } */

  const {
    nom,
    nom_entreprise,
    site_web,
    tel,
    adresse,
    description,
    secteur,
    email,
    password,
  } = req.body;
  const UserId = req.params.id;
  let existingUser;
  try {
    existingUser = await entreprise.findById(UserId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.nom = nom;
  existingUser.nom_entreprise = nom_entreprise;
  existingUser.site_web = site_web;
  existingUser.adresse = adresse;
  existingUser.description = description;
  existingUser.secteur = secteur;
  existingUser.email = email;
  existingUser.password = password;
  existingUser.tel = tel;
  existingUser.image = req.file.path;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingUser: existingUser });
};

const deleteEntreprise = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await entreprise.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingUser) {
    return next(new httpError("entreprise does not exist", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

exports.signup = signup;
exports.login = login;
exports.getEntreprise = getEntreprise;
exports.getEntrepriseById = getEntrepriseById;
exports.deleteEntreprise = deleteEntreprise;
exports.updateEntreprise = updateEntreprise;
