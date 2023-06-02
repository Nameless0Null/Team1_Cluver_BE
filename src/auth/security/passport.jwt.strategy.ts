import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'secretkey'
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const manager = await this.authService.tokenValidateManager(payload);
        if(!manager) {
            return done(new UnauthorizedException({message: 'This manager does not exist'}), false);
        }
        return done(null, manager);
    }
}