const APISPERU_TOKEN = process.env.APISPERU_TOKEN;

const APISPERU_BASE_URL =
    "https://dniruc.apisperu.com/api/v1";

export const consultarDNI = async (dni) => {

    const response = await fetch(
        `${APISPERU_BASE_URL}/dni/${dni}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${APISPERU_TOKEN}`,
                Accept: "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Error consultando DNI en APISPERU."
        );
    }

    return data;
};

export const consultarRUC = async (ruc) => {
    const response = await fetch(
        `${APISPERU_BASE_URL}/ruc/${ruc}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${APISPERU_TOKEN}`,
                Accept: "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.mensaje ||
            "Error consultando RUC en APISPERU."
        );
    }

    return data;
};