import { Request, Response, Router } from 'express';

const router = Router();

const uploadController = require("../controllers/UploadController");
const actuRouteController = require("../controllers/ActuRouteController");
const ContactRouteController = require("../controllers/ContactRouteController");
const ImageRouteController = require("../controllers/ImageRouteController");
const PartRouteController = require("../controllers/PartenaireRouteController");
const ViewDataRouteController = require("../controllers/ViewDataRouteController");

// Pour route MESSAGE CORS DE BASE
/*const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    /!*origin: "http://localhost:8200",*!/
    origin: "http://localhost:8200",
    preflightContinue: false
};*/
//use cors middleware
//router.use(cors(options));

/***********************************************************************************************************************
 *                              API ACTU ROUTES
 *********************************************************************************************************************/
/******************************************************************************
 *                      Get All Actu - "GET /actu/all"
 ******************************************************************************/
router.get('/actu/all', actuRouteController.get_all_actu);
/******************************************************************************
 *                      Get One Actu - "GET /actu/one"
 ******************************************************************************/
router.get('/actu/one', actuRouteController.get_one_actu);
/******************************************************************************
 *                      Create one Actu - "POST /actu/create" WITH IMAGE //res.header("Access-Control-Allow-Origin", "*");
 ******************************************************************************/
router.post('/actu/createi', uploadController.uploadImageActu, actuRouteController.create_actu);
/******************************************************************************
 *                      Create one Actu - "POST /actu/create" WIHTOUT IMAGE
 ******************************************************************************/
router.post('/actu/create', actuRouteController.create_actu);
/******************************************************************************
 *                      Del one Actu - "POST /actu/delete"
 ******************************************************************************/
router.post('/actu/delete',actuRouteController.delete_one_actu);
/******************************************************************************
 *                      Update one Actu - "POST /actu/update"
 ******************************************************************************/
router.post('/actu/update', actuRouteController.update_actu);

/***********************************************************************************************************************
 *                              API CONTACT ROUTES
 *********************************************************************************************************************/
/******************************************************************************
 *                      Get All Contact - "GET /contact/all"
 ******************************************************************************/
router.get('/contact/all', ContactRouteController.get_all_message);
/******************************************************************************
 *                      Create one Contact - "POST /contact/create"
 ******************************************************************************/
router.post('/contact/create',  ContactRouteController.create_message);
/******************************************************************************
 *                      Del one Contact - "POST /contact/delete"
 ******************************************************************************/
router.post('/contact/delete', ContactRouteController.delete_message);

/***********************************************************************************************************************
 *                              API IMAGE ROUTES
 *********************************************************************************************************************/
/******************************************************************************
 *                      Get All Image - "GET /image/gallery/all"
 *                      https://localhost:3000/media/imgs/gallery/1.png
 *                      1: gallery, 2: actu, 3: prez, 4: home
 ******************************************************************************/
router.get('/image/all', ImageRouteController.get_all_images);
/******************************************************************************
 *                      Get Gallery - "GET /image/gallery/gallery"
 *                      https://localhost:3000/media/imgs/gallery/1.png
 ******************************************************************************/
router.get('/image/gallery', ImageRouteController.get_all_images_gallery);
/******************************************************************************
 *                      Get All Image Actu - "GET /image/gallery/actu"
 *                      https://localhost:3000/media/imgs/actu/1.png
 ******************************************************************************/
router.get('/image/actu', ImageRouteController.get_all_images_actu);
/******************************************************************************
 *                      Get Image Prez - "GET /image/gallery/prez"
 *                      https://localhost:3000/media/imgs/prez/1.png
 ******************************************************************************/
router.get('/image/prez', ImageRouteController.get_all_images_prez);
/******************************************************************************
 *                      Get All Image Home - "GET /image/gallery/home"
 *                      https://localhost:3000/media/imgs/home/1.png
 ******************************************************************************/
router.get('/image/home', ImageRouteController.get_all_images_home);
/******************************************************************************
 *                      POST Delete Image - "POST /image/delete"
 ******************************************************************************/
router.post('/image/delete', ImageRouteController.delete_image);
/******************************************************************************
 *                      POST Home Image - "POST /image/gallery/upload_home"
 ******************************************************************************/
router.post('/image/upload_home', ImageRouteController.upload_home);
/******************************************************************************
 *                      POST Prez Image - "POST /image/gallery/upload_prez"
 ******************************************************************************/
router.post('/image/upload_prez', ImageRouteController.upload_prez);
/******************************************************************************
 *                      POST Gallery Image - "POST /image/gallery/upload_gallery"
 ******************************************************************************/
router.post('/image/upload_gallery', ImageRouteController.upload_gallery);
/******************************************************************************
 *                      POST Actu Image - "POST /image/gallery/upload_actu"
 ******************************************************************************/
