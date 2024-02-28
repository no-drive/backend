import mongoose from 'mongoose';

mongoose.connect('mongodb://192.168.56.1:27017/nueva', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos de mongo:'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos.');
});

export default db;
