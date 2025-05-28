import { Router, Request, Response } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authenticate } from '../middlewares/authenticate';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();


usuarioRoutes.post('/login', async (req: Request, res: Response) => {
  await usuarioController.login(req, res);
});


usuarioRoutes.put('/update-password', authenticate, async (req: Request, res: Response) => {
  await usuarioController.updateYourselfPass(req, res);
});

export default usuarioRoutes;
