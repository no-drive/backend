import { upload, addMongo, findUser, rmFile, rmAllFiles, _getShare } from '../controllers/Cfiles.js';
import { decoded, validacion } from '../middlewares/auth.js';
// routes/users.js
import express from 'express';
const router = express.Router();

//Ruta para añadir un archivo
router.post('/AddFile', validacion, upload.single('file'), async (req, res) => {
    const file = req.file
    if (file) {
        let token = req.header('Authorization');
        addMongo({ ...req.body, ...decoded(token) });
    }
    res.status(200).send({ Response: 'Archvio Subido Correctamente' });
});

//Ruta para obtener todos los archivos
router.get('/get', validacion, async (req, res) => {
    res.send(await findUser(req.body.userId))
});

//Ruta para eliminar un archivo
router.delete('/rmFile', validacion, async (req, res) => {
    res.send(await rmFile(req.body.userId, req.body.idFile));

});

//Remover todos los archivos de un usuario
router.delete('/rmAllFiles', validacion, async (req, res) => {
    res.send(await rmAllFiles(req.body.userId, res));
})

//Obtener los archivos compartidos con el usuario
router.get('/getshare', validacion, async (req, res) => {
    res.send(await _getShare(req.body.userId));
});

export default router;
