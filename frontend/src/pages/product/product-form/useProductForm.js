// frontend/src/pages/products/product-form/useProductForm.js
import AppContext from "@/contexts/AppContext";
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialValues } from "./product-form.initial-value.js";
import { validationSchema } from "./product-form.validation-schema.js";

// helper: ¿es un File?
const isFile = (v) =>
    v &&
  typeof v === "object" &&
  typeof v.name === "string" &&
  (v instanceof File || typeof v.size === "number");

const useProductForm = (idProduct) => {
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const { productsContext } = useContext(AppContext);
    const { updateProduct, createProduct, fetchProducts, fetchProductById } = productsContext;
    const navigate = useNavigate();

    // guardamos la URL de preview para revocarla cuando cambie el file
    const previewUrlRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            // Aseguramos tipos:
            // - thumbnail (string) para InputImage (lo que muestra/espera)
            // - thumbnailFile (File) se usa solo para enviar al backend
            thumbnail: initialValues?.thumbnail ?? "", // string (URL o "")
            thumbnailFile: null, // File real
            image: null, // por compatibilidad si algún input usa "image"
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            // Enviamos SIEMPRE el file real si existe
            const file =
        isFile(values.thumbnailFile)
            ? values.thumbnailFile
            : isFile(values.image)
                ? values.image
                : null;

            const payload = {
                ...values,
                thumbnail: file, // <- la API lo mandará como FormData 'thumbnail'
            };

            if (idProduct) {
                await updateProduct(idProduct, payload);
            } else {
                await createProduct(payload);
            }

            setIsSubmitted(true);
            await fetchProducts();
        },
    });

    // 🔧 Adaptación clave:
    // Si algún componente (InputImage) mete un File en "thumbnail",
    // lo movemos a "thumbnailFile" y convertimos "thumbnail" a una URL (string) para el preview.
    useEffect(() => {
        const currentThumb = formik.values.thumbnail;

        if (isFile(currentThumb)) {
            // Revocar preview anterior
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }

            // Guardar el File real y generar preview string
            formik.setFieldValue("thumbnailFile", currentThumb, false);
            const url = URL.createObjectURL(currentThumb);
            previewUrlRef.current = url;

            // Reemplazar thumbnail (que ve InputImage) por la URL string
            formik.setFieldValue("thumbnail", url, false);
        }

    }, [formik.values.thumbnail]);

    // Compat extra: si algún input guarda en "image", reflejar en thumbnailFile/thumbnail
    useEffect(() => {
        const img = formik.values.image;
        if (isFile(img) && !isFile(formik.values.thumbnailFile)) {
            // revocar anterior
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
            formik.setFieldValue("thumbnailFile", img, false);
            const url = URL.createObjectURL(img);
            previewUrlRef.current = url;
            formik.setFieldValue("thumbnail", url, false); // string para InputImage
        }

    }, [formik.values.image]);

    // Limpieza del objectURL al desmontar
    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    // tu misma regla, pero dejando pasar edición sin nuevo archivo si ya hay thumbnail string
    const isSubmitDisabled = () => {
        const hasValidFile = isFile(formik.values.thumbnailFile) || isFile(formik.values.image);
        const hasPreviewString = typeof formik.values.thumbnail === "string" && formik.values.thumbnail.length > 0;

        // Para crear: exigir file o al menos un thumbnail string
        // Para editar: permitir si ya hay thumbnail string aunque no se suba file nuevo
        const hasImageOk = idProduct ? (hasValidFile || hasPreviewString) : (hasValidFile || hasPreviewString);

        return (
            isSubmitted ||
      !formik.values.name ||
      formik.values.price <= 0 ||
      formik.values.stock < 0 ||
      !formik.isValid ||
      !hasImageOk
        );
    };

    const close = () => {
        formik.resetForm();
        navigate("/products");
    };

    const cancel = () => {
        formik.resetForm();
        navigate("/products");
    };

    const loadProduct = async (id) => {
        const product = await fetchProductById(id);
        // No insertamos strings remotos como File.
        // thumbnail (string) se usa para mostrar la imagen actual.
        formik.setValues({
            ...product,
            thumbnail: product?.thumbnail || "", // URL ya guardada en BD
            thumbnailFile: null, // sin file al iniciar
            image: null,
        });
    };

    useEffect(() => {
        if (idProduct) {
            loadProduct(idProduct);
        }

    }, [idProduct]);

    return {
        formik,
        isSubmitDisabled,
        isSubmitted,
        close,
        cancel,
    };
};

export default useProductForm;