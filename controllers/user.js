import { User } from "../models/index.js";
import { ETQ_LOG } from "../utils/constants.js";

/**
 * Obtiene la información del usuario mediante el token
 * 
 * @method getMe
 * @param {*} req 
 * @param {*} resp 
 * 
 */
async function getMe(req, resp) {

    const { user_id } = req.user;

    try {
        const response = await User.findById(user_id).select("-password");

        if (!response) {
            resp.status(404).send({ module: "USER", message: "user not found" });
        }

        resp.status(200).send(response);
    }
    catch (e) {
        resp.status(500).send({ module: "USER", message: "error" });
    }
}


/**
 * 
 * Obtiene todo los usuarios excepto su mismo usuario
 * 
 * @method getUsers
 * @param {*} req 
 * @param {*} resp 
 */
async function getUsers(req, resp) {

    try {
        const { user_id } = req.user;
        const users = await User.find({ _id: { $ne: user_id } }).select("-password");

        if (!users) {
            resp.status(404).send({ module: "USER", message: "No active users found" });
        }

        resp.status(200).send(users);
    } catch (e) {
        resp.status(500).send({ module: "USER", message: "error" });
    }


}

/**
 * Busca usuario por id
 * 
 * @method getUserById
 * @param {*} req 
 * @param {*} resp 
 */
async function getUserById(req, resp) {

    const { id } = req.params;

    try {

        const user = await User.findById(id).select(["-password"]);

        if (!user) {
            resp.status(404).send({ module:"USER", msg: "user not found" });
        }

        resp.status(200).send(user);

    } catch (e) {
        resp.status(500).send({ module: "USER", message: "error" });
    }
}


/**
 * 
 * Actualizar usuario logeado
 * 
 * @method updateUser
 * @param {*} req 
 * @param {*} resp 
 */
async function updateUser(req, resp) {

    const { user_id } = req.user;
    const userData = req.body;


    try {
        const response = await User.findByIdAndUpdate({ _id: user_id }, userData).select("-password");

        if (!response) {
            resp.status(404).send({"module":"USER","msg":"user not found"});
        }

        resp.status(200).send(response);

    } catch (e) {
        resp.status(500).send({module:"USER",msg:"error"}); 
    }


}

export const userController = {
    getMe,
    getUsers,
    getUserById,
    updateUser
};