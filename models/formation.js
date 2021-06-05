const mongoose =require("mongoose")
const schema = mongoose.Schema;

const FormationSchema = new schema({
    nom_deplome:{type:String,required:true},
    etablissement:{type:String,required:true},
    ville:{type:String,required:true},
    A_debut:{type:String,required:true},
    A_fin:{type:String,required:true},
    description:{type:String,required:true}
})


module.exports = mongoose.model('formation',FormationSchema)