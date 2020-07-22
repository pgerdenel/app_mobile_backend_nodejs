import {OK} from "http-status-codes";
import {all_host_endpoint, paths_public_folder, result_error, result_ok} from "@shared/constants";
import { Request, Response, NextFunction } from 'express';
import {
    deleteImage, getAllImageGallery,
    getAllImageType, update_url_img_actu,
    update_url_img_gallery,
    update_url_img_home,
    update_url_img_prez
} from "@entities/models/ImageSchema";
import {deleteFile, getListFiles} from "@shared/functions";

const get_all_images = async function (req: Request, res: Response, next:NextFunction) {
    console.log("get_all_images called ");
    /*let file_list_gallery : String[] = await getListFiles('../public/media/imgs/gallery', 1);
   console.log("file_list = "+JSON.stringify(file_list_gallery));
   let file_list_actu : String[] = await getListFiles('../public/media/imgs/actu', 2);
   console.log("file_list = "+JSON.stringify(file_list_actu));
   let file_list_prez : String[] = await getListFiles('../public/media/imgs/prez', 3);
   console.log("file_list = "+JSON.stringify(file_list_prez));
   let file_list_home : String[] = await getListFiles('../public/media/imgs/home', 4);
   console.log("file_list = "+JSON.stringify(file_list_home));
   let file_list = file_list_gallery.concat(file_list_prez.concat(file_list_home.concat(file_list_actu)));*/
    getAllImageType()
        .then((result) => {
            //console.log("getAllActu ok "+result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllActu erro "+error);
            return res.status(404).send(result_error);
        });
    //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
    /*res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(file_list);*/
};
const get_all_images_gallery = async function (req: Request, res: Response, next:NextFunction) {
    console.log("get_all_images_gallery called ");
    /*let file_list_gallery : String[] = await getListFiles('../public/media/imgs/gallery', 1);
    console.log("file_list = "+JSON.stringify(file_list_gallery));
    //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(file_list_gallery);*/
    getAllImageGallery()
        .then((result) => {
            //console.log("getAllImageGallery ok "+result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllImageGallery erro "+error);
            return res.status(404).send(result_error);
        });
};
const get_all_images_actu = async function (req: Request, res: Response, next:NextFunction) {
    console.log("get_all_images_actu called ");
    let file_list_actu : String[] = await getListFiles('../public/media/imgs/actu', 2);
    console.log("file_list = "+JSON.stringify(file_list_actu));
    //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/actu");
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(file_list_actu);
};
const get_all_images_prez = async function (req: Request, res: Response, next:NextFunction) {
    console.log("get_all_images_prez called ");
    let file_list_prez : String[] = await getListFiles('../public/media/imgs/prez', 3);
    //console.log("file_list = "+JSON.stringify(file_list_prez));
    //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/prez");
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(file_list_prez);
};
const get_all_images_home = async function (req: Request, res: Response, next:NextFunction) {
    console.log("get_all_images_home called ");
    let file_list_home : String[] = await getListFiles('../public/media/imgs/home', 4);
    //console.log("file_list = "+JSON.stringify(file_list_home));

    //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/home");
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(file_list_home);
};
const delete_image = async function (req: Request, res: Response, next:NextFunction) {
    try {
        console.log("/iamge/delete called");
        console.log("param id =" + req.body.id + "\nparam url= " + req.body.url);
        await deleteImage(req.body.id, req.body.url);

        // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/actu/1.png
        let old_img_file_name = (req.body.url).substring((req.body.url).lastIndexOf('/') + 1);
        let type_url = ((req.body.url).includes('/gallery')) ? paths_public_folder.imgs_gallery : ((req.body.url).includes('/actu')) ? paths_public_folder.imgs_actu : ((req.body.url).includes('/prez')) ? paths_public_folder.imgs_prez : ((req.body.url).includes('/home')) ? paths_public_folder.imgs_home : "undefined";
        console.log("type_url");
        let old_img_full_file_path = (type_url + old_img_file_name);
        let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
        console.log("old_file_name= " + old_img_file_name);
        console.log("old_img_full_file_path= " + old_img_full_file_path);
        console.log("old_img_full_file_path_formatted= " + old_img_full_file_path_formatted);

        await deleteFile(old_img_full_file_path_formatted);

        console.log("delete_image success");
        return res.status(OK).send(result_ok);
    }
    catch(error) {
        console.error("error delete_image= "+error);
        return res.status(404).json(result_error);
    }

};
const upload_home = async function (req: Request, res: Response, next:NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(result_ok);
};
const upload_prez = async function (req: Request, res: Response, next:NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(result_ok);
};
const upload_gallery = async function (req: Request, res: Response, next:NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(result_ok);
};
const upload_actu = async function (req: Request, res: Response, next:NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(OK).json(result_ok);
};

