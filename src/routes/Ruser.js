import { insertUser, _login, rmUser, chpass, validacionUser, allPeople } from '../controllers/Cusers.js';

// routes/users.js
import express from 'express';
import { validacion } from '../middlewares/auth.js';
const router = express.Router();

// Ruta para el perfil del usuario (requiere autenticación)
router.post('/Register', async (req, res) => {
  console.log("existo");
  res.json({ response: await insertUser(req.body.user) }); // Renderiza la vista del perfil y pasa los datos del usuario
});
router.post('/login', async (req, res) => {
  res.json({ response: await _login(req.body.user).catch((respuesta) => { return respuesta }) }); // Renderiza la vista del perfil y pasa los datos del usuario
});
// Ruta para editar el perfil del usuario (requiere autenticación)
router.delete('/DeleteUser', validacion, (req, res) => {
  res.json(rmUser(req.body.userId));
});
// Ruta para cambiar la contraseña
router.patch('/chpass', validacion, async (req, res) => {
  res.json(await chpass(req.body));
});
//Ruta para validar el usuario
router.post('/validate', validacionUser, (req, res) => {
});
//Ruta para Obtener todas las personas dentro de la aplicación
router.get('/people', validacion, async (req, res) => {
  res.json({ response: await allPeople() });
})
export default router;
