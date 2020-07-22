import mongoose from 'mongoose';
import {ActuSchema} from "@entities/models/ActuSchema";
// view_name : 1 gallery | 2 : actu | 3:prez | 4:home | 5:service
let _DataViewSchema = new mongoose.Schema({

    view_name: {
        type: String,
        required: true,
    },
    label_name: {  
        type: String,
        required: true,
        minlength:3,
        maxlength: 50
    },
    label_data: {
        type: String,
        required: true,
        minlength:3,
        maxlength: 140
    },
    place_hierarchie : {
        type: Number,
        required:false,
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true,timestamps: true, collection: 'dataview'});

export const saveDataView= function(view_name:String, label_name:String, label_data:String, place_hierarchie:Number) {
    return new DataViewSchema({
        view_name: view_name,
        label_name: label_name,
        label_data: label_data,
        place_hierarchie: place_hierarchie
    }).save();
};
export const getAllView= function() {
    return DataViewSchema.find();
};
export const delView= function(id:Number) {
    return ActuSchema.deleteOne({_id: id});
};

/* HOME */
export const getPhrase_ViewHome= function() {
    return DataViewSchema.find({view_name: "4", }).select('label_data');
};
export const updatePhrase_ViewHome= function(phrase) {
    return DataViewSchema.updateOne({view_name: "4"}, {$set:{"label_data":phrase}});
};


/* PREZ */
// renvoie la liste de tous les labels prez
export const getAllLabelsPrez= function() {
    return DataViewSchema.find({view_name: "3", }).select('label_name');
};
// renvoie la données d'un label prez en particulier
export const getDataFromLabelPrez= function(id:string) {
    return DataViewSchema.find({_id: id}).select('label_data');
};
// renvoie toutes les données des labels prez
export const getAllDataPrez= function() {
    return DataViewSchema.find({view_name: "3", }).select('label_data').select('label_name').select('place_hierarchie');
};
export const updateLabelAndData_ViewPrez = function(id, label_name, label_data) {
    return DataViewSchema.updateOne({_id: id }, {$set:{"label_name":label_name, "label_data":label_data}});
};
export const updateLabelAndData_ViewSvc = function(id, label_name, label_data) {
    return DataViewSchema.updateOne({_id: id }, {$set:{"label_name":label_name, "label_data":label_data}});
};

/* SVC */
// renvoie la liste de tous les labels svc
export const getAllLabelsSvc= function() {
    return DataViewSchema.find({view_name: "5", }).select('label_name');
};
// renvoie la données d'un label svc en particulier
export const getDataFromLabelSvc= function(id:string) {
    return DataViewSchema.find({_id: id}).select('label_data');
};
// renvoie toutes les données des labels svc
export const getAllDataSvc= function() {
    return DataViewSchema.find({view_name: "5", }).select('label_data').select('label_name');
};




export const DataViewSchema = mongoose.model('dataview', _DataViewSchema);
