import mongoose from "mongoose";

import { REQUIRED_USER_FIELDS } from "../utils/constants.js";

const UserSchema = mongoose.Schema({});

REQUIRED_USER_FIELDS.forEach(field => {
    const fieldOptions = { type: String };
    if (field.options !== undefined) {
        Object.assign(fieldOptions, field.options);
    }
    UserSchema.add({
        [field.name]: fieldOptions
    });
});

export const User = mongoose.model("User", UserSchema);
