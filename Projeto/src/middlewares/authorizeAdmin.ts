import { Request, Response, NextFunction } from 'express';

export function authorizeAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
    }

    const matricula = user.role; 

    if (!matricula.endsWith('03')) {
        res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária.' });
        return;
    }

    next();
}
