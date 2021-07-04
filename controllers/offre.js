const httpError = require("../models/error");

const offre = require("../models/offre");
const entreprise = require("../models/entreprise");

const { validationResult } = require("express-validator");

const ajoutOffre = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    titre,
    Ddebut,
    Dfin,
    mission,
    Aprincipale,
    description,
    entrepriseId,
  } = req.body;

  const createdOffre = new offre({
    entrepriseId,
    titre,
    Ddebut,
    Dfin,
    mission,
    Aprincipale,
    description,
    condidats:[]
  });

  let existingEntreprise;
  try {
    existingEntreprise = await entreprise.findById(entrepriseId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  try {
    await createdOffre.save();
    existingEntreprise.offres.push(createdOffre);
    await existingEntreprise.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!", 500);
    return next(error);
  }

  res.status(201).json({
    createdOffre: createdOffre,
  });
};

const getOffreById = async (req, res, next) => {
  const id = req.params.id;
  let existingoffre;
  try {
    existingoffre = await offre.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ offre: existingoffre });
};

const getOffre = async (req, res, next) => {
  let existingoffre;
  try {
    existingoffre = await offre.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ offre: existingoffre });
};

const updateOffre = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    titre,
    Ddebut,
    Dfin,
    mission,
    Aprincipale,
    description,
    entrepriseId,
  } = req.body;

  const id = req.params.id;
  let existingoffre;
  try {
    existingoffre = await offre.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingoffre.titre = titre;
  existingoffre.Ddebut = Ddebut;
  existingoffre.Dfin = Dfin;
  existingoffre.mission = mission;
  existingoffre.Aprincipale = Aprincipale;
  existingoffre.description = description;

  try {
    existingoffre.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ offre: existingoffre });
};

const deleteOffre = async (req, res, next) => {
  const id = req.params.id;
  let existingoffre;

  try {
    existingoffre = await offre.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingoffre) {
    return next(new httpError("offre does not exist", 500));
  }
  try {
    existingoffre.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

const getOffreByUserId = async (req, res, next) => {
  const id = req.params.id;

  let existingOffre;
  try {
    existingOffre = await entreprise.findById(id).populate('offres');
  } catch (err) {
    const error = new httpError(
      'Fetching failed !!!',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!existingOffre || existingOffre.offres.length === 0) {
    return next(
      new httpError('Could not find offre for the provided user id.', 404)
    );
  }

  res.json({
    offre: existingOffre.offres.map(item =>
      item.toObject({ getters: true })
    ),image:existingOffre.image
  });
};

const getAllOffreByUserId = async (req, res, next) => {
  const id = req.params.id;

  let existingOffre;
  try {
    existingOffre = await entreprise.find().populate('offres');
  } catch (err) {
    const error = new httpError(
      'Fetching failed !!!',
      500
    );
    return next(error);
  }

  if (!existingOffre || existingOffre.offres.length === 0) {
    return next(
      new httpError('Could not find offre for the provided user id.', 404)
    );
  }

  res.json({
    offre: existingOffre.offres.map(item =>
      item.toObject({ getters: true }),
      existingOffre.image
    ),image:existingOffre.image
  });
};

exports.ajoutOffre = ajoutOffre;
exports.getOffreById = getOffreById;
exports.updateOffre = updateOffre;
exports.deleteOffre = deleteOffre;
exports.getOffre = getOffre;
exports.getOffreByUserId = getOffreByUserId
exports.getAllOffreByUserId = getAllOffreByUserId
