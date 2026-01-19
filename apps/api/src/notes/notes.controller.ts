import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(req.user.sub, createNoteDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.notesService.findAll(req.user.sub);
    }

    @Delete(':id')
    delete(@Request() req, @Param('id') id: string) {
        return this.notesService.delete(req.user.sub, id);
    }
}
