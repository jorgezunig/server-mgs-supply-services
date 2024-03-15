import { User } from "../models/index.js";
import bscrypt from "bcryptjs";
import { token } from "../utils/index.js";


/**
 * Registra nuevos usuarios para el sistema
 * 
 * @method register
 * @param {*} req 
 * @param {*} res
 * @returns User 
 */
function register(req, res) {
    const { email, password } = req.body;

    const user = new User({
        email: email.toLowerCase()
    });

    const salt = bscrypt.genSaltSync(10);
    const hashPassword = bscrypt.hashSync(password, salt);
    user.password = hashPassword;


    user.save()
        .then(response => {
            res.status(201).send({ msg: user });
        })
        .catch(error => {
            res.status(400).send({ msg: "Error al registrar el usuario" })
        });

}

/**
 * 
 * Metodo para validar credenciales
 * 
 * @method login 
 * @param {*} req 
 * @param {*} res 
 * @returns {accessToken,refreshToken}
 */
function login(req, res) {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    User.findOne({ email: emailLower })
        .then((user) => {
            if (!user) {
                return res.status(400).send({ msg: "Error de credenciales" });
            }

            bscrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.error("Error al comparar contraseñas:", err);
                    return res.status(400).send({ msg: "No Autorizado" });
                }

                if (result) {
                    return res.status(200).send({
                        access: token.createAccessToken(user),
                        refresh: token.createRefreshToken(user)
                    });
                } else {
                    return res.status(400).send({ msg: "No Autorizado" });
                }
            });
        })
        .catch((error) => {
            console.error("Error al buscar usuario:", error);
            res.status(400).send({ msg: "No Autorizado" });
        });
}

/**
 * Metodo para crear el accessToken 
 * por medio del refreshToken
 * 
 * @method refreshAccessToken
 * @param {*} req 
 * @param {*} res 
 * @returns {accessToken}
 */
function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send({ msg: "Token Requerido" });
    }

    const hasExpired = token.hasExpiredToken(refreshToken);

    if (hasExpired) {
        return res.status(400).send({ msg: "Token expirado" });
    }

    const { user_id } = token.decode(refreshToken);

    User.findById(user_id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ msg: "Usuario no encontrado" });
            }
            res.status(200).send(
              {
                access: token.createAccessToken(user)
              }                
            );
        })
        .catch((error) => {
            console.error("Error al buscar usuario:", error);
            res.status(500).send({ msg: "Error interno del servidor" });
        });

}


export const AuthController = {
    register,
    login,
    refreshAccessToken
};
