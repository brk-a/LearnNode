import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @Post("login")
    login(@Body() dto: AuthDto){
        this.authService.login(dto)
    }

    @Post("signup")
    signup(){
        this.authService.signup()
    }
}