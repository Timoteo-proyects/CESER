import {
    consultarDNI,
    consultarRUC
} from "../services/apisperu.service.js";

export const consultarDNIController = async (req, res) => {

    try {

        const { dni } = req.params;

        if (!/^\d{8}$/.test(dni)) {
            return res.status(400).json({
                ok: false,
                mensaje: "El DNI debe contener exactamente 8 dígitos."
            });
        }

        const data = await consultarDNI(dni);

        if (!data.success) {
            return res.status(404).json({
                ok: false,
                encontrado: false,
                mensaje: data.message || "No se encontraron resultados."
            });
        }

        res.json({
            ok: true,
            encontrado: true,
            cliente: {
                dni: data.dni,
                nombres: data.nombres || "",
                apellido_paterno: data.apellidoPaterno || "",
                apellido_materno: data.apellidoMaterno || ""
            }
        });

    } catch (error) {

        console.error(
            "Error consultando DNI:",
            error
        );

        res.status(500).json({
            ok: false,
            mensaje:
                error.message ||
                "Error consultando DNI."
        });
    }
};


export const consultarRUCController = async (req, res) => {

    try {

        const { ruc } = req.params;

        if (!/^\d{11}$/.test(ruc)) {
            return res.status(400).json({
                ok: false,
                mensaje: "El RUC debe contener exactamente 11 dígitos."
            });
        }

        const data = await consultarRUC(ruc);

        if (!data || !data.ruc) {
            return res.status(404).json({
                ok: false,
                encontrado: false,
                mensaje: "No se encontraron resultados para este RUC."
            });
        }

        res.json({
            ok: true,
            encontrado: true,

            empresa: {
                ruc: data.ruc,

                razon_social:
                    data.razonSocial || "",

                nombre_comercial:
                    data.nombreComercial || "",

                direccion:
                    data.direccion || "",

                telefono:
                    Array.isArray(data.telefonos)
                        ? data.telefonos[0] || ""
                        : data.telefonos || "",

                departamento:
                    data.departamento || "",

                provincia:
                    data.provincia || "",

                distrito:
                    data.distrito || "",

                estado:
                    data.estado || "",

                condicion:
                    data.condicion || "",

                ubigeo:
                    data.ubigeo || ""
            }
        });

    } catch (error) {

        console.error(
            "Error consultando RUC:",
            error
        );

        res.status(500).json({
            ok: false,
            mensaje:
                error.message ||
                "Error consultando RUC."
        });
    }
};