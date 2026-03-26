import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../services/interfaces/IAuthService";
import { StatusCode } from "../constants/statusCodes";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async login(req: Request, res: Response, next: NextFunction){
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      if (!result.ok) {
        return res.status(result.status).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(StatusCode.OK).json(result.data);
    } catch (error) {
      return next(error);
    }
  }
}
