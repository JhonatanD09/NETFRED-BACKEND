const express = require('express');
const config = require('./config');
const app = express();
const port = config.app.port

app.use(express.json());

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');  
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Captcha-Key, X-Requested-With,' +
		'Content-Type, Accept, Access-Control-Allow-Request-Method'
	); 
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'); 
	next(); 
});

app.use('/api/v1/user', require('../src/routes/user.routes'));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});