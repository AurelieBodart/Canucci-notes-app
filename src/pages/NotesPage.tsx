import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NoteForm from '../components/NoteForm';
import type { Note } from '../types';



const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
    };
    setNotes([newNote, ...notes]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Notes</h1>

        {/* Add Note Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add new note
          </button>
        )}

        {/* Note Form */}
        {showForm && (
          <div className="mb-6">
            <NoteForm
              onSave={handleAddNote}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No notes yet. Start by adding your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 whitespace-pre-wrap break-words">{note.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
