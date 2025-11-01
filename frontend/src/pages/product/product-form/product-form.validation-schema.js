import * as Yup from "yup";

const NAME_MAX_LENGTH = 25;
const DESCRIPTION_MAX_LENGTH = 100;

export const validationSchema = Yup.object({
    name: Yup
        .string()
        .max(NAME_MAX_LENGTH, `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`)
        .required("El nombre es obligatorio"),
    description: Yup
        .string()
        .max(DESCRIPTION_MAX_LENGTH, `La descripción no puede tener más de ${DESCRIPTION_MAX_LENGTH} caracteres`),
    price: Yup
        .number()
        .min(1, "El precio debe ser mayor que 0")
        .required("El precio es obligatorio")
        .typeError("El precio debe ser un número"),
    stock: Yup
        .number()
        .min(0, "El stock no puede ser negativo")
        .required("El stock es obligatorio")
        .typeError("El stock debe ser un número"),
    thumbnail: Yup
        .string()
        .required("La imagen es obligatoria")
        .typeError("La imagen debe ser de tipo string"),
});