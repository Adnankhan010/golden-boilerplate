import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NoteRepository } from './repositories/notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class NotesService {
    constructor(
        private readonly noteRepository: NoteRepository,
        private readonly usersRepository: UsersRepository,
    ) { }

    async create(userId: string, dto: CreateNoteDto): Promise<Note> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status !== 'ACTIVE') {
            throw new ForbiddenException('Only ACTIVE users can create notes');
        }
        return this.noteRepository.create({ ...dto, userId });
    }

    async findAll(userId: string): Promise<Note[]> {
        return this.noteRepository.findAllByUserId(userId);
    }

    async delete(userId: string, noteId: string): Promise<void> {
        const note = await this.noteRepository.findById(noteId);
        if (!note) {
            throw new NotFoundException('Note not found');
        }
        if (note.userId !== userId) {
            throw new ForbiddenException('You can only delete your own notes');
        }
        await this.noteRepository.delete(noteId);
    }
}