const upload_and_update_image_home = async function (req: Request, res: Response, next:NextFunction) {
    try {
        console.log('########################################################################################!');
        console.log("/image/upload_and_update_image_home : request = " + JSON.stringify(req.body));

        //console.log("file= "+file);
        console.log("id= " + req.body.id);
        console.log("id= " + req.body.view_name);
        console.log("url_img= " + req.body.url_img);

        // on créer son url si l'image existe
        if (req['file']) {
            let file_uploaded = req['file'];
            console.log("upload_and_update_image_home url file handling" + JSON.stringify(file_uploaded));
            let url = all_host_endpoint.endpoint_home + file_uploaded.filename;

            // on met à jour l'url dans la bdd à la place de l'ancien url de l'image portant l'id
            await update_url_img_home(req.body.id, req.body.url_img, url);

            // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/actu/1.png
            let old_img_file_name = (req.body.url_img).substring((req.body.url_img).lastIndexOf('/') + 1);
            let old_img_full_file_path = (paths_public_folder.imgs_home+old_img_file_name);
            let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
            console.log("old_file_name= "+old_img_file_name);
            console.log("old_img_full_file_path= "+old_img_full_file_path);
            console.log("old_img_full_file_path_formatted= "+old_img_full_file_path_formatted);
            await deleteFile(old_img_full_file_path_formatted);

            console.log("replaced image for home handled");
            return res.status(OK).send({"state":"ok", "data":{"new_url":url, "id":req.body.id, "view_name":"4"}});
        }
        else {
            console.error("no file here, multer did not upload ... ");
            return res.status(404).send(result_error);
        }
    }
    catch (error) {
        console.error("error upload_and_update_image_home= "+error);
        return res.status(404).json(result_error);
    }
};
const upload_and_update_image_prez = async function (req: Request, res: Response, next:NextFunction) {
    try {
        console.log("/image/upload_and_update_image_prez : request = " + JSON.stringify(req.body));

        //console.log("file= "+file);
        console.log("id= " + req.body.id);
        console.log("id= " + req.body.view_name);
        console.log("url_img= " + req.body.url_img);

        // on créer son url
        if (req['file']) {
            let file_uploaded = req['file'];
            console.log("upload_and_update_image_prez url file handling" + JSON.stringify(file_uploaded));
            let url = all_host_endpoint.endpoint_prez + file_uploaded.filename;

            // on met à jour l'url dans la bdd à la place de l'ancien url de l'image portant l'id
            await update_url_img_prez(req.body.id, req.body.url_img, url);

            // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/prez/1.png
            let old_img_file_name = (req.body.url_img).substring((req.body.url_img).lastIndexOf('/') + 1);
            let old_img_full_file_path = (paths_public_folder.imgs_prez+old_img_file_name);
            let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
            console.log("old_file_name= "+old_img_file_name);
            console.log("old_img_full_file_path= "+old_img_full_file_path);
            console.log("old_img_full_file_path_formatted= "+old_img_full_file_path_formatted);
            await deleteFile(old_img_full_file_path_formatted);

            console.log("replaced image for home handled");
            return res.status(OK).send({"state":"ok", "data":{"new_url":url, "id":req.body.id, "view_name":"3"}});
        }
        else {
            console.error("no file here, multer did not upload ... ");
            return res.status(404).send(result_error);
        }
    }
    catch (error) {
        console.error("error upload_and_update_image_home= "+error);
        return res.status(404).json(result_error);
    }
};
const upload_and_update_image_gallery = async function (req: Request, res: Response, next:NextFunction) {
    try {
        console.log("/image/upload_and_update_image_gallery : request = " + JSON.stringify(req.body));

        //console.log("file= "+file);
        console.log("id= " + req.body.id);
        console.log("id= " + req.body.view_name);
        console.log("url_img= " + req.body.url_img);

        // on créer son url
        if (req['file']) {
            let file_uploaded = req['file'];
            console.log("upload_and_update_image_gallery url file handling" + JSON.stringify(file_uploaded));
            let url = all_host_endpoint.endpoint_gallery + file_uploaded.filename;

            // on met à jour l'url dans la bdd à la place de l'ancien url de l'image portant l'id
            let a = await update_url_img_gallery(req.body.id, req.body.url_img, url);
            console.log("result update_url_img_gallery= "+JSON.stringify(a));
            // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/prez/1.png
            let old_img_file_name = (req.body.url_img).substring((req.body.url_img).lastIndexOf('/') + 1);
            let old_img_full_file_path = (paths_public_folder.imgs_gallery+old_img_file_name);
            let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
            console.log("old_file_name= "+old_img_file_name);
            console.log("old_img_full_file_path= "+old_img_full_file_path);
            console.log("old_img_full_file_path_formatted= "+old_img_full_file_path_formatted);
            await deleteFile(old_img_full_file_path_formatted);

            console.log("replaced image for gallery handled");
            return res.status(OK).send({"state":"ok", "data":{"new_url":url, "id":req.body.id, "view_name":"1"}});
        }
        else {
            console.error("no file here, multer did not upload ... ");
            return res.status(404).send(result_error);
        }
    }
    catch (error) {
        console.error("error upload_and_update_image_gallery= "+error);
        return res.status(404).json(result_error);
    }
};
const upload_and_update_image_actu = async function (req: Request, res: Response, next:NextFunction) {
    try {
        console.log("/image/upload_and_update_image_actu : request = " + JSON.stringify(req.body));

        //console.log("file= "+file);
        console.log("id= " + req.body.id);
        console.log("id= " + req.body.view_name);
        console.log("url_img= " + req.body.url_img);

        // on créer son url
        if (req['file']) {
            let file_uploaded = req['file'];
            console.log("upload_and_update_image_actu url file handling" + JSON.stringify(file_uploaded));
            let url = all_host_endpoint.endpoint_actu + file_uploaded.filename;

            // on met à jour l'url dans la bdd à la place de l'ancien url de l'image portant l'id
            await update_url_img_actu(req.body.id, req.body.url_img, url);

            // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/prez/1.png
            let old_img_file_name = (req.body.url_img).substring((req.body.url_img).lastIndexOf('/') + 1);
            let old_img_full_file_path = (paths_public_folder.imgs_actu+old_img_file_name);
            let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
            console.log("old_file_name= "+old_img_file_name);
            console.log("old_img_full_file_path= "+old_img_full_file_path);
            console.log("old_img_full_file_path_formatted= "+old_img_full_file_path_formatted);
            await deleteFile(old_img_full_file_path_formatted);

            console.log("replaced image for actu handled");
            return res.status(OK).send({"state":"ok", "data":{"new_url":url, "id":req.body.id, "view_name":"2"}});
        }
        else {
            console.error("no file here, multer did not upload ... ");
            return res.status(404).send(result_error);
        }
    }
    catch (error) {
        console.error("error upload_and_update_image_actu= "+error);
        return res.status(404).json(result_error);
    }
};


module.exports = {
    get_all_images: get_all_images,
    get_all_images_gallery:get_all_images_gallery,
    get_all_images_actu:get_all_images_actu,
    get_all_images_prez:get_all_images_prez,
    get_all_images_home:get_all_images_home,
    delete_image:delete_image,
    upload_home:upload_home,
    upload_prez:upload_prez,
    upload_gallery:upload_gallery,
    upload_actu:upload_actu,
    upload_and_update_image_home:upload_and_update_image_home,
    upload_and_update_image_prez:upload_and_update_image_prez,
    upload_and_update_image_gallery:upload_and_update_image_gallery,
    upload_and_update_image_actu:upload_and_update_image_actu,

};
