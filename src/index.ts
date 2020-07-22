import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import fs_sync from 'fs';
import https from 'https';
import {current_ip_config} from "@shared/constants";
import * as http from "http";
import path from "path";
let favicon = require('serve-favicon');

const port = Number(process.env.PORT || 3000);

/* Start the server https
 * @TODO Promise chain pour lire en asynchrone
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if(current_ip_config.includes("https")) {
    https.createServer({
        key: fs_sync.readFileSync(__dirname+'\\config\\ssl\\key.pem'),
        cert: fs_sync.readFileSync(__dirname+'\\config\\ssl\\cert.ca.crt'),
        passphrase: 'test'
    }, app).listen(port, () => {
        logger.info('Node.js HTTPS en écoute sur le port ' + port);
    });
}
else {
    http.createServer({
    }, app).listen(port, () => {
        logger.info('Node.js HTTP en écoute sur le port ' + port);
    });
}
