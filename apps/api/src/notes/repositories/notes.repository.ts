import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Note } from '../entities/note.entity';

@Injectable()
export class NoteRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: { title: string; content: string; userId: string }): Promise<Note> {
        const note = await this.prisma.note.create({
            data,
        });
        return Note.restore(note);
    }

    async findAllByUserId(userId: string): Promise<Note[]> {
        const notes = await this.prisma.note.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return notes.map(Note.restore);
    }

    async findById(id: string): Promise<Note | null> {
        const note = await this.prisma.note.findUnique({
            where: { id },
        });
        return note ? Note.restore(note) : null;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.note.delete({
            where: { id },
        });
    }
}
