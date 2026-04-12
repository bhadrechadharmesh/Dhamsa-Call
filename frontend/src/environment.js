const IS_PROD = import.meta.env.PROD;

const server = IS_PROD
    ? "https://dhamsa-call.onrender.com"
    : "http://localhost:8000";

export default server;