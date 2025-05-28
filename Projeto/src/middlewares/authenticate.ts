
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token de autenticação não fornecido' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET || 'chave-secreta';
        const decoded = jwt.verify(token, secret) as any;

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
        return;
    }
}
