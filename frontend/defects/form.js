import * as components from "../components.js";
import { getServerApi } from "../apiServer.js";

export async function getForm () {

  const defects = await getServerApi("defects");
  const bnts = document.querySelectorAll('.btn');

  bnts.forEach(btn => {
    btn.addEventListener('click', function (e) {
        let defect = defects.find (el => e.target.dataset.id === `${el.soldAtLocal}+${el.productId}`)

    });
  });

}