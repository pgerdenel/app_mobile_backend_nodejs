import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
let favicon = require('serve-favicon');
let cors = require('cors');
import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import BaseRouter from './routes';
import logger from '@shared/Logger';
//import sassMiddleware from 'node-sass';
import sassMiddleware from 'node-sass-middleware';

import {init_mongodb} from '@shared/mongo_api';
import bodyParser from "body-parser";
import {env, result_error, result_ok} from "@shared/constants";


// Init express
const app = express();
app.use(cors());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Sets "X-Content-Type-Options: nosniff".
//app.use(helmet.noSniff()); // problem de content type pour les view
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    /*app.use(helmet);*/
}

// Add APIs
app.use('/', BaseRouter);
// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json(result_error);
});

/************************************************************************************
 *                              MongoDB init
 ***********************************************************************************/
init_mongodb();

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname+"\\", 'public'); // https://localhost:3000/media/imgs/1.png
console.log("__dirname = "+__dirname+"\\"+"public");
app.use(express.static(staticDir));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
console.log("ENV ? "+process.env.NODE_ENV);
console.log("env const ? "+env);
// # ces putains de CORS
/*app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});*/
app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204);
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});
app.get('/actu', (req: Request, res: Response) => {
    res.sendFile('actu.html', {root: viewsDir});
});
app.get('/users', (req: Request, res: Response) => {
    res.sendFile('users.html', {root: viewsDir});
});
app.get('/panel', (req: Request, res: Response) => {
    res.sendFile('panel.html', {root: viewsDir});
});
app.get('/contact', (req: Request, res: Response) => {
    res.sendFile('contact.html', {root: viewsDir});
});
app.get('/message', (req: Request, res) => {
    res.sendFile('contact.html', {root: viewsDir});
});
app.get('/part', (req: Request, res: Response) => {
    res.sendFile('part.html', {root: viewsDir});
});
app.get('/image', (req: Request, res: Response) => {
    res.sendFile('image.html', {root: viewsDir});
});
app.get('/viewdata', (req: Request, res: Response) => {
    res.sendFile('viewdata.html', {root: viewsDir});
});
app.get('/api', (req: Request, res: Response) => {
    //res.json(result_ok);
});
app.get('*', function(req, res){
    res.status(404).sendFile('404.html', {root: viewsDir});
});


// Export express instance
export default app;
