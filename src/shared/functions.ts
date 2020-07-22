import logger from './Logger';
import ErrnoException = NodeJS.ErrnoException;
import {all_host_endpoint, current_ip_config} from "@shared/constants";
const path = require('path');
const fs = require('fs');

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};
/* Renvoie un entier Random */
export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};
/* liste tous les fichiers d'un dossier
*  renvoie la liste des images avec l'url http
*  1: gallery, 2: actu, 3: prez, 4: home
* */
export const getListFiles = async function (path_discover: string, url_tag: number)  {
    const directoryPath = path.join(__dirname, path_discover);
    //passsing directoryPath and callback function
    return new Promise<String[]>((resolve, reject) => {
        fs.readdir(directoryPath, function (err:ErrnoException, files:string[]) {
            //handling error
            if (err) {
                reject('Unable to scan directory: ' + err);
            }
            else {
                let url_image: string;
                switch(url_tag) {
                    case 1:
                        url_image = current_ip_config + all_host_endpoint.endpoint_gallery;
                        break;
                    case 2:
                        url_image = current_ip_config + all_host_endpoint.endpoint_actu;
                        break;
                    case 3:
                        url_image = current_ip_config + all_host_endpoint.endpoint_prez;
                        break;
                    case 4:
                        url_image = current_ip_config + all_host_endpoint.endpoint_home;
                        break;
                    default:
                        url_image = "";
                }
                let img_gallery : String[] = [];
                for (let i=0; i<files.length; i++) {
                    img_gallery.push(url_image+files[i]);
                }
                resolve(img_gallery);
            }
        });
    });
};
function pGetListFiles(path_discover:string) {
}
/* Supprime un fichier dans un dossier */
export const deleteFile = async function(full_path_file) {
    return fs.unlink(full_path_file, function (err) {
        if (err) {
            console.log("Erreur lors de la suppression de fichier "+err);
        }
        // if no error, file has been deleted successfully
        console.log('File deleted!');
        console.log('########################################################################################!');
    });
};


/* Extrait l'extension d'un fichier et son nom
*   Renvoie un String["nom_fichier", "extension"]
*   Variantes supportées :
*   regex = /(?:\.([^.]+))?$/;
*   let ext = regex.exec("file.name.with.dots.txt")[1];   // "txt"
*   let ext = regex.exec("file.txt")[1];                  // "txt"
*   let ext = regex.exec("file")[1];                      // undefined
*   let ext = regex.exec("")[1];                          // undefined
*   let ext = regex.exec(null)[1];                        // undefined
*   let ext = regex.exec(undefined)[1];                   // undefined
*   // on modifie le nom d'enregistrement du fichier, si un fichier existe déjà du même nom alors l'enregistrement courant n'aura pas lieu et le nouveau fichier sera perdu
*   // on coupe le nom et l'extension du fichier en 2 -> depuis file.originalname(Capture.PNG)
* */
export const divideFileTypeAndFileNameFromFullFileName = async (file_name:string) => {
    return new Promise<string>((resolve, reject) => {
        if (file_name) {
            let extension: string | undefined;
            extension = file_name.split('.').pop();
            console.log("extension= " + extension);
            let name = file_name.replace(/(?:\.([^.]+))?$/, "");
            console.log("name= " + name);
            // @ts-ignore
            let final_name = name+"_"+Date.now()+"."+extension.toLowerCase();
            resolve(final_name);
        } else {
            reject("le string est null ou undefined");
        }
    });
};
