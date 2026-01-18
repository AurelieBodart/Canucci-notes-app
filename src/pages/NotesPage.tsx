import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import NoteForm from '../components/NoteForm';
import type { Note, StatusFilter } from '../types';
import { STATUS_FILTER } from '../types';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');

 // Load notes from memory on mount
 useEffect(() => {
  const savedNotes = localStorage.getItem('myNotes');
  if (savedNotes) {
    try {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }
}, []);

// Save notes to memory whenever they change
useEffect(() => {
  if (notes.length > 0) {
    localStorage.setItem('myNotes', JSON.stringify(notes));
  }
}, [notes]);

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      status: 'pending'
    };
    setNotes([newNote, ...notes]);
    setShowForm(false);
  };

  const handleUpdateNote = (content: string) => {
    if (editingNoteId) {
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, content }
          : note
      ));
      setEditingNoteId(null);
    }
  };

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);

    // need it when delete last note from list
    if (updatedNotes.length === 0) {
      localStorage.removeItem('myNotes');
    }
  };

  const handleToggleStatus = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, status: note.status === 'pending' ? 'approved' : 'pending' }
        : note
    ));
  };

  const filteredNotes = notes.filter(note => {
    if (filter === STATUS_FILTER.all) return true;
    return note.status === filter;
  });

  const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Notes</h1>

          {/* Filter Buttons */}
          {!showForm && !editingNoteId && (
          <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter(STATUS_FILTER.all)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === STATUS_FILTER.all
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            All 
          </button>
          <button
            onClick={() => setFilter(STATUS_FILTER.pending)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === STATUS_FILTER.pending
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter(STATUS_FILTER.approved)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === STATUS_FILTER.approved
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            Approved
          </button>
        </div>
          )}

        {/* Add Note Button */}
        {!showForm && !editingNoteId && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add new note
          </button>
        )}

        {/* Note Form for Adding */}
        {showForm && (
          <div className="mb-6">
            <NoteForm
              onSave={handleAddNote}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

         {/* Note Form for Editing */}
         {editingNoteId && editingNote && (
          <div className="mb-6">
            <NoteForm
              onSave={handleUpdateNote}
              onCancel={handleCancelEdit}
              initialValue={editingNote.content}
            />
          </div>
        )}

        {/* Notes List */}

        {!editingNoteId && !showForm &&
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {notes.length === 0 
                    ? 'No notes yet. Start by adding your first note!' 
                    : `No ${filter} notes found.`
                  }
                </p>            
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                    note.status === 'approved' 
                      ? 'bg-green-50 border-2 border-green-300' 
                      : 'bg-white'
                  }`}              >
                  <div className="flex justify-between items-start gap-4">
                    <input
                        type="checkbox"
                        checked={note.status === 'approved'}
                        onChange={() => handleToggleStatus(note.id)}
                        className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer accent-green-600"
                      />
                    
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-gray-800 whitespace-pre-wrap break-words ${
                        note.status === 'approved' ? 'line-through' : ''
                      }`}>{note.content}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                        title="Edit note"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                        title="Delete note"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        }
        
      </div>
    </div>
  );
};

export default NotesPage;
