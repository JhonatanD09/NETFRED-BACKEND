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
app.use(routes.PLAN_ROUTER, require('../src/routes/plan.routes'));
app.use(routes.STATUS_ROUTER, require('../src/routes/status.routes'));
app.use(routes.SERVICE_ROUTER, require('../src/routes/service.routes'));
app.use(routes.CONTRATO_ROUTER, require('../src/routes/contrato.routes'));
app.use('/api/v1/invoice', require('../src/routes/invoice.routes'));
app.use(routes.CUENTACOBRO_ROUTER, require('../src/routes/collectionAccount.routes'));
app.use(routes.METODOPAGO_ROUTER, require('../src/routes/metodoPago.routes'));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});