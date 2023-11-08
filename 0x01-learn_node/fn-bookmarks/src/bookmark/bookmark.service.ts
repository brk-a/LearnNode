import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class BookmarkService {
    constructor(
        private user: User,
        private prisma: PrismaService
    ) { }
    async createBookmark(
        userId: string,
        dto: CreateBookmarkDto
    ) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                user_id: userId,
                ...dto,
            },
        })

        return bookmark
    }

    async getAllBookmarks(userId: string) {
        return await this.prisma.bookmark.findMany({
            where: {
                user_id: userId,
            },
        })
    }

    async getOneBookmark(
        userId: string,
        bookmarkId: string
    ) {
        return await this.prisma.bookmark.findFirst({
            where: {
                user_id: userId,
                id: bookmarkId,
            },
        })
    }

    async editBookmark(
        userId: string,
        bookmarkId: string,
        dto: EditBookmarkDto
    ) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        })
        if(!bookmark || bookmark.user_id!==userId){
            throw new ForbiddenException('cannot find bookmark or user')
        }
        return await this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
                user_id: userId
            },
            data: {
                ...dto,
            },
        })
    }

    async deleteBookmark(
        userId: string,
        bookmarkId: string
    ) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        })
        if(!bookmark || bookmark.user_id!==userId){
            throw new ForbiddenException('cannot find bookmark or user')
        }
        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
                user_id: userId,
            },
        })
    }
}
