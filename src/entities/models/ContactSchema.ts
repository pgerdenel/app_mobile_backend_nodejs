import mongoose from 'mongoose';

let _DataContactSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    sujet: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 255
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true,timestamps: true, collection: 'datacontact'});

export const getAllContact= function() {
    return ContactSchema.find();
};
export const saveContact= function(email:string, sujet:string, message:string) {
    return new ContactSchema({
        email:email,
        sujet:sujet,
        message:message,
    }).save();
};

export const delContact= function(id:Number) {
    return ContactSchema.deleteOne({_id: id});
};

export const ContactSchema = mongoose.model('datacontact', _DataContactSchema);
