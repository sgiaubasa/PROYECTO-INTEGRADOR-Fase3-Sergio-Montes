import { Schema, model } from "mongoose";

const NAME_MAX_LENGTH = 25;
const ADDRESS_MAX_LENGTH = 50;
const PHONE_MAX_LENGTH = 15;
const EMAIL_MAX_LENGTH = 50;

const institutionSchema = new Schema({
    name: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        max: [ NAME_MAX_LENGTH, `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres` ],
    },
    address: {
        type: String,
        required: [ true, "El domicilio es obligatorio" ],
        trim: true,
        max: [ ADDRESS_MAX_LENGTH, `El domicilio no puede tener más de ${ADDRESS_MAX_LENGTH} caracteres` ],
    },
    phone: {
        type: String,
        required: [ true, "El teléfono es obligatorio" ],
        trim: true,
        max: [ PHONE_MAX_LENGTH, `El teléfono no puede tener más de ${PHONE_MAX_LENGTH} caracteres` ],
    },
    email: {
        type: String,
        required: [ true, "El email es obligatorio" ],
        lowercase: true,
        trim: true,
        max: [ EMAIL_MAX_LENGTH, `El email no puede tener más de ${EMAIL_MAX_LENGTH} caracteres` ],
        unique: true,
        validate: {
            validator: async function(email) {
                const InstitutionModel = this.constructor;
                const countDocuments = await InstitutionModel.countDocuments({
                    _id: { $ne: this._id },
                    email,
                });
                return countDocuments === 0;
            },
            message: "El email ya está registrado",
        },
    },
    logo: {
        type: String,
        required: [ true, "El nombre de la imagen de logo es obligatoria" ],
        trim: true,
    },
    mission: {
        description: {
            type: String,
            required: [ true, "La descripción de la misión es obligatoria" ],
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [ true, "El nombre de la imagen de la misión es obligatoria" ],
            trim: true,
        },
    },
    vision: {
        description: {
            type: String,
            required: [ true, "La descripción de la visión es obligatoria" ],
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [ true, "El nombre de la imagen de la visión es obligatoria" ],
            trim: true,
        },
    },
    values: {
        description: {
            type: String,
            required: [ true, "La descripción de los valores es obligatoria" ],
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [ true, "El nombre de la imagen de los valores es obligatoria" ],
            trim: true,
        },
    },
}, {
    timestamps: true, // Creará dos campos: createdAt y updatedAt
    versionKey: false, // No creará el campo __v
});

const InstitutionModel = model("institutions", institutionSchema);

export default InstitutionModel;