import {OK} from "http-status-codes";
import {all_host_endpoint, paths_public_folder, result_error, result_ok} from "@shared/constants";
import { Request, Response, NextFunction } from 'express';
import {
    checkPartExist,
    delPart,
    getAllPart,
    getAllPartCol,
    getAllPartPart,
    savePart,
    updatePart
} from "@entities/models/PartenaireSchema";

const get_all_part = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/all called = "+JSON.stringify(req.body));
    getAllPart()
        .then((result) => {
            console.log("getAllPart ok "+result);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllPart erro "+error);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(404).json(result_error);
        });
};
const get_all_part_col = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/col called = "+JSON.stringify(req.body));
    getAllPartCol()
        .then((result) => {
            console.log("getAllPart ok "+result);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllPart erro "+error);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(404).json(result_error);
        });
};
const get_all_part_part = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/part called = "+JSON.stringify(req.body));
    getAllPartPart()
        .then((result) => {
            console.log("getAllPart ok "+result);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.error("getAllPart erro "+error);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(404).json(result_error);
        });
};
const create_part = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/create called = "+JSON.stringify(req.body));

    savePart(req.body.part.type, req.body.part.nom)
        .then((result) => {
            console.log("savePart ok "+result);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.error("savePart erro "+error);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(404).json(result_error);
        });
};
const delete_part = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/delete called = "+JSON.stringify(req.body));
    delPart(req.body.id)
        .then((result) => {
            console.log("delPart ok "+result);
            //res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.error("delPart erro "+error);
            //res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(404).json(result_error);
        });
};
const update_part = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/update' called = "+JSON.stringify(req.body));
    updatePart(req.body.part.id, req.body.part.type, req.body.part.nom)
        .then((result) => {
            console.log("updatePart ok "+result);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result_ok);
        })
        .catch((error) => {
            console.error("updatePart erro "+error);
            //res.header("Access-Control-Allow-Origin", "https://localhost:3000/image/gallery");
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result_error);
        });
};
const check_part_exist = async function (req: Request, res: Response, next:NextFunction) {
    console.log("/exist' called = "+JSON.stringify(req.body));
    checkPartExist(req.body.part.type, req.body.part.nom)
        .then((result) => {
            console.log("checkPartExist ok "+result);
            if(result == 0) {
                res.header("Access-Control-Allow-Origin", "*");
                return res.status(OK).json(result_ok);
            }
            else {
                res.header("Access-Control-Allow-Origin", "*");
                return res.status(OK).json({"state":"exist"});
            }

        })
        .catch((error) => {
            console.error("checkPartExist erro "+error);
            res.header("Access-Control-Allow-Origin", "*");
            return res.status(OK).json(result_error);
        });
};

module.exports = {
    get_all_part: get_all_part,
    get_all_part_col:get_all_part_col,
    get_all_part_part:get_all_part_part,
    create_part:create_part,
    delete_part:delete_part,
    update_part:update_part,
    check_part_exist:check_part_exist
};
