import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Loader2 } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

const createNoteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
});

type CreateNoteForm = z.infer<typeof createNoteSchema>;

export default function Notes() {
    // const { user } = useAuth(); // Not used currently
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: notes, isLoading } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await api.get<Note[]>('/notes');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: CreateNoteForm) => {
            const res = await api.post('/notes', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setIsDialogOpen(false);
            reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/notes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateNoteForm>({
        resolver: zodResolver(createNoteSchema),
    });

    const onSubmit = (data: CreateNoteForm) => {
        createMutation.mutate(data);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Notes</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Note</DialogTitle>
                            <DialogDescription>
                                Add a new personal note locally.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        className="col-span-3"
                                        {...register('title')}
                                    />
                                </div>
                                {errors.title && <p className="text-red-500 text-xs ml-[25%]">{errors.title.message}</p>}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">
                                        Content
                                    </Label>
                                    <Textarea
                                        id="content"
                                        className="col-span-3"
                                        {...register('content')}
                                    />
                                </div>
                                {errors.content && <p className="text-red-500 text-xs ml-[25%]">{errors.content.message}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Saving...' : 'Save Note'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {notes?.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10">
                    You don't have any notes yet. Create one!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes?.map((note) => (
                        <Card key={note.id}>
                            <CardHeader>
                                <CardTitle>{note.title}</CardTitle>
                                <CardDescription>{new Date(note.createdAt).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap truncate">{note.content}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(note.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
