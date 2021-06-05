const mongoose =require("mongoose")
const schema = mongoose.Schema;

const ExperienceSchema = new schema({
    poste:{type:String,required:true},
    employeur:{type:String,required:true},
    ville:{type:String,required:true},
    Ddebut:{type:String,required:true},
    Dfin:{type:String,required:true},
    description:{type:String,required:true}
})
module.exports = mongoose.model('experience',ExperienceSchema)