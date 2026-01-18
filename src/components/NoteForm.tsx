import React, { useState } from 'react';

interface NoteFormProps {
  onSave: (content: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onSave,
  onCancel,
  initialValue = '',
}) => {
  const [note, setNote] = useState(initialValue);
  const minLength = 50;
  const maxLength = 500;

  const charCount = note.length;
  const progress = Math.min((charCount / maxLength) * 100, 100);

  const handleSave = () => {
    if (charCount >= minLength && charCount <= maxLength) {
      onSave(note);
      setNote('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {initialValue ? 'Edit Note' : 'Add a New Note'}
        </h2>
        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors min-h-32 resize-y"
          />

          {/* Character count with visual progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {charCount} / {maxLength} characters
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  charCount > maxLength || charCount < minLength
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={charCount < minLength || charCount > maxLength}
            >
              {initialValue ? 'Update Note' : 'Save Note'}
            </button>
            {initialValue && (
              <button
                onClick={onCancel}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
