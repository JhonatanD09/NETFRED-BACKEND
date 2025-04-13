import pool from '../database'

const createZone = async (zone)=>{
    console.log("la zona", zone);
    return (await pool).query('INSERT INTO ZONAS SET ?',zone)
}

const searchZoneByName = async (name)=>{
    return(await pool).query('SELECT * FROM ZONAS WHERE nombre = ?',name)
}

const searchZoneByID = async (id)=>{
    return(await pool).query('SELECT * FROM ZONAS WHERE id_zona = ?',id)
}

const deleteZone = async (id)=>{
    return(await pool).query('DELETE FROM ZONAS WHERE id_zona = ?',id)
}

const updateZone = async (zone, id) => {
    return (await pool).query(
        'UPDATE ZONAS SET nombre = ?, detalles = ? WHERE id_zona = ?',
        [zone.nombre, zone.detalles, id]
    );
};


module.exports = {
    createZone,
    searchZoneByName,
    searchZoneByID,
    deleteZone,
    updateZone
}