import pool from '../db/database.js';

export const controllers = {
    register: async (req, res) => {
        const { username, password } = req.body;
    
        try {
            // Verificar si el usuario ya existe
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length > 0) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }
    
            // Crear nuevo usuario
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error del servidor' });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Buscar usuario en la base de datos
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

            if (rows.length > 0) {
                const user = rows[0];

                // Guardar información del usuario en la sesión
                req.session.userId = user.id;
                req.session.username = user.username;

                return res.json({ 
                    message: 'Inicio de sesión exitoso', 
                    user: { id: user.id, username: user.username } 
                });
            } else {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error del servidor' });
        }
    },
    session: async (req, res) => {
        if (req.session.userId) {
            try {
                // Buscar usuario en la base de datos
                const [rows] = await pool.query('SELECT id, username FROM users WHERE id = ?', [req.session.userId]);

                if (rows.length > 0) {
                    const user = rows[0];
                    return res.json({ 
                        loggedIn: true, 
                        user: { id: user.id, username: user.username } 
                    });
                } else {
                    return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error del servidor' });
            }
        } else {
            return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
        }
    },
    logout:(req, res) => {
            console.log(req.session)
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Error al cerrar la sesión' });
                }
                res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
                return res.json({ message: 'Sesión cerrada exitosamente' });
        });;    
    }
}