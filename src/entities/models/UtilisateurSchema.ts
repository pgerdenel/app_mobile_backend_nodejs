import mongoose from 'mongoose';

let _UtilisateurSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {     // ids des users qui ont répondu
        type: String,
        required: true
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true,timestamps: true, collection: 'utilisateur'});

export const UtilisateurSchema = mongoose.model('utilisateur', _UtilisateurSchema);
