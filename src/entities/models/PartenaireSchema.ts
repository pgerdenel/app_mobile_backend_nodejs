import mongoose from 'mongoose';

let _PartenaireSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true,timestamps: true, collection: 'partenaire'});

export const savePart= async function (type: String, nom: String) {
    return new PartenaireSchema({type: type, nom: nom}).save();
};
export const updatePart= function(id:String, type:String, nom:String) {
    return PartenaireSchema.findOneAndUpdate({_id: id}, {"$set": {type:type, nom:nom}});
};
export const getAllPart= function() {
    return PartenaireSchema.find();
};
// Ne renvoie que les partenaires Particulier
export const getAllPartPart= function() {
    return PartenaireSchema.find({ "type": 'part' });
};
// Ne renvoie que les partenaires collectivitées
export const getAllPartCol= function() {
    return PartenaireSchema.find({ "type": 'col' });
};
export const delPart= function(id:Number) {
    return PartenaireSchema.deleteOne({_id: id});
};
export const checkPartExist = function(type:String, nom:String) {
  //return PartenaireSchema.find( {type:type, nom:nom});
    return PartenaireSchema.countDocuments({type:type, nom:nom});
};

export const PartenaireSchema = mongoose.model('partenaire', _PartenaireSchema);
