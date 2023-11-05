import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @Post("login")
    async login(@Body() dto: AuthDto){
        await this.authService.login(dto)
    }

    @Post("signup")
    async signup(@Body() dto: AuthDto){
        await this.authService.signup(dto)
    }
}