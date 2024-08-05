import {Request} from 'express'
import { JwtBodyInterface } from './jwt-body.interface'



export interface AuthenticatedUserRequestInterInterface extends Request {
    user?:JwtBodyInterface
}