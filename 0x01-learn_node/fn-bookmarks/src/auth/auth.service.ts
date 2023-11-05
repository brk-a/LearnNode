import { ForbiddenException, Injectable} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService){}
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
            delete user.password // do not return passwd hash
            return user
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

    signup(){
        return "Signed up"
    }
}