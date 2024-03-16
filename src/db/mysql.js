import Sequelize from 'sequelize';

const sequelize = new Sequelize('gestionArchivos', 'root', 'tu_contraseña', {
  host: '11.0.0.3',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos. mysql');
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err);
  });
export default sequelize;
