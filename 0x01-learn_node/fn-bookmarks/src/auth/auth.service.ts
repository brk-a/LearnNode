import { Injectable} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService){}
    async login(dto: AuthDto){
        const hash = await argon.hash(dto.password)
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
    }

    signup(){
        return "Signed up"
    }
}