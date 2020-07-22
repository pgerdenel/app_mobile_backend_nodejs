import {NextFunction, Request} from "express";
import {divideFileTypeAndFileNameFromFullFileName} from "@shared/functions";
import {paths_public_folder} from "@shared/constants";
const multer = require("multer");
/*const sharp = require("sharp");*/
//const multerStorage = multer.memoryStorage(); // pour stocker les images uploadés en mémoire si on a besoin de resize
export interface MulterRequest extends Request {
    files: any // or any other type
}

/* filtre pour s'assurer d'avoir une image
 * - vérifie le type mime
 * - vérifie le header du fichier en binaire
 * PNG  -> ‰PNG
 * JPG  -> ÿØÿà
 * JPEG -> ÿØÿà
 * GIF  -> GIF89a.
 */
export const multerFilter = (req:Request, file:any, cb:any) => {
    if (file.mimetype.startsWith("image")) {
        console.log("multerFilter used here");
        // on vérifie les entêtes de fichier en binaire pour savoir s'il s'agit d'un format image supporté
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};
/*const resizeImages = async (req:MulterRequest, res:Response, next:NextFunction) => {
    if (!req.files) return next();

    req.body.images = [];
    await Promise.all(
        req.files.map(async (file: { originalname: string; buffer: any; }) => {
            const filename = file.originalname.replace(/\..+$/, "");
            const newFilename = `bezkoder-${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .resize(640, 320)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`upload/${newFilename}`);

            req.body.images.push(newFilename);
        })
    );

    next();
};*/
const getResult = async (req:Request, res:Response) => {
    if (req.body.images.length <= 0) {
        return res;
    }

    const images = req.body.images
        .map((image: any) => "" + image + "")
        .join("");

    return res;
};

/* configuration des 4 stockages multer (HOME, PREZ, GALLERY et ACTU) */

// HOME SINGLE *OK
const storage_home = multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, paths_public_folder.imgs_home); // './src/public/media/imgs/home/'
    },
    filename: async function (req: Request, file: any, cb: any) {
        console.log("All keys=" + Object.keys(file));
        console.log("All keys=" + file.fieldname); // nom du champ post
        console.log("All keys=" + file.originalname); // nom du fichier de l'ordinateur quand il est arrivé
        console.log("All keys=" + file.encoding); // 7 bit
        console.log("All keys=" + file.mimetype); // image/png
        let final_name = await divideFileTypeAndFileNameFromFullFileName(file.originalname);
        cb(null, final_name);
    }
});
const upload_home = multer({ storage: storage_home, fileFilter: multerFilter });
const upload_home_single = upload_home.single('img');
export const uploadImageHome = (req:Request, res:Response, next:NextFunction) => {
    upload_home_single(req, res, (err: { code: any; }) => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                // ...
                console.error("multer error = LIMIT_UNEXPECTED_FILE");
            }
        } else if (err) {
            // handle other errors
            console.error("multer error = "+err);
        }

        // Everything is ok.
        next();
    });
};

//PREZ SINGLE *not checked
const storage_prez = multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, paths_public_folder.imgs_prez); // './src/public/media/imgs/home/'  PROD A CHANGER !!!
    },
    filename: async function (req: Request, file: any, cb: any) {
        console.log("All keys=" + Object.keys(file));
        console.log("All keys=" + file.fieldname); // nom du champ post
        console.log("All keys=" + file.originalname); // nom du fichier de l'ordinateur quand il est arrivé
        console.log("All keys=" + file.encoding); // 7 bit
        console.log("All keys=" + file.mimetype); // image/png
        let final_name = await divideFileTypeAndFileNameFromFullFileName(file.originalname);
        cb(null, final_name);
    }
});
const upload_prez = multer({ storage: storage_prez, fileFilter: multerFilter });
const upload_prez_single = upload_prez.single('img');
const uploadImagePrez = (req:Request, res:Response, next:NextFunction) => {
    upload_prez_single(req, res, (err: { code: any; }) => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                // ...
                console.error("multer error = LIMIT_UNEXPECTED_FILE");
            }
        } else if (err) {
            // handle other errors
            console.error("multer error = "+err);
        }

        // Everything is ok.
        next();
    });
};

