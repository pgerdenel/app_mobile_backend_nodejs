import {delActu, getAllActu, getImageOfActu, getOneActu, saveActu, updateActu} from "@entities/models/ActuSchema";
import {OK} from "http-status-codes";
import {all_host_endpoint, paths_public_folder, result_error, result_ok} from "@shared/constants";
import { Request, Response, NextFunction } from 'express';
import {deleteFile} from "@shared/functions";

const create_actu = async function (req: Request, res: Response, next:NextFunction) {
    try {
        if (req['file']) {
            let file_uploaded = req['file'];
            console.log("file handled for this actu " + JSON.stringify(file_uploaded));
            let url = all_host_endpoint.endpoint_actu + file_uploaded.filename;
            await saveActu(req.body.type, req.body.nom, req.body.cp, req.body.ville, req.body.head, req.body.content, req.body.mm, req.body.duree, url);
            return res.status(OK).json(result_ok);
        }
        else {
            console.log("body= "+JSON.stringify(req.body));
            console.log("any file handled for this actu");
            let url = all_host_endpoint.img_defaut;
            console.log("url= " + url);
            await saveActu(req.body.actu.type, req.body.actu.nom, req.body.actu.cp, req.body.actu.ville, req.body.actu.head, req.body.actu.content, req.body.actu.mm, req.body.actu.duree, url);
            return res.status(OK).json(result_ok);
        }
    }
    catch (error) {
        console.error("error here= "+error);
        return res.status(404).json(result_error);
    }
};
const get_one_actu = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/one called : request = "+JSON.stringify(req.query.id));
    getOneActu(<String>req.query.id)
        .then((result) => {
            //console.log("getOneActu ok " + result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getOneActu erro " + error);
            return res.status(404).send(result_error);
        });
};
const get_all_actu = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/all called : request = "+JSON.stringify(req.body));
    getAllActu()
        .then((result) => {
            //console.log("getAllActu ok " + result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllActu erro " + error);
            return res.status(404).send(result_error);
        });
};
const delete_one_actu = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/delete called : request = "+JSON.stringify(req.body));
    try {
        // on récupère l'image de l'actu
        let img_url_to_del = await getImageOfActu(req.body.id);
        // @ts-ignore
        console.log("img_url_to_del= " + img_url_to_del.img);
        // on supprime le fichier correspondant à l'ancienne image en récupérant son nom de fichier depuis l'ancienne urlurl_value= https://127.0.0.1:3000/media/imgs/actu/1.png
        // @ts-ignore
        let old_img_file_name = img_url_to_del.img.substring(img_url_to_del.img.lastIndexOf('/') + 1);
        let type_url = paths_public_folder.imgs_actu;
        console.log("type_url");
        let old_img_full_file_path = (type_url + old_img_file_name);
        let old_img_full_file_path_formatted = old_img_full_file_path.substring(2, old_img_full_file_path.length); //enlèeve le ./ au début du fichier
        console.log("old_file_name= " + old_img_file_name);
        console.log("old_img_full_file_path= " + old_img_full_file_path);
        console.log("old_img_full_file_path_formatted= " + old_img_full_file_path_formatted);

    await deleteFile(old_img_full_file_path_formatted);
    }
    catch(error) {
        console.error("l'url de l'image ne doit pas être défini et la suppression de l'image à échoué "+error);
    }

    // on la supprime
    delActu(req.body.id)
        .then((result) => {
            //console.log("delActu ok "+result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).send(result_ok);
        })
        .catch((error) => {
            console.error("delActu erro "+error);
            return res.status(404).send(result_error);
        });
};
const update_actu = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/update called : request = "+JSON.stringify(req.body));
    updateActu(req.body.actu.id, req.body.actu.type, req.body.actu.nom_edifice, req.body.actu.cp, req.body.actu.ville, req.body.actu.head, req.body.actu.content, req.body.actu.mm, req.body.actu.duree, req.body.actu.img)
        .then((result) => {
            //console.log("updateActu ok "+result);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).send(result_ok);
        })
        .catch((error) => {
            console.error("updateActu erro "+error);
            return res.status(404).send(result_error);
        });
};

module.exports = {
    create_actu: create_actu,
    get_one_actu:get_one_actu,
    get_all_actu:get_all_actu,
    delete_one_actu:delete_one_actu,
    update_actu:update_actu

};
