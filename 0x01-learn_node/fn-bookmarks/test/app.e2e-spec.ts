import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { PrismaService } from "src/prisma/prisma.service"
import * as pactum from "pactum"
import { AuthDto } from "src/auth/dto"

describe("app e2e", () => {
    let app: INestApplication
    let prisma: PrismaService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            })
        )

        await app.init()
        await app.listen(3333)

        prisma = app.get(PrismaService)
        await prisma.cleanDb()

        pactum.request.setBaseUrl("http://localhost:3333")
    })
    afterAll(() => {
        app.close()
    })
    describe("auth", () => {
        const dto: AuthDto = {
            email: "goatmatata@example.com",
            password: "goatmatata",
            firstName: "Goat",
            lastName: "Matata",
        }
        describe("login", () => {
            it("should throw error if email empty", () => {
                return pactum.spec()
                    .post("/auth/login")
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(400)
            })
            it("should throw error if password empty", () => {
                return pactum.spec()
                    .post("/auth/login")
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400)
            })
            it("should throw error if no body", () => {
                return pactum.spec()
                    .post("/auth/login")
                    .expectStatus(400)
            })
            it("should log in", () => {
                return pactum.spec()
                    .post("/auth/login")
                    .withBody({
                        email: dto.email,
                        password: dto.password,
                    })
                    .expectStatus(200)
            })
        })
        describe("signup", () => {
            it("should throw error if email empty", () => {
                return pactum.spec()
                    .post("/auth/signup")
                    .withBody({
                        password: dto.password,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                    })
                    .expectStatus(400)
            })
            it("should throw error if password empty", () => {
                return pactum.spec()
                    .post("/auth/signup")
                    .withBody({
                        email: dto.email,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                    })
                    .expectStatus(400)
            })
            it("should throw error if email and password empty", () => {
                return pactum.spec()
                    .post("/auth/signup")
                    .withBody({
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                    })
                    .expectStatus(400)
            })
            it("should throw error if no body", () => {
                return pactum.spec()
                    .post("/auth/signup")
                    .expectStatus(400)
            })
            it("should sign up a user", () => {
                return pactum.spec()
                    .post("/auth/signup")
                    .withBody(dto)
                    .expectStatus(201)
            })
        })
    })
    describe("user", () => {
        describe("get user/me", () => { })
        describe("edit user", () => { })
    })
    describe("bookmark", () => {
        describe("create bookmark", () => { })
        describe("get all bookmarks", () => { })
        describe("get bookmark by id", () => { })
        describe("edit bookmark", () => { })
        describe("delete bookmark", () => { })
    })
})