router.post('/image/upload_actu', ImageRouteController.upload_actu);
/******************************************************************************
 *                      POST New Image - "POST /image/update_image"
 *                      upload une nouvelle image et remplace une ancienne en en bdd
 ******************************************************************************/
router.post('/image/upload_and_update_image_home', uploadController.uploadImageHome, ImageRouteController.upload_and_update_image_home);
/******************************************************************************
 *                      POST New Image - "POST /image/update_image"
 *                      upload une nouvelle image et remplace une ancienne en en bdd
 ******************************************************************************/
router.post('/image/upload_and_update_image_prez', uploadController.uploadImagePrez, ImageRouteController.upload_and_update_image_prez);
/******************************************************************************
 *                      POST New Image - "POST /image/update_image"
 *                      upload une nouvelle image et remplace une ancienne en en bdd
 ******************************************************************************/
router.post('/image/upload_and_update_image_gallery', uploadController.uploadImageGallery, ImageRouteController.upload_and_update_image_gallery);
/******************************************************************************
 *                      POST New Image - "POST /image/update_image"
 *                      upload une nouvelle image et remplace une ancienne en en bdd
 ******************************************************************************/
router.post('/image/upload_and_update_image_actu', uploadController.uploadImageActu, ImageRouteController.upload_and_update_image_actu);

/***********************************************************************************************************************
 *                              API PARTENAIRE ROUTES
 *********************************************************************************************************************/
/******************************************************************************
 *                      Get All Part - "GET /part/all"
 ******************************************************************************/
router.get('/part/all', PartRouteController.get_all_part);
router.get('/part/col', PartRouteController.get_all_part_col);
router.get('/part/part', PartRouteController.get_all_part_part);
/******************************************************************************
 *                      Create one Part - "POST /part/create"
 ******************************************************************************/
router.post('/part/create', PartRouteController.create_part);
/******************************************************************************
 *                      Del one Part - "POST /part/delete"
 ******************************************************************************/
router.post('/part/delete', PartRouteController.delete_part);
/******************************************************************************
 *                      Update one Part - "POST /part/update"
 ******************************************************************************/
router.post('/part/update', PartRouteController.update_part);
/******************************************************************************
 *                      Check Part - "POST /part/exist"
 ******************************************************************************/
router.post('/part/exist', PartRouteController.check_part_exist);

/***********************************************************************************************************************
 *                              API VIEWDATA ROUTES
 *********************************************************************************************************************/
/******************************************************************************
 *                      Get All ViewDATA - "GET /panel/actu/all"
 *                      Renvoie toutes les viewdata de toutes les vues
 ******************************************************************************/
router.get('/view/all', ViewDataRouteController.get_all_view);
/*
 * HOME
 */
router.get('/view/home/data', ViewDataRouteController.get_phrase_home);
router.get('/view/home/image', ViewDataRouteController.get_image_home);
router.post('/view/home/update_data', ViewDataRouteController.update_data_home);
/*
 * PREZ
 */
// renvoie la liste de tous les labels prez
router.get('/view/prez/all_labels', ViewDataRouteController.get_all_prez_label);
// renvoie la données d'un label prez en particulier
router.get('/view/prez/data', ViewDataRouteController.get_data_from_id_label);
// renvoie toutes les données et labels prez
router.get('/view/prez/all_data', ViewDataRouteController.get_all_prez_data);
// récupère l'url de l'image de la vue présentation [] returned !!
router.get('/view/prez/get/url_img', ViewDataRouteController.get_url_image_prez);
// change l'url de l'image de la vue présentation
router.post('/view/prez/set/url_img', ViewDataRouteController.update_image_url_prez);
// Met à jour le nom du label(label_name) d'une entrée(id) prez et ses données associées(label_data)
router.post('/view/prez/update_data', ViewDataRouteController.update_label_and_data_prez);
/* SVC */
// renvoie la liste de tous les labels svc
router.get('/view/svc/all_labels', ViewDataRouteController.get_all_svc_label);
// renvoie la données d'un label svc en particulier
router.get('/view/svc/data', ViewDataRouteController.get_data_from_svc_label);
// renvoie toutes les données des labels svc
router.get('/view/svc/all_data', ViewDataRouteController.get_all_svc_data);
// Met à jour le nom du label(label_name) d'une entrée(id) prez et ses données associées(label_data)
router.post('/view/svc/update_data', ViewDataRouteController.update_label_and_data_svc);
/******************************************************************************
 *                      Create one Actu - "POST /panel/actu/create"
 *                      Renvoie toutes les viewdata de toutes les vues
 ******************************************************************************/
router.post('/view/create_vd', ViewDataRouteController.create_view_data);
/******************************************************************************
 *                      Del one Actu - "POST /panel/actu/delete"
 ******************************************************************************/
router.post('/view/create_vdi', ViewDataRouteController.create_view_data);

// Contact route FROM
//router.options("*", cors(options));

export default router;
