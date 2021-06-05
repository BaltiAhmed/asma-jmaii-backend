const mongoose =require("mongoose")
const schema = mongoose.Schema;

const competanceSchema = new schema({
    titre:{type:String,required:true},
    niveau:{type:String,required:true},
    
})


module.exports = mongoose.model('',competanceSchema)