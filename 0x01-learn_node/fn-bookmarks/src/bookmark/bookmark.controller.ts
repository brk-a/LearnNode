import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(
        private bookmarkService: BookmarkService
    ){}

    @Post()
    async createBookmark(
        @GetUser() userId: string,
        @Body() dto: CreateBookmarkDto
    ){
        return await this.bookmarkService.createBookmark(userId, dto)
    }

    @Get()
    async getAllBookmarks(@GetUser() userId: string){
        return await this.bookmarkService.getAllBookmarks(userId)
    }

    @Get(':id')
    async getOneBookmark(
        @GetUser() userId: string,
        @Param('id') bookmarkId: string
    ){
        return await this.bookmarkService.getOneBookmark(userId, bookmarkId)
    }

    @Patch(':id')
    async editBookmark(
        @GetUser() userId: string,
        @Param('id') bookmarkId: string,
        @Body() dto: EditBookmarkDto
    ){
        return await this.bookmarkService.editBookmark(userId, bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteBookmark(
        @GetUser() userId: string,
        @Param('id') bookmarkId: string
    ){
        return await this.bookmarkService.deleteBookmark(userId, bookmarkId)
    }
}
