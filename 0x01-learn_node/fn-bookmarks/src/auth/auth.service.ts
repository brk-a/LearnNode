import { ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ){}
    async login(dto: AuthDto){
        const hash = await argon.hash(dto.password)
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    first_name: dto.firstName,
                    last_name: dto.lastName,
                },
            })
            // delete user.password // do not return passwd hash
            return this.signToken(String(user.id), user.email)
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code==='P2002'){
                    throw new ForbiddenException("credentials taken")
                }
            }
            console.info("authServiceError", error)
            throw error
        }
    }

    async signup(dto: AuthDto){
        const email = dto.email
        const password = dto.password
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            })
            if(!user){
                throw new NotFoundException("invalid email or password")
            }
            const pwMatches = await argon.verify(user.password, password)
            if(!pwMatches){
                throw new NotFoundException("invalid email or password")
            }
            // delete user.password // do not return passwd hash
            return this.signToken(String(user.id), user.email)
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code==="P2001"){
                    throw new NotFoundException("invalid email or password")
                }
            }
            console.info("authServiceError", error)
            throw error
        }
    }

    async signToken(userId: string, email: string){
        const secret = this.config.get("JWT_SECRET")
        const payload = {
            sub: userId,
            email,
        }

        const token =  this.jwt.signAsync(payload, {
            expiresIn: "15m",
            secret,
        })

        return {
            access_token: token,
        }
    }
}