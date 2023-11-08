import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { PrismaService } from "src/prisma/prisma.service"
import * as pactum from "pactum"
import { AuthDto } from "src/auth/dto"
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto"

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
                    .stores("userAt", "access_token")
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
                    .stores("userAt", "access_token")
            })
        })
    })
    describe("user", () => {
        describe("get user/me", () => {
            it("should get current user", () => {
                return pactum.spec()
                    .get(`/users/me`)
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
            })
        })
        describe("edit user", () => {
            it("should return 200 when user data is edited", () => {
                return pactum.spec()
                    .patch("/users/")
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        firstName: "Dada",
                        lastName: "Ng'ombe",
                        email: "dadang'ombe@example.com"
                    })
                    .expectStatus(200)
            })
        })
    })
    describe("bookmark", () => {
        describe("create bookmark", () => {
            const dto: CreateBookmarkDto = {
                title: "The Goat Podcast",
                link: "http://goatpodcast.com"
            }
            it("creates a bookmark", () => {
                return pactum.spec()
                    .post("/bookmarks")
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores("bookmarkId", "id")
            })
        })
        describe("get empty bookmarks", () => {
            it("should return empty body", () => {
                return pactum.spec()
                    .get("/bookmarks")
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
                    .expectBody([])
            })
        })
        describe("get all bookmarks", () => {
            it("fetches al bookmarks", () => {
                return pactum.spec()
                    .get("/bookmarks")
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(1)
            })
        })
        describe("get bookmark by id", () => {
            it("should get a bookmark by id", () => {
                return pactum.spec()
                    .get("/bookmarks/{id}")
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{bookmarkId}')
            })
        })
        describe("edit bookmark", () => {
            const dto: EditBookmarkDto = {
                title: "The GOAT Podcast",
                description: "Goat Matata's podcast",
            }
            it("should edit a bookmark", () => {
                return pactum.spec()
                    .patch("/bookmarks/{id}")
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description)
            })
        })
        describe("delete bookmark", () => {
            it("should delete a bookmark", () => {
                return pactum.spec()
                    .delete("/bookmarks/{id}")
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(204)
            })
            it("should return empty body", () => {
                return pactum.spec()
                    .get("/bookmarks")
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
                    .expectJsonLength(0)
            })
        })
    })
})
