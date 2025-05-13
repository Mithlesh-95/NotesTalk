interface NoteData {
  title: string;
  content: string;
}

export async function saveNote(noteData: NoteData) {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (!res.ok) {
      let errorMsg = 'Unknown error';
      try {
        const errorJson = await res.json();
        errorMsg = errorJson?.error || JSON.stringify(errorJson);
      } catch (e) {
        errorMsg = await res.text() || `Error ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMsg);
    }

    return res.json();
  } catch (err) {
    console.error('[saveNote ERROR]', err);
    throw err;
  }
} 