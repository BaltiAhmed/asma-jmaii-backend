const mongoose =require("mongoose")
const schema = mongoose.Schema;

const OffreSchema = new schema({
    entrepriseId:{type:mongoose.Types.ObjectId,required:true,ref:'entreprise'},
    titre:{type:String,required:true},
    Ddebut:{type:String,required:true},
    Dfin:{type:String,required:true},
    mission:{type:String,required:true},
    Aprincipale:{type:String,required:true},
    description:{type:String,required:true},
    condidats:[{type:mongoose.Types.ObjectId,required:true,ref:'condidat'}]
})


module.exports = mongoose.model('offre',OffreSchema)