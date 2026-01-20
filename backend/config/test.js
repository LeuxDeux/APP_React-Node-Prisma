const pool = require('./database');

async function testSimple() {
    try {
        const [rows] = await pool.query('SELECT NOW() AS currentTime;');
        console.log('Conexión Exitosa. Hora actual de la base de datos:', rows[0].currentTime);

        const [products] = await pool.query('SELECT * FROM products_db.products;');
        console.log('Productos:', products);
    } catch (error) {
        console.error('Error durante la prueba de conexión:', error);
    } finally {
        await pool.end();
    }
}

testSimple();
// pool.query('SELECT * FROM products_db.products;', (err, results) => {
//     if (err) {
//         console.error('Error executing query:', err);
//     }else{
//         console.log('Query results:', results);
//     }
// });