const httpError = require("../models/error");

const experience = require("../models/experience");
const condidat = require("../models/condidat");

const { validationResult } = require("express-validator");

const ajoutExperience = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    poste,
    employeur,
    ville,
    Ddebut,
    Dfin,
    description,
    condidatId,
  } = req.body;

  const createdExperience = new experience({
    poste,
    employeur,
    ville,
    Ddebut,
    Dfin,
    description,
  });

  let existingCondidat;
  try {
    existingCondidat = await condidat.findById(condidatId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }
  console.log(createdExperience);
  console.log(existingCondidat);

  try {
    await createdExperience.save();
    existingCondidat.experiences.push(createdExperience);
    await existingCondidat.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!", 500);
    return next(error);
  }

  res.status(201).json({
    createdExperience: createdExperience,
  });
};

const getExperienceById = async (req, res, next) => {
  const id = req.params.id;
  let existingexperience;
  try {
    existingexperience = await experience.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ experience: existingexperience });
};

const getExperience = async (req, res, next) => {
  let existingexperience;
  try {
    existingexperience = await experience.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ experience: existingexperience });
};

const updateExperience = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    poste,
    employeur,
    ville,
    Ddebut,
    Dfin,
    description,
    condidatId,
  } = req.body;

  const id = req.params.id;
  let existingexperience;
  try {
    existingexperience = await experience.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingexperience.poste = poste;
  existingexperience.employeur = employeur;
  existingexperience.ville = ville;
  existingexperience.Ddebut = Ddebut;
  existingexperience.Dfin = Dfin;
  existingexperience.description = description;

  try {
    existingexperience.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingexperience: existingexperience });
};

const deleteExperience = async (req, res, next) => {
  const id = req.params.id;
  let existingexperience;

  try {
    existingexperience = await experience.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingexperience) {
    return next(new httpError("experience does not exist", 500));
  }
  try {
    existingexperience.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

exports.ajoutExperience = ajoutExperience;
exports.getExperienceById = getExperienceById;
exports.updateExperience = updateExperience;
exports.deleteExperience = deleteExperience;
exports.getExperience = getExperience;
