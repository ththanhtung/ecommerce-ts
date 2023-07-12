import { NextFunction, Request, Response } from "express"
import { AuthService } from "../services/auth.service"


class AuthController {
    async signup(req:Request, res:Response, next:NextFunction){
        try {
            res.status(201).send(await AuthService.Signup(req.body))
        } catch (error) {
            next(error)
        }
    }   
}

const authController = new AuthController()

export {
    authController
}