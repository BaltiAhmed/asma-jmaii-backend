const express = require("express");
const route = express.Router();

const condidatControllers = require("../controllers/condidat");

const { check } = require("express-validator");
const fileUpload = require("../middleware/file-uploads");

route.post(
  "/signup",
  check("name").not().isEmpty(),
  check("email").normalizeEmail(),
  condidatControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  condidatControllers.login
);

route.get("/", condidatControllers.getCondidat);

route.get("/:id", condidatControllers.getCondidatById);

route.patch(
  "/:id",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("sexe").not().isEmpty(),
    check("age").not().isEmpty(),
    check("dateNaissance").not().isEmpty(),
    check("email").normalizeEmail(),
  ],
  condidatControllers.updateCondidat
);

route.delete("/:id", condidatControllers.deletecondidat);

route.get("/offre/:id", condidatControllers.getCondidatByOffreId);

route.post("/postuler", condidatControllers.postulerOffre);
route.post("/convocation/:id", condidatControllers.convocationEntretient);

module.exports = route;
