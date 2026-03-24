import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthValidator } from "../validators/AuthValidator";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      console.log(`broooooooooooooo.......... pid=${process.pid}`);
      
      const { email, password } = req.body;
      const validation = AuthValidator.validateLoginInput({ email, password });

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const result = await this.authService.login({ email, password });
      if (!result.ok) {
        return res.status(result.status).json({ message: result.message });
      }

      return res.json(result.data);
    } catch (error) {
      return next(error);
    }
  };
}
