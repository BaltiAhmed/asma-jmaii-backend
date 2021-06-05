const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const entrepriseSchema = new schema({
    nom:{type:String,required:true},
    nom_entreprise:{type:String,required:true},
    site_web:{type:String,required:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    image:{type:String,required:true},
    description:{type:String,required:true},
    secteur:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    offres:[{type:mongoose.Types.ObjectId,required:true,ref:'offre'}]


})

entrepriseSchema.plugin(uniqueValidator)

module.exports = mongoose.model('entreprise',entrepriseSchema)