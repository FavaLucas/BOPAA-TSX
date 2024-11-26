const fs = require('fs');

// Cambia 'ruta/a/hola.JSON' por la ruta real de tu archivo JSON
const rutaArchivo = 'C:\\Users\\Usuario\\Desktop\\DWFS\\2do Año\\4to Cuatrimestre\\BOPAA-TSX\\BOPAA-TSX\\Backend\\src\\hola.JSON';

// Leer el archivo JSON
fs.readFile(rutaArchivo, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    try {
        // Parsear el contenido JSON
        const jsonArray = JSON.parse(data);

        // Comprobar si es un arreglo
        if (Array.isArray(jsonArray)) {
            console.log(`El archivo contiene ${jsonArray.length} elementos.`);
        } else {
            console.log('El contenido del archivo no es un arreglo.');
        }
    } catch (parseError) {
        console.error('Error al parsear el JSON:', parseError);
    }
});