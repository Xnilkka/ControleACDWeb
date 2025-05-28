
import { Request, Response, NextFunction } from 'express';

export function authorizeAluno(req: Request, res: Response, next: NextFunction): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Usuário não autenticado' });
    return;
  }

  const matricula = user.role;

  if (!matricula.endsWith('01')) {
    res.status(403).json({ message: 'Acesso negado. Permissão de aluno necessária.' });
    return;
  }

  next();
}
