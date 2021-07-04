const httpError = require("../models/error");

const formation = require("../models/formation");
const condidat = require("../models/condidat");

const { validationResult } = require("express-validator");

const ajoutFormation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const {
    nom_deplome,
    etablissement,
    ville,
    A_debut,
    A_fin,
    description,
    condidatId,
  } = req.body;

  const createdFormation = new formation({
    nom_deplome,
    etablissement,
    ville,
    A_debut,
    A_fin,
    description,
  });

  let existingCondidat;
  try {
    existingCondidat = await condidat.findById(condidatId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  try {
    createdFormation.save();
    existingCondidat.formations.push(createdFormation);
    existingCondidat.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!", 500);
    return next(error);
  }

  res.status(201).json({
    createdFormation: createdFormation,
  });
};

const getFormationById = async (req, res, next) => {
  const id = req.params.id;
  let existingformation;
  try {
    existingformation = await formation.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ formation: existingformation });
};

const getFormation = async (req, res, next) => {
  let existingformation;
  try {
    existingformation = await formation.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ formation: existingformation });
};

const updateFormation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    nom_deplome,
    etablissement,
    ville,
    A_debut,
    A_fin,
    description,
  } = req.body;

  const id = req.params.id;
  let existingformation;
  try {
    existingformation = await formation.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingformation.nom_deplome = nom_deplome;
  existingformation.etablissement = etablissement;
  existingformation.ville = ville;
  existingformation.A_debut = A_debut;
  existingformation.A_fin = A_fin;
  existingformation.description = description;

  try {
    existingformation.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ formation: existingformation });
};

const deleteFormation = async (req, res, next) => {
  const id = req.params.id;
  let existingformation;

  try {
    existingformation = await formation.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingformation) {
    return next(new httpError("formation does not exist", 500));
  }
  try {
    existingformation.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

const getFormationByCondidatId = async (req, res, next) => {
  const id = req.params.id;

  let existingformation;
  try {
    existingformation = await condidat.findById(id).populate("formations");
  } catch (err) {
    const error = new httpError(
      "Fetching project failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingformation || existingformation.formations.length === 0) {
    return next(
      new httpError("Could not find  for the provided user id.", 404)
    );
  }

  res.json({
    formation: existingformation.formations.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

exports.ajoutFormation = ajoutFormation;
exports.getFormationById = getFormationById;
exports.updateFormation = updateFormation;
exports.deleteFormation = deleteFormation;
exports.getFormation = getFormation;
exports.getFormationByCondidatId = getFormationByCondidatId
