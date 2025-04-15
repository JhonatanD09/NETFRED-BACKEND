const express = require('express');
const config = require('./config');
import {routes} from './constans/RoutesConstans'

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

app.use(routes.USER_ROUTER, require('../src/routes/user.routes'));
app.use(routes.ZONE_ROUTER, require('../src/routes/zone.routes'));
app.use(routes.CLIENT_ROUTER, require('../src/routes/client.routes'));
app.use(routes.AUTH_ROUTER, require('../src/routes/auth.routes'));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});