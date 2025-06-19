import { postDataServer } from "../../../apiServer.js";
import { renderPremium } from "./index.js";

export const updatePremium = async () => {
    await postDataServer('update_bonus', { 1: 'start' });
    await renderPremium();
}
