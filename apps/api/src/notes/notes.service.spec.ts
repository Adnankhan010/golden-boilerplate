import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NoteRepository } from './repositories/notes.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Note } from './entities/note.entity';

describe('NotesService', () => {
    let service: NotesService;
    let noteRepository: jest.Mocked<NoteRepository>;
    let usersRepository: jest.Mocked<UsersRepository>;

    beforeEach(async () => {
        const noteRepoMock = {
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
        };

        const userRepoMock = {
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotesService,
                { provide: NoteRepository, useValue: noteRepoMock },
                { provide: UsersRepository, useValue: userRepoMock },
            ],
        }).compile();

        service = module.get<NotesService>(NotesService);
        noteRepository = module.get(NoteRepository);
        usersRepository = module.get(UsersRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully create a note for an ACTIVE user', async () => {
            const userId = 'user-123';
            const dto = { title: 'Test Note', content: 'Test Content' };

            usersRepository.findById.mockResolvedValue({ id: userId, status: 'ACTIVE' } as any);
            noteRepository.create.mockResolvedValue({ id: 'note-1', ...dto, userId } as Note);

            const result = await service.create(userId, dto);

            expect(usersRepository.findById).toHaveBeenCalledWith(userId);
            expect(noteRepository.create).toHaveBeenCalledWith({ ...dto, userId });
            expect(result).toBeDefined();
            expect(result.id).toBe('note-1');
        });

        it('should throw ForbiddenException if user status is PENDING', async () => {
            const userId = 'user-pending';
            const dto = { title: 'Test', content: 'Content' };

            usersRepository.findById.mockResolvedValue({ id: userId, status: 'PENDING' } as any);

            await expect(service.create(userId, dto)).rejects.toThrow(ForbiddenException);
            expect(noteRepository.create).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if user does not exist', async () => {
            const userId = 'user-unknown';
            usersRepository.findById.mockResolvedValue(null);

            await expect(service.create(userId, { title: 't', content: 'c' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return a list of notes', async () => {
            const userId = 'user-123';
            const notes = [{ id: '1', title: 'Note 1' }] as Note[];
            noteRepository.findAllByUserId.mockResolvedValue(notes);

            const result = await service.findAll(userId);
            expect(result).toEqual(notes);
            expect(noteRepository.findAllByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('delete', () => {
        it('should successfully delete a note owned by the user', async () => {
            const userId = 'user-123';
            const noteId = 'note-1';
            const note = { id: noteId, userId } as Note;

            noteRepository.findById.mockResolvedValue(note);

            await service.delete(userId, noteId);

            expect(noteRepository.delete).toHaveBeenCalledWith(noteId);
        });

        it('should throw ForbiddenException if note is not owned by user', async () => {
            const userId = 'user-123';
            const noteId = 'note-other';
            const note = { id: noteId, userId: 'other-user' } as Note;

            noteRepository.findById.mockResolvedValue(note);

            await expect(service.delete(userId, noteId)).rejects.toThrow(ForbiddenException);
            expect(noteRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if note does not exist', async () => {
            noteRepository.findById.mockResolvedValue(null);
            await expect(service.delete('any', 'missing')).rejects.toThrow(NotFoundException);
        });
    });
});
