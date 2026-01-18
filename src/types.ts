export interface Note {
    id: string;
    content: string;
    status: 'pending' | 'approved';
}
