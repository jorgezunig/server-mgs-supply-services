import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import { token } from "../utils/index.js";
import { REQUIRED_USER_FIELDS } from "../utils/constants.js";
import { ETQ_LOG } from "../utils/constants.js";


/**
 * Registra nuevos usuarios para el sistema
 * 
 * @method register
 * @param {*} req 
 * @param {*} res
 * @returns User 
 */
function register(req, res) {

    const userData = {};

    REQUIRED_USER_FIELDS.forEach(field => {
        if (req.body[field.name]) {
            userData[field.name] = field.name === 'email' ? req.body[field.name].toLowerCase() : req.body[field.name];
        }
    });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    userData.password = hashPassword;

    const user = new User(userData);

    user.save()
        .then(response => {
            res.status(201).send({ msg: user });
        })
        .catch(error => {
            res.status(400).send({ module: "AUTH", msg: "Error registering new user" });
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
                return res.status(400).send({ module: "AUTH", msg: "Credentials error" });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.error("Error al comparar contraseñas:", err);
                    return res.status(400).send({ module: "AUTH", msg: "No Authorized" });
                }

                if (result) {
                    return res.status(200).send({
                        access: token.createAccessToken(user),
                        refresh: token.createRefreshToken(user)
                    });
                } else {
                    return res.status(400).send({ module: "AUTH", msg: "No Authorized" });
                }
            });
        })
        .catch((error) => {
            console.error(ETQ_LOG, "login", "error al buscar usuario");
            res.status(500).send({ module: "AUTH", msg: "error" });
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
        return res.status(400).send({ module: "AUTH", msg: "refresh token required" });
    }

    const hasExpired = token.hasExpiredToken(refreshToken);

    if (hasExpired) {
        return res.status(400).send({ module: "AUTH", msg: "Expired Token" });
    }

    const { user_id } = token.decode(refreshToken);

    User.findById(user_id)
        .then((user) => {
            
            if (!user) {
                return res.status(404).send({ module: "AUTH", msg: "user not found" });
            }

            res.status(200).send({access: token.createAccessToken(user)});
        })
        .catch((error) => {
            console.error(ETQ_LOG, "refreshAccessToken", "error al buscar usuario");
            res.status(500).send({ module: "AUTH", msg: "Error" });
        });

}


export const AuthController = {
    register,
    login,
    refreshAccessToken
};
