import { share, rmShare, notify } from '../controllers/Cshare.js';

// routes/users.js
import express from 'express';
import { validacion } from '../middlewares/auth.js';
const router = express.Router();

// Ruta para el compartir un acrhivo con un usuario
router.post('/share', validacion, async (req, res) => {
    res.send(await notify(req.body.idFile, req.body.userId));
});
//Eliminar una archivo compartido
router.delete('/rmShare', validacion, async (req, res) => {
    res.send(await rmShare(req.body.idFile, req.body.userId));
});
//Aceptar cuando se comparte un archivo
router.post('/shareAcept', validacion, async (req, res) => {
    res.send(await share(req.body.idFile, req.body.userId));
})
//Denegar el compartir con un archivo
router.delete('/shareDeny', validacion, async (req, res) => {
    res.send(await share(req.body.idFile, req.body.userId));
});
//Validar el funcionamiento de esta ruta
router.post('/healthcheck', (req, res) => {
    res.send({ "responnse": 200 });
});

export default router;
