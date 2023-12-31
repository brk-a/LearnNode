import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() dto: AuthDto){
        await this.authService.login(dto)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("signup")
    async signup(@Body() dto: AuthDto){
        await this.authService.signup(dto)
    }
}