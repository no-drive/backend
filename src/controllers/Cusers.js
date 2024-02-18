import sequelize from '../db/mysql.js';
import jwt from 'jsonwebtoken';
import fs from 'fs-extra';
import { path, rmAllFiles } from './Cfiles.js';
import crypto from 'crypto';
/**
 * Controlador para la administracion de los usuarios
 */
const secretKey = 'CLAVE';
//Encryptacion de la contraseña en texto plano
async function encrypt(plaintextPassword) {
  return await crypto.createHash('sha256').update(plaintextPassword).digest('hex');
}
export async function insertUser(newUser) {
  //Agregar usuario ala base de datos de mongo db
  const nombreUsuario = newUser.username;
  const usuarioEmail = newUser.email;
  const pwd = await encrypt(newUser.pwd);

  //Agregar usuario a la base de datos de MySql por medio de un procedimiento almacenado
  try {
    const [results] = await sequelize.query('CALL InsertUsuarios(:usuarioEmail, :nombreUsuario, :pwd)', {
      replacements: { usuarioEmail, nombreUsuario, pwd }
    });
    return results;
  } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    return error.original.sqlMessage;
  }
}
async function login(user) {
  return new Promise(async (resolve, reject) => {
    const _email = user.email;
    const _pwd = await encrypt(user.pwd);
    try {
      //Ingreso de usuario base de datos con procedimiento almacenado
      const [results] = await sequelize.query('CALL login(:_email,:_pwd)', {
        replacements: { _email, _pwd }
      });

      resolve(results);
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      reject(error.original.sqlMessage);
    }
  })
}
export async function rmUser(idusuario) {
  //Eliminar toda la carpeta correcpondiente al usuario
  rmAllFiles(idusuario);
  const _path = path + 'files/' + idusuario;
  fs.remove(_path)
    .then(() => {
      console.log('Carpeta eliminada exitosamente');
    })
    .catch((err) => {
      console.error('Error al eliminar la carpeta:', err);
    });
  //Eliminar un usuario de la base de datos de MySql
  try {
    await sequelize.query('CALL rmUser(' + idusuario + ')');
    return { Response: "Usuario eliminado correctamente" };
  } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    return { response: error };
  }

}
export async function _login(data) {

  return new Promise(async (resolve, reject) => {
    const userData = await login(data);
    if (!userData || userData === undefined) {
      reject({ error: 'credenciales invalidas' });
    } else {
      //Luego de que el usuario se halla logado se genera el JWT
      const payload = {
        //payload de cosas del usuario
        userId: userData.idusuario,
        username: userData.nameusuario
      }
      console.log("Generando JWT😊")
      // Genera el JWT
      jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.error('Error al generar el JWT:', err);
          reject({ error: 'Error interno del servidor' });
        }
        // Envía el JWT como respuesta al cliente
        resolve({ token: token, userData: userData });
      });
    }
  })
}
export async function chpass(data) {
  const pass = await encrypt(data.pass);
  const idusuario = data.userId;
  try {
    //Procedimiento almacenado para cambiar la contraseña del usuario
    const [results] = await sequelize.query('CALL chPass(:pass,:idusuario)', {
      replacements: { pass, idusuario }
    });
    return { response: "Contraseña cambiada exitosamente" };
  } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    return error;
  }
}
//Validacion del JWT del usuario
export function validacionUser(req, res) {
  let token = req.header('Authorization');
  try {
    token = ((req.header('Authorization')).replace('Bearer', '')).replace(' ', '');
  } catch {
  }
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado.' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.body = { ...decoded, ...req.body };
    return res.status(200).json({ response: 'validado', userData: decoded });
  } catch (error) {
    // Si hay un error al validar el JWT, devuelve null o lanza una excepción según tus necesidades
    if (error instanceof jwt.TokenExpiredError) {
      // El token ha expirado
      return res.status(401).json({ error: 'El token ha expirado' });
    } else {
      return res.status(401).json({ error: 'Token inválido.' });
    }
  }
}
export function allPeople() {
  return new Promise(async (resolve, reject) => {

    try {
      //Traer todos los usuarios que se encuentran logeados en la aplicación 
      const [results] = await sequelize.query('	select idusuario,nameUsuario from _gestionArchivos.usuarios;', { raw: true, type: sequelize.QueryTypes.RAW, multiple: true });
      console.log(results);
      resolve(results);
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      reject(error.original.sqlMessage);
    }
  })
}