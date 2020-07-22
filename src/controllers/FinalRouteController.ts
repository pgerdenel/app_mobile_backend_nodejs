import {NextFunction, Request, Response} from "express";


const finalRouterHandler = (req:Request, res:Response, next:NextFunction) => {
};
async function finalRoutePassed(req: Request, res: Response) {}
async function finalRouteNError(req: Request, res: Response) {}

module.exports = {
    finalRoutePassed: finalRoutePassed,
    finalRouteNError:finalRouteNError,
    finalRouterHandler:finalRouterHandler
};
