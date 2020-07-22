import mongoose from 'mongoose';
// view_name : 1 gallery | 2 : actu | 3:prez | 4:home | 5:service
let _ImageSchema = new mongoose.Schema({

    view_name: {
        type: String,
        required: true
    },
    list_img: {
        type: Array,
        required: true
    },
    single: {
        type: Boolean,
        default: false,
        required: true
    },
    date: {
        type:Date,
        default: Date.now
    },

}, {autoCreate:true,timestamps: true, collection: 'image'});

export const saveImage= async function(view_name:String, list_img:String[], single:boolean) {
    return new ImageSchema({
        view_name: view_name,
        list_img: list_img,
        single: single
    }).save();
};
export const getAllImageType= function() {
    return ImageSchema.find().sort('view_name').select('view_name').select('list_img').select('single');
};
export const getAllImageGallery= function() {
    return ImageSchema.find({view_name:"1"}).select('view_name').select('list_img').select('single');
};
// HOME
export const getImage_ViewHome= function() {
    return ImageSchema.find({view_name: "4", }).select('list_img');
};
// PREZ
export const getImage_ViewPrez= function() {
    return ImageSchema.find({view_name: "3"}).select('list_img');
};
export const UpdateImage_ViewPrez= function(url:string) {
    return ImageSchema.updateOne({view_name: "3"}, { $set: { list_img: url } } );
};
/* Supprime une image d'une des collections portant l'url mentionné
 * on vérifier que l'image existe dans le tab list_img de l'id
 * on supprime l'url correspondant dans ce tableau
 */
export const deleteImage= function(id:string, url:string) {
    return ImageSchema.updateOne({_id: id}, { $pull: { list_img: url } } );
};
/* Met à jour l'url d'une image home (supprime l'ancien et ajoute le nouveau) */
export const update_url_img_home= async function(id:string, old_url:string, new_url:string) {
    return Promise.all([
        ImageSchema.updateOne({_id: id}, {$pull: { list_img: old_url }}),
        ImageSchema.updateOne({_id: id}, {$push: { list_img: new_url } })
    ])
        .then((result: any) => {
        //console.log("result save promise all= "+result);
        console.log("Success Promise All update_url_img_home = $pull and $push are ok "/*+result*/);
    }).catch((error: any) => {
        console.error("Fails Promise All update_url_img_home = " + error);
    });
};
export const update_url_img_prez= async function(id:string, old_url:string, new_url:string) {
    return Promise.all([
        ImageSchema.updateOne({_id: id}, { $pull: { list_img: old_url }}),
        ImageSchema.updateOne({_id: id}, {$push: { list_img: new_url } })
    ]).then((result: any) => {
        //console.log("result save promise all= "+result);
        console.log("Success Promise All update_url_img_prez = $pull and $push are ok "/*+result*/);
    }).catch((error: any) => {
        console.error("Fails Promise All update_url_img_prez = " + error);
    });
};
export const update_url_img_actu= async function(id:string, old_url:string, new_url:string) {
    return Promise.all([
        ImageSchema.updateOne({_id: id}, { $pull: { list_img: old_url }}),
        ImageSchema.updateOne({_id: id}, {$push: { list_img: new_url } })
    ]).then((result: any) => {
        //console.log("result save promise all= "+result);
        console.log("Success Promise All update_url_img_actu = $pull and $push are ok "/*+result*/);
    }).catch((error: any) => {
        console.error("Fails Promise All update_url_img_actu = " + error);
    });
};
export const update_url_img_gallery= async function(id:string, old_url:string, new_url:string) {
    return Promise.all([
        ImageSchema.updateOne({_id: id}, { $pull: { list_img: old_url }}),
        ImageSchema.updateOne({_id: id}, {$push: { list_img: new_url } })
    ]).then((result: any) => {
        //console.log("result save promise all= "+result);
        console.log("Success Promise All update_url_img_gallery = $pull and $push are ok "/*+result*/);
    }).catch((error: any) => {
        console.error("Fails Promise All update_url_img_gallery = " + error);
    });
};
export const ImageSchema = mongoose.model('image', _ImageSchema);
