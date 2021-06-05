const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const condidatSchema = new schema({
  name: { type: String, required: true },
  etatcivil: { type: String },
  dateNaissance: { type: String },
  sexe: { type: String },
  age: { type: String },
  photo: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenght: 8 },
  competences: [
    { type: mongoose.Types.ObjectId, required: true, ref: "competence" },
  ],
  formations: [
    { type: mongoose.Types.ObjectId, required: true, ref: "formation" },
  ],
  experiences: [
    { type: mongoose.Types.ObjectId, required: true, ref: "experience" },
  ],
});

condidatSchema.plugin(uniqueValidator);

module.exports = mongoose.model("condidat", condidatSchema);
