import path  from "path";

export const IP_SERVER = "localhost";

export const PORT = process.env.PORT || 3977;

export const DB_USER = "elliot";

export const DB_PASS = "Guillermo981";

export const DB_HOST = "chatapp.yrpdysl.mongodb.net";

export const JWT_SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

export const MSG_UNAUTHORIZED = "Unauthorized";

export const MSG_AUTH_FAILED = "Authentication failed.";

export const MSG_REQUIRED_FIELDS = "Required fields are missing.";

export const ETQ_LOG = "Module -> FUNCTION[ %s ] -> MSG[ %s ]";

export const REQUIRED_USER_FIELDS = [
    { name: "email", options: { unique: true } },
    { name: "password" },
    { name: "cellphone", options: { unique: true } }
];

export const SWAGGER_SPEC = {
    definition:{
       openapi:"3.0.0",
       info:{
         title: "App",
         version: "1.0"
       },
       servers:[
        {
            url:"http://localhost:3799",
            description:""
        }
       ]
    },
    apis:[
        `${path.join("../routes/index.js")}`
    ]
}

