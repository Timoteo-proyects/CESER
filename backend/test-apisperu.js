import "dotenv/config";

const dni = "10765725";

const response = await fetch(
    `https://dniruc.apisperu.com/api/v1/dni/${dni}`,
    {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.APISPERU_TOKEN}`,
            Accept: "application/json",
        },
    }
);

const data = await response.json();

console.log("STATUS:", response.status);

console.log(
    "RESPUESTA:",
    JSON.stringify(data, null, 2)
);