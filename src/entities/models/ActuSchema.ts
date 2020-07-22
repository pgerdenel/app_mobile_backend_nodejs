import mongoose from 'mongoose';

let _ActuSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
        minlength : 4,
        maxlength : 25
    },
    nom_edifice: {
        type: String,
        required: true,
        minlength : 4,
        maxlength : 30
    },
    cp: { // code postal
        type: String,
        required: true,
        minlength : 0,
        maxlength : 20
    },
    ville: {
        type: String,
        required: true,
        minlength : 0,
        maxlength : 30
    },
    head: { // données d'en tête de l'actu
        type: String,
        required: true,
        minlength : 4,
        maxlength : 50
    },
    content: { // code postal
        type: String,
        required: true,
        minlength : 4,
        maxlength : 170
    },
    mm: { // montant_marche
        type: String,
        required: true,
        minlength : 4,
        maxlength : 25
    },
    duree: {
        type: String,
        required: true,
        minlength : 4,
        maxlength : 25
    },
    img: { // url de l'image
        type: String,
        required: true,
        minlength : 4,
        maxlength : 100
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true, timestamps: true, collection: 'actu'});

export const saveActu= async function(type:String, nom_edifice:String, cp:String, ville:String, head:String, content:String, mm:String, duree:String, img:String) {
        return new ActuSchema({
            type: type,
            nom_edifice: nom_edifice,
            cp: cp,
            ville: ville,
            head: head,
            content: content,
            mm: mm,
            duree: duree,
            img: img,
        }).save();
};
export const updateActu= function(id:String, type:String, nom_edifice:String, cp:String, ville:String, head:String, content:String, mm:String, duree:String, img:String) {
    return ActuSchema.findOneAndUpdate({_id: id}, {"$set": {type:type, nom_edifice:nom_edifice, cp:cp, ville:ville, head:head, content:content, mm:mm, duree:duree, img:img}});
};
export const getAllActu= function() {
    return ActuSchema.find();
};
export const getOneActu= function(id:String) {
    return ActuSchema.findOne({_id: id});
};
export const delActu= function(id:Number) {
    return ActuSchema.deleteOne({_id: id});
};
export const getImageOfActu = function(id:Number) {
    return ActuSchema.findOne({_id:id}).select("img");
};
export const ActuSchema = mongoose.model('actu', _ActuSchema);
