"use client";

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

// Type definition for our notes
interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

export default function VoiceNoteSection() {
  // State for managing notes and current transcription
  const [notes, setNotes] = useState<Note[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Get current user
  const { user } = useUser();
  
  // References for speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load notes from API when component mounts
  useEffect(() => {
    if (user) {
      console.log("User is signed in, fetching notes for:", user.id);
      // Skip fetching notes immediately - let user create their first note instead
      // This avoids unnecessary API calls and 401 errors for first-time users
      setNotes([]);
    } else {
      console.log("No user signed in yet");
    }
  }, [user]);

  // Fetch notes from API
  const fetchNotes = async () => {
    if (!user) {
      console.log("Attempted to fetch notes but no user is signed in");
      setError('You must be signed in to access your notes.');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Making API request to /api/notes with user ID:", user.id);
      
      const response = await fetch('/api/notes', {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id, // Add user ID as a custom header as fallback
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      console.log("API response status:", response.status);
      
      if (response.status === 401) {
        // Handle unauthorized error - user needs to sign in
        console.error("Unauthorized - auth cookie might not be sent correctly");
        setError('You must be signed in to access your notes. Please sign out and sign back in if this persists.');
        setNotes([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Notes fetched successfully:", data.length);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      if (err instanceof Error) {
        setError(`Failed to load notes: ${err.message}`);
      } else {
        setError('Failed to load notes. Please try again later.');
      }
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNote(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Function to generate title from transcript
  const generateTitleFromTranscript = (text: string) => {
    if (!text) return '';
    
    // Try to extract first sentence
    const sentenceMatch = text.match(/^(.*?[.!?])\s/);
    if (sentenceMatch && sentenceMatch[1].length <= 100) {
      return sentenceMatch[1];
    }
    
    // Otherwise use word-based extraction
    const words = text.split(' ');
    // Dynamically determine how many words to include based on content length
    const contentLength = words.length;
    let titleWordCount = 5; // default minimum
    
    if (contentLength <= 10) {
      // For very short content, use all words up to 3
      titleWordCount = Math.min(3, contentLength);
    } else if (contentLength <= 20) {
      // For short content, use 4-6 words
      titleWordCount = Math.min(4, contentLength);
    } else if (contentLength <= 50) {
      // For medium content, use 5-7 words
      titleWordCount = Math.min(5, contentLength);
    } else {
      // For long content, use 6-8 words
      titleWordCount = Math.min(6, contentLength);
    }
    
    // Cap at 8 words maximum
    titleWordCount = Math.min(titleWordCount, 8);
    
    const titleWords = words.slice(0, titleWordCount);
    return titleWords.join(' ') + (words.length > titleWordCount ? '...' : '');
  };
  
  // Reset silence detection timeout
  const resetSilenceTimeout = () => {
    // Clear any existing timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Set a new timeout to stop recording after 2 seconds of silence
    silenceTimeoutRef.current = setTimeout(() => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }, 2000);
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    // Cleanup function to stop recognition when component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onspeechend = null;
      }
      
      // Clear any silence detection timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);
  
  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Toggle listening state
  const toggleListening = () => {
    // Clear any previous messages
    setError(null);
    setSuccessMessage(null);
    
    if (isListening) {
      // Stop listening
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Reset everything before starting a new recording
      setTranscript('');
      setTitle('');
      setIsTitleManuallyEdited(false);
      
      // Create a new instance of SpeechRecognition each time to ensure clean state
      if (typeof window !== 'undefined') {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          // Stop any existing instance first
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onspeechend = null;
          }
          
          // Create new instance
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          // Set up event handlers
          recognitionRef.current.onresult = (event) => {
            // Get the transcription
            const transcription = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('');
            
            setTranscript(transcription);
            
            // Generate a title if not manually edited
            if (transcription && !isTitleManuallyEdited) {
              const generatedTitle = generateTitleFromTranscript(transcription);
              setTitle(generatedTitle);
            }
            
            // Reset silence detection timer when speech is detected
            resetSilenceTimeout();
          };
          
          // Handle errors
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
          };
          
          // Handle speech end event
          recognitionRef.current.onspeechend = () => {
            // No need to set listening to false here - we'll use the silence timeout
            resetSilenceTimeout(); // Start a timer to stop if no more speech is detected
          };
          
          // Handle recognition end
          recognitionRef.current.onend = () => {
            setIsListening(false);
            
            // Clear any existing silence timeout
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
          };
          
          // Start recognition
          recognitionRef.current.start();
          setIsListening(true);
          
          // Set initial silence timeout
          resetSilenceTimeout();
        } else {
          setError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
        }
      }
    }
  };
  
  // Update title when user edits it
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsTitleManuallyEdited(true);
  };
  
  // Save note to database
  const saveNote = async () => {
    if (!user) {
      setError('You must be signed in to save notes');
      return;
    }
    
    if (!title.trim() || !transcript.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the note object
      const noteData = {
        title: title.trim(),
        content: transcript.trim(),
      };
      
      console.log('Sending note data:', noteData);
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id, // Add user ID as a custom header as fallback
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to save note');
      }
      
      const responseData = await response.json();
      
      // Stop recording if it's still active
      if (isListening && recognitionRef.current) {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        recognitionRef.current.stop();
        setIsListening(false);
      }
      
      // Reset state on successful save
      setTranscript('');
      setTitle('');
      setIsTitleManuallyEdited(false);
      
      // Show success message
      setSuccessMessage('Note saved successfully!');
      
      // Refresh the notes list after successfully saving a note
      fetchNotes();
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err instanceof Error ? err.message : 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete note from database
  const deleteNote = async (id: number) => {
    if (!user) {
      setError('You must be signed in to delete notes');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': user.id, // Add user ID as a custom header as fallback
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      // Update the local state to remove the deleted note
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      
      // Close the modal if the deleted note was selected
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
      
      // Show success message
      setSuccessMessage('Note deleted successfully!');
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  // Render
  return (
    <div className="container mx-auto max-w-5xl">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
          <p>{error}</p>
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r">
          <p>{successMessage}</p>
        </div>
      )}
      
      {/* Voice recorder section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter title or it will be auto-generated"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary min-h-[200px]"
            placeholder="Your transcribed voice note will appear here..."
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`flex items-center justify-center rounded-full w-14 h-14 shadow-md ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              } text-white transition-colors`}
              disabled={isLoading}
            >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <span className="text-tertiary text-sm">
              {isListening ? 'Recording in progress...' : 'Click to start recording...'}
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            {isListening && (
              <button
                onClick={toggleListening}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                Stop Recording
              </button>
            )}
            <button
              onClick={saveNote}
              disabled={isLoading || (!title.trim() && !transcript.trim())}
              className={`px-4 py-2 rounded-md bg-green-600 text-white ${
                isLoading || (!title.trim() && !transcript.trim())
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notes list */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-primary">Your Notes</h3>
          <button
            onClick={fetchNotes}
            className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh Notes'}
          </button>
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-tertiary">No notes yet. Start recording to create your first note!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedNote(note)}
              >
                <h4 className="font-semibold text-lg mb-2 text-primary line-clamp-2">{note.title}</h4>
                <p className="text-tertiary line-clamp-3 mb-3">{note.content}</p>
                <p className="text-xs text-secondary">{formatDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Note detail modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-primary">{selectedNote.title}</h3>
                <button 
                  onClick={() => setSelectedNote(null)} 
                  className="text-secondary hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-secondary mt-1">{formatDate(selectedNote.createdAt)}</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Note'}
              </button>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TypeScript interface for Window to handle the speech recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
} 