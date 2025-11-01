import { Schema, model } from "mongoose";

const NAME_MAX_LENGTH = 25;
const DESCRIPTION_MAX_LENGTH = 100;

const productSchema = new Schema({
    name: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        max: [ NAME_MAX_LENGTH, `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres` ],
    },
    description: {
        type: String,
        trim: true,
        max: [ DESCRIPTION_MAX_LENGTH, `La descripción no puede tener más de ${DESCRIPTION_MAX_LENGTH} caracteres` ],
    },
    price: {
        type: Number,
        required: [ true, "El precio es obligatorio" ],
        min: [ 1, "El precio debe ser mayor que 0" ],
    },
    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: [ 0, "El stock no puede ser negativo" ],
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true,
    },
    highlighted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Creará dos campos: createdAt y updatedAt
    versionKey: false, // No creará el campo __v
});

const ProductModel = model("products", productSchema);

export default ProductModel;