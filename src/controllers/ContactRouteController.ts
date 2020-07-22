import {OK} from "http-status-codes";
import {all_host_endpoint, paths_public_folder, result_error, result_ok} from "@shared/constants";
import { Request, Response, NextFunction } from 'express';
import {delContact, getAllContact, saveContact} from "@entities/models/ContactSchema";

const get_all_message = async function (req: Request, res: Response, next:NextFunction) {
    console.log("request = "+JSON.stringify(req.body));
    getAllContact()
        .then((result) => {
            console.log("getAllContact ok "+result);
            return res.status(OK).json(result);
        })
        .catch((error) => {
            console.log("getAllContact erro "+error);
            return res.status(OK).send(result_error);
        });
};
const create_message = async function (req: Request, res: Response, next:NextFunction) {
    console.log("POST /message/create called");
    console.log("post data = "+JSON.stringify(req.body));
    let email, sujet, message;
    try {
        email = req.body.email;
        sujet = req.body.sujet;
        message = req.body.message;

        saveContact(email, sujet, message)
            .then((result) => {
                console.log("saveContact ok "+result);
                return res.status(OK).json(result_ok);
            })
            .catch((error) => {
                console.log("saveContact erro "+error);
                return res.status(OK).json(result_error);
            });
    }
    catch(error) {
        console.log("erreur de paramètre");
    }
};
const delete_message = async function (req: Request, res: Response, next:NextFunction) {
    console.log("request = "+JSON.stringify(req.body));
    delContact(req.body.id)
        .then((result) => {
            console.log("delContact ok "+result);
            return res.status(OK).send(result_ok);
        })
        .catch((error) => {
            console.log("delContact erro "+error);
            return res.status(OK).send(result_error);
        });
};

module.exports = {
    get_all_message: get_all_message,
    create_message:create_message,
    delete_message:delete_message
};
