import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../config/env.js';
import pool from '../db/database.js';

// Middleware para verificar el token JWT
export default async (req, res, next) => {
    console.log(req.session)
    console.log('-----------')
    console.log(req.cookies)
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

     const decoded = jwt.verify(token, SECRET_KEY);

    // Se busca al usuario en la base de datos      
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    const user = rows[0];

    if (!user) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = user; // Agrega la información del usuario decodificada al request

    next();
};