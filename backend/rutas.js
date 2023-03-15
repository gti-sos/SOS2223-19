const express = require("express");
const router = express.Router();
const peticiones = require('./peticiones');

const BASE_API_URL = "/api/v1";
const JLN = BASE_API_URL + "/occupation-stats";

router.get(JLN,peticiones.cargaDatos);
router.get(JLN+'/loadInitialData',peticiones.cargaInicial);
router.get(JLN+'/:province/:month',peticiones.cargaValorCampo);
// router.get(JLN+'/:province',peticiones.cargaValorCampo);
// router.get(JLN+'/:month',peticiones.cargaValorCampo);
router.get(JLN+'/:campo',peticiones.cargaListCampo);
router.post(JLN,peticiones.postObjeto);
router.post(JLN+'/:campo',peticiones.errPosteo);
router.put(JLN+'/:campo/:dato',peticiones.actualizarObj);
router.put(JLN,peticiones.errActualizar);
router.delete(JLN+ '/:campo',peticiones.borrarCampo);
router.delete(JLN+ '/:campo/:valor',peticiones.borrarValorCampo);

module.exports = router;    