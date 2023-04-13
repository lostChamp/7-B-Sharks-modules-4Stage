import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ROLES_KEY} from "./roles-auth.decorator";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]);
            if(!requiredRoles) {
                return true;
            }
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];

            if(bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({message: "Пользователь не авторизован"});
            }

            const user = this.jwtService.verify(token);
            req.user = user;

            return user.roles.some(role => requiredRoles.includes(role.value));
        }catch (err) {
            throw new HttpException({message: "Нет доступа"}, HttpStatus.FORBIDDEN);
        }
    }
}