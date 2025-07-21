export const URL = process.env.API_URL || 'http://localhost:1880/api';
export const SUPPORT_URL = process.env.SUPPORT_URL;

localStorage.setItem("URL", URL)
localStorage.setItem("ENV.API_URL", process.env.API_URL)
