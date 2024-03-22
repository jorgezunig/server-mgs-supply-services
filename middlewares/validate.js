import { MSG_REQUIRED_FIELDS, REQUIRED_USER_FIELDS } from "../utils/constants.js";

function validateUserRegistration(req,resp,next){
    
    if (!REQUIRED_USER_FIELDS.every(field => req.body.hasOwnProperty(field.name))) {
        return resp.status(400).json({ error: MSG_REQUIRED_FIELDS });
    }

   next();
}


export const validate = {
    validateUserRegistration
}