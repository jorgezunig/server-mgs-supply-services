import { User } from "../models/index.js";



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
            resp.status(404).send({ msg: "No se encontro al usuario" });
        }

        resp.status(200).send(response);
    }
    catch (e) {
        resp.status(400).send({ msg: "Error en peticion" });
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
            resp.status(404).send({ msg: "No se encontro usuarios" });
        }

        resp.status(200).send(users);
    } catch (e) {
        resp.status(404).send({ msg: "No se encontro usuarios" });
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
            resp.status(404).send({ msg: "No se encontro usuario" });
        }

        resp.status(200).send(user);

    } catch (e) {
        resp.status(404).send({ msg: "No se encontro usuario" });
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
            resp.status(404).send({msg:"Usuario no existe"});
        }

        resp.status(200).send(response);

    } catch (e) {
        resp.status(404).send({msg:"Usuario no existe"}); 
    }


}

export const userController = {
    getMe,
    getUsers,
    getUserById,
    updateUser
};