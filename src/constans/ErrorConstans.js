export const userMessages = {
    USER_EXIST: 'Ya existe un usuario con ese email',
    USER_ADD: 'Usuario creado correctamente',
    USER_NOT_ADD : 'Usuario no creado'
}

export const zonesMessages = {
    ZONE_EXIST: 'Ya existe una zona con ese id',
    ZONE_ADD: 'Zona creada correctamente',
    ZONE_NOT_ADD : 'Zona no creada',
    ZONE_NOT_FOUND:'Zona no encontrada',
    ZONE_DELETED:'Zona eliminada',
    ZONE_NOT_DELETED:'La Zona no se ha eliminado',
    ERROR_SEARCH_ZONE: 'Error al buscar la zona',
    ZONE_UPDATED: 'Zona actualizada correctamente',
    ZONE_NOT_UPDATED: 'Error al actualizar la zona',
    GET_ALL_ZONES_ERROR: 'Error al obtener todas las zonas',
    ZONE_CLIENTS_NOT_FOUND: 'No se encontraron clientes en la zona especificada.',
    ZONE_CLIENTS_FETCH_ERROR: 'Error al buscar clientes por zona.'
}

export const planesMessages = {
    PLAN_EXIST: 'Ya existe un plan con ese nombre',
    PLAN_ADD: 'Plan creado correctamente',
    PLAN_NOT_ADD : 'Plan no creado',
    PLAN_NOT_FOUND:'Plan no encontrado',
    PLAN_DELETED:'Plan eliminado',
    PLAN_NOT_DELETED:'El plan no se ha eliminado',
    ERROR_SEARCH_PLAN: 'Error al buscar el plan',
    PLAN_UPDATED: 'Plan actualizadao correctamente',
    PLAN_NOT_UPDATED: 'Error al actualizar el plan',
    GET_ALL_PLAN_ERROR: 'Error al obtener todos los planes',
    ERROR_CHANGE_STATUS_BY_SERVICE_ASSOCIATED: 'No se puede inactivar el plan porque existen servicios activos asociados.'
}

export const statusMessages = {
    STATUS_EXIST: 'Ya existe un estado con ese nombre',
    STATUS_ADD: 'Estado creado correctamente',
    STATUS_NOT_ADD : 'Estado no creado',
    STATUS_NOT_FOUND:'Estado no encontrado',
    STATUS_DELETED:'Estado eliminado',
    STATUS_NOT_DELETED:'El estado no se ha eliminado',
    ERROR_SEARCH_STATUS: 'Error al buscar el estado',
    STATUS_UPDATED: 'Estado actualizado correctamente',
    STATUS_NOT_UPDATED: 'Error al actualizar el estado',
    GET_ALL_STATUS_ERROR: 'Error al obtener todos los estados'
}

export const servicesMessages = {
    SERVICE_NOT_FOUND:'Servicio no encontrado',
    ERROR_SEARCH_SERVICE: 'Error al buscar el servicio',
    SERVICE_ADD: 'Servicio creado correctamente',
    SERVICE_NOT_ADD : 'Servicio no creado',
    SERVICE_DELETED:'Servicio eliminado',
    SERVICE_NOT_DELETED:'El servicio no se ha eliminado',
    SERVICE_UPDATED: 'Servicio actualizado correctamente',
    SERVICE_NOT_UPDATED: 'Error al actualizar el servicio',
    GET_ALL_SERVICE_ERROR: 'Error al obtener todos los servicios',
    SERVICE_HAS_CONTRACTS: 'No puede cambiar el estado del servicio porque cuenta con contratos activos'
}

export const clientsMessages = {
    CLIENT_EXIST: 'Ya existe un cliente con ese numero de cedula',
    CLIENT_ADD: 'Cliente creado correctamente',
    CLIENT_NOT_ADD : 'Cliente no creado',
    CLIENT_NOT_FOUND:'Cliente no encontrado',
    CLIENT_DELETED:'Cliente eliminado',
    CLIENT_NOT_DELETED:'El Cliente no se ha eliminado',
    ERROR_SEARCH_CLIENT: 'Error al buscar el Cliente',
    CLIENT_UPDATED: 'Cliente actualizado correctamente',
    CLIENT_NOT_UPDATED: 'Error al actualizar el Cliente',
    NO_CLIENTS : 'No se encontraton clientes'
}

export const valideRolesMessages = {
    NO_ROLE_REQUIRED: 'No cuentas con los permisos para acceder a este recurso'
}

export const contratoMessages = {
    CONTRATO_ADD: "Contrato creado correctamente",
    ERROR_CONTRATO_ADD: "Error al crear el contrato",
    CONTRATO_BY_START_DATE_NOT_FOUND: "No se encontraron contratos con esa fecha de inicio",
    ERROR_SEARCH_CONTRATO_BY_START_DATE: "Error al buscar contratos por fecha",
    SEARCH_CONTRATO_BY_STATUS_NOT_FOUND: "No se encontraron contratos con ese estado.",
    ERROR_SEARCH_CONTRATO_BY_STATUS: "Error al buscar contrato por estado.",
    SEARCH_CONTRATO_BY_ID_CLIENT_NOT_FOUND: "No se encontraron contratos para ese cliente.",
    ERROR_SEARCH_CONTRATO_BY_ID_CLIENT: "Error al buscar contrato por cliente.",
    CONTRATO_NOT_FOUND: "Contrato no encontrado",
    CONTRATO_DELETED: "Contrato eliminado correctamente",
    CONTRATO_NOT_DELETED: "Error al eliminar el contrato",
    CONTRATO_UPDATED: "Contrato actualizado correctamente",
    CONTRATO__NOT_UPDATED: "Error al actualizar el contrato",
    ERROR_GET_ALL_CONTRATO: "Error al obtener los contratos"
}

export const cuentaCobroMessages = {
    CUENTA_ADD: "Cuenta de cobro creada correctamente",
    ERROR: "Error",
    CUENTA_NO_ENCONTRADA: "Cuenta de cobro no encontrada",
    CUENTA_UPDATE: "Cuenta de cobro actualizada correctamente",
    CUENTA_DELETED: "Cuenta de cobro eliminada correctamente",
    CUENTACOBRO_NOT_FOUND: "Cuenta de cobro no encontrada"
}

export const metodoPagoMessages = {
    METODOPAGO_ADD: "Metodo de pago creado correctamente",
    ERROR: "Error",
    METODOPAGO_NO_ENCONTRADO: "Metodo de pago no encontrado",
    METODOPAGO_UPDATE: "Metodo de pago actualizado correctamente",
    METODOPAGO_DELETED: "Metodo de pago eliminado correctamente",
    METODOPAGO_EXISTENTE: "Ya existe un metodo de pago con ese nombre",
    METODOPAGO_NOT_FOUND: "Metodo de pago no encontrado"
}
