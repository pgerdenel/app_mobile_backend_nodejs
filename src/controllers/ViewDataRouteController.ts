import {OK} from "http-status-codes";
import {all_host_endpoint, paths_public_folder, result_error, result_ok} from "@shared/constants";
import { Request, Response, NextFunction } from 'express';
import {
    deleteImage,
    getAllImageType,
    getImage_ViewHome,
    getImage_ViewPrez,
    UpdateImage_ViewPrez
} from "@entities/models/ImageSchema";
import {
    getAllDataPrez, getAllDataSvc,
    getAllLabelsPrez, getAllLabelsSvc,
    getAllView, getDataFromLabelPrez, getDataFromLabelSvc,
    getPhrase_ViewHome, updateLabelAndData_ViewPrez, updateLabelAndData_ViewSvc, updatePhrase_ViewHome
} from "@entities/models/DataViewSchema";

/* ALL */
const get_all_view = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/all called controller 'get_all_view");
    getAllView()
        .then((result) => {
            console.log("getAllView ok "+result);
            return res.status(OK).json(result);
    })
        .catch((error) => {
            console.log("getAllView erro "+error);
            return res.status(OK).send(result_error);
    });
};
const create_view_data = async function (req: Request, res: Response, next:NextFunction) {
    /*console.log("request = "+JSON.stringify(req.body));
    saveActu(req.body.actu.type, req.body.actu.nom, parseInt(req.body.actu.cp), req.body.actu.ville, req.body.actu.head, req.body.actu.content, parseInt(req.body.actu.mm), parseInt(req.body.actu.duree), req.body.actu.url)
        .then((result) => {
            console.log("save_actu ok "+result);
            return res.status(OK).send("ok");
        })
        .catch((error) => {
            console.log("save_actu erro "+error);
            return res.status(OK).send("error");
        });*/
};
const create_view_data_home = async function (req: Request, res: Response, next:NextFunction) {
    /*console.log("request = "+JSON.stringify(req.body));
    delActu(req.body.id)
        .then((result) => {
            console.log("delActu ok "+result);
            return res.status(OK).send("ok");
        })
        .catch((error) => {
            console.log("delActu erro "+error);
            return res.status(OK).send("error");
        });*/
};

/* HOME */
// récupère la phrase d'acceuil de la vue HOME
const get_phrase_home = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/home_data called controller 'get_all_view");
    getPhrase_ViewHome()
        .then((result) => {
            //console.log("getAllView ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getAllView erro "+error);
            return res.status(OK).send(result_error);
        });
};
// récupère l'image d'acceuil de la vue HOME [] returned !!
const get_image_home = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/image_home called, controller 'get_all_view' handling");
    getImage_ViewHome()
        .then((result) => {
            //console.log("getAllView ok "+result);
            //res.header("Access-Control-Allow-Origin", "http://192.168.3.101");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getAllView erro "+error);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).send(result_error);
        });
};
// met à jour la phrase d'acceuil home
const update_data_home = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/home/update_data called, controller 'update_data_home' handling");
    console.log("parameters = "+JSON.stringify(req.body));
    console.log("phrase paramerer= "+req.body.phrase);
    updatePhrase_ViewHome(req.body.phrase)
        .then((result) => {
            //console.log("updatePhrase_ViewHome ok "+JSON.stringify(result));
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.log("updatePhrase_ViewHome erro "+error);
            return res.status(OK).send(result_error);
        });
};

/* PREZ */
// renvoie la liste de tous les labels prez
const get_all_prez_label = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/all_labels, controller 'get_all_prez_label' handling");
    getAllLabelsPrez()
        .then((result) => {
            //console.log("get_label_prez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("get_label_prez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// renvoie la données d'un label prez en particulier
const get_data_from_id_label = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/data called, controller 'get_data_from_id_label' handling");
    getDataFromLabelPrez(<string>req.query.id)
        .then((result) => {
            //console.log("getDataFromLabelPrez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getDataFromLabelPrez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// renvoie toutes les données des labels prez
const get_all_prez_data = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/all_data called, controller 'get_all_prez_data' handling");
    getAllDataPrez()
        .then((result) => {
            //console.log("getAllDataPrez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getAllDataPrez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// récupère l'url de l'image de la vue présentation [] returned !!
const get_url_image_prez = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/get/url_img called, controller 'get_url_image_prez' handling");
    getImage_ViewPrez()
        .then((result) => {
            console.log("getImage_ViewPrez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getImage_ViewPrez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// change l'url de l'image de la vue présentation
const update_image_url_prez = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/set/url_img called, controller 'update_image_url_prez' handling");
    UpdateImage_ViewPrez(<string>req.query.url)
        .then((result) => {
           // console.log("setImage_ViewPrez ok "+result);
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.log("error update_image_url_prez"+error);
            return res.status(OK).send(result_error);
        });
};
// Met à jour le nom du label(label_name) d'une entrée(id) prez et ses données associées(label_data)
const update_label_and_data_prez = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/update_data called, controller 'update_label_and_data' handling");
    console.log("parameters = "+JSON.stringify(req.body));
    updateLabelAndData_ViewPrez(req.body.id, req.body.label_name, req.body.label_data)
        .then((result) => {
            //console.log("updateLabelAndData_ViewPrez ok "+result);
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.log("error updateLabelAndData_ViewPrez"+error);
            return res.status(OK).send(result_error);
        });
};

/* SVC */
// renvoie la liste de tous les labels svc
const get_all_svc_label = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/svc/all_labels called, controller 'get_all_prez_label' handling");
    getAllLabelsSvc()
        .then((result) => {
            //console.log("get_label_prez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("get_label_prez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// renvoie la données d'un label svc en particulier
const get_data_from_svc_label = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/svc/data called, controller 'get_data_from_label' handling");
    getDataFromLabelSvc(<string>req.query.id)
        .then((result) => {
            //console.log("get_data_from_label ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("get_data_from_label erro "+error);
            return res.status(OK).send(result_error);
        });
};
// renvoie toutes les données et labels labels svc
const get_all_svc_data = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/svc/all_data called, controller 'get_all_prez_data' handling");
    getAllDataSvc()
        .then((result) => {
            //console.log("getAllDataPrez ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getAllDataPrez erro "+error);
            return res.status(OK).send(result_error);
        });
};
// Met à jour le nom du label(label_name) d'une entrée(id) svc et ses données associées(label_data)
const update_label_and_data_svc = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/view/prez/update_data called, controller 'update_label_and_data' handling");
    console.log("parameters = "+JSON.stringify(req.body));
    updateLabelAndData_ViewSvc(req.body.id, req.body.label_name, req.body.label_data)
        .then((result) => {
            console.log("updateLabelAndData_ViewSvc ok "+result);
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.log("error updateLabelAndData_ViewSvc"+error);
            return res.status(OK).send(result_error);
        });
};

module.exports = {
    get_all_view: get_all_view,
    create_view_data:create_view_data,
    create_view_data_home:create_view_data_home,
    get_phrase_home:get_phrase_home,
    get_image_home:get_image_home,
    update_data_home:update_data_home,
    get_all_prez_label:get_all_prez_label,
    get_data_from_id_label:get_data_from_id_label,
    get_all_prez_data:get_all_prez_data,
    get_url_image_prez:get_url_image_prez,
    update_image_url_prez:update_image_url_prez,
    update_label_and_data_prez:update_label_and_data_prez,
    get_all_svc_label:get_all_svc_label,
    get_data_from_svc_label:get_data_from_svc_label,
    get_all_svc_data:get_all_svc_data,
    update_label_and_data_svc:update_label_and_data_svc
};
