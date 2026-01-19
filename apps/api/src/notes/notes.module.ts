import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NoteRepository } from './repositories/notes.repository';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [NotesController],
    providers: [NotesService, NoteRepository],
})
export class NotesModule { }
