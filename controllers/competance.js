const httpError = require("../models/error");

const competance = require("../models/competance");
const condidat = require("../models/condidat");

const { validationResult } = require("express-validator");

const ajoutCompetance= async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { titre, niveau, condidatId } = req.body;

  const createdCompetance = new competance({
    titre,
    niveau,
   
  });

  let existingCondidat;
  try {
    existingCondidat = await condidat.findById(condidatId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }
  console.log(createdCompetance);
  console.log(existingCondidat);

  try {
    await createdCompetance.save();
    existingCondidat.competences.push(createdCompetance);
    await existingCondidat.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!", 500);
    return next(error);
  }

  res.status(201).json({
    createdCompetance: createdCompetance,
  });
};

const getCompetanceById = async (req, res, next) => {
  const id = req.params.id;
  let existingcompetance;
  try {
    existingcompetance = await competance.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ competance: existingcompetance });
};

const getCompetance = async (req, res, next) => {
  let existingcompetance;
  try {
    existingcompetance = await competance.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ competance: existingcompetance });
};

const updateCompetance = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    titre,
    niveau,
    condidatId,
  } = req.body;

  const id = req.params.id;
  let existingcompetance;
  try {
    existingcompetance = await competance.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingcompetance.titre = titre;
  existingcompetance.niveau = niveau;

  try {
    existingcompetance.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ competance: existingcompetance });
};

const deleteCompetance = async (req, res, next) => {
  const id = req.params.id;
  let existingcompetance;

  try {
    existingcompetance = await competance.findById(id);
  } catch {
    const error = new httpError("failed !!", 500);
    return next(error);
  }
  if (!existingcompetance) {
    return next(new httpError("competance does not exist", 500));
  }
  try {
    existingcompetance.remove();
  } catch {
    return next(new httpError("failed !!", 500));
  }

  res.status(200).json({ message: "deleted" });
};

const getCompetenceByCondidatId = async (req, res, next) => {
  const id = req.params.id;

  let existingcompetance;
  try {
    existingcompetance = await condidat.findById(id).populate("competences");
  } catch (err) {
    const error = new httpError(
      "Fetching competence failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingcompetance || existingcompetance.competences.length === 0) {
    return next(
      new httpError("Could not find  for the provided user id.", 404)
    );
  }

  res.json({
    competences: existingcompetance.competences.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

exports.ajoutCompetance = ajoutCompetance;
exports.getCompetanceById = getCompetanceById;
exports.updateCompetance = updateCompetance;
exports.deleteCompetance = deleteCompetance;
exports.getCompetance = getCompetance;
exports.getCompetenceByCondidatId = getCompetenceByCondidatId