//GALLERY SINGLE *not checked
const storage_gallery = multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, paths_public_folder.imgs_gallery); // './src/public/media/imgs/home/'
    },
    filename: async function (req: Request, file: any, cb: any) {
        console.log("All keys=" + Object.keys(file));
        console.log("All keys=" + file.fieldname); // nom du champ post
        console.log("All keys=" + file.originalname); // nom du fichier de l'ordinateur quand il est arrivé
        console.log("All keys=" + file.encoding); // 7 bit
        console.log("All keys=" + file.mimetype); // image/png
        let final_name = await divideFileTypeAndFileNameFromFullFileName(file.originalname);
        cb(null, final_name);
    }
});
const upload_gallery = multer({ storage: storage_gallery, fileFilter: multerFilter });
const upload_gallery_single = upload_gallery.single('img');
export const uploadImageGallery = (req:Request, res:Response, next:NextFunction) => {
    upload_gallery_single(req, res, (err: { code: any; }) => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                // ...
                console.error("multer error = LIMIT_UNEXPECTED_FILE");
            }
        } else if (err) {
            // handle other errors
            console.error("multer error = "+err);
        }

        // Everything is ok.
        next();
    });
};

//GALLERY MANY *not checked
const storage_gallerys= (my_parameter:string) =>  multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, './src/public/media/imgs/gallery/')
    },
    filename: function (req : Request, file : any, cb: any) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload_gallerys = multer({ storage: storage_gallerys, fileFilter: multerFilter });
const upload_gallery_many = upload_gallerys.array('imgs', 12);
const uploadImagesGallery = (req:Request, res:Response, next:NextFunction) => {
    upload_gallery_many(req, res, (err: { code: any; }) => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                // ...
            }
        } else if (err) {
            // handle other errors
        }

        // Everything is ok.
        next();
    });
};

// ACTU SINGLE *OK
const storage_actu = multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, paths_public_folder.imgs_actu); // './src/public/media/imgs/actu/'
    },
    filename: async function (req: Request, file: any, cb: any) {
        console.log("All keys=" + Object.keys(file));
        console.log("All keys=" + file.fieldname); // nom du champ post
        console.log("All keys=" + file.originalname); // nom du fichier de l'ordinateur quand il est arrivé
        console.log("All keys=" + file.encoding); // 7 bit
        console.log("All keys=" + file.mimetype); // image/png
        let final_name = await divideFileTypeAndFileNameFromFullFileName(file.originalname);
        cb(null, final_name);
    }
});
const upload_actu = multer({ storage: storage_actu, fileFilter: multerFilter });
const upload_actu_single = upload_actu.single('img');
export const uploadImageActu = (req: Request, res: Response, next: NextFunction) => {
    console.log("uploadImageActu called");
    upload_actu_single(req, res, (err: { code: any; }) => {
            if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
                if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                    // ...
                    console.log("error multer "+err.code);
                }
            } else if (err) {
                // handle other errors
                console.log("error other "+err);
            }
            // Everything is ok.
            return next();
        });

};
// still not used
const uploadImagesActu = (req:Request, res:Response, next:NextFunction) => {
    console.log("uploadImagesActu called");
    upload_actu_many(req, res, (err: { code: any; }) => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                // ...
                console.log("error multer "+err.code);
            }
        } else if (err) {
            // handle other errors
            console.log("error other "+err);
        }
        // Everything is ok.
        next();
    });
};

// ACTU MANY *not checked
const storage_actus = (my_parameter:string) =>  multer.diskStorage({
    destination: function (req : Request, file : any, cb : any) {
        cb(null, './src/public/media/imgs/actu/');
    },
    filename: function (req : Request, file : any, cb: any) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload_actus = multer({ storage: storage_actus, fileFilter: multerFilter });
const upload_actu_many = upload_actus.array('imgs', 12);

module.exports = {
    uploadImageActu: uploadImageActu,
    uploadImageHome: uploadImageHome,
    uploadImageGallery: uploadImageGallery,
    uploadImagePrez: uploadImagePrez,
    /*resizeImages: resizeImages,*/
    getResult: getResult
};
