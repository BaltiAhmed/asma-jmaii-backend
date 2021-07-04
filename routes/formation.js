const express = require("express");
const route = express.Router();

const formationControllers = require("../controllers/formation");

const { check } = require("express-validator");

route.post(
  "/ajout",
  check("nom_deplome").not().isEmpty(),
  check("etablissement").not().isEmpty(),
  check("ville").not().isEmpty(),
  check("A_debut").not().isEmpty(),
  check("A_fin").not().isEmpty(),
  check("description").not().isEmpty(),
  formationControllers.ajoutFormation
);

route.get("/", formationControllers.getFormation);
route.get("/codidat/:id", formationControllers.getFormationByCondidatId);
route.get("/:id", formationControllers.getFormationById);

route.patch(
  "/:id",
  check("nom_deplome").not().isEmpty(),
  check("etablissement").not().isEmpty(),
  check("ville").not().isEmpty(),
  check("A_debut").not().isEmpty(),
  check("A_fin").not().isEmpty(),
  check("description").not().isEmpty(),
  formationControllers.updateFormation
);

route.delete("/:id", formationControllers.deleteFormation);

module.exports = route;
