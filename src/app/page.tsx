"use client";

import Link from 'next/link';
import Image from 'next/image';
import VoiceNoteSection from './components/VoiceNoteSection';
import { SignInButton, SignUpButton, useUser, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

// Wrapper component to only use Clerk features when Clerk is loaded
function HomeContent() {
  const { isSignedIn, user } = useUser();
  
  console.log("Home page - isSignedIn:", isSignedIn);
  console.log("Home page - user:", user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress } : null);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              Turn Your Voice Into Notes, Tasks & Diaries
            </h1>
            <p className="text-xl mb-8 text-primary">
              An AI-powered voice-to-text app for students, professionals, and creators.
            </p>
            {!isSignedIn ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <button className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                    Get Started Free
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="border border-primary text-primary hover:bg-primary/5 font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            ) : (
              <Link
                href="#voice-notes"
                className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                Start Using Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                {isSignedIn ? (
                  <Link href="#voice-notes">
                    <div className="w-20 h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-accent transition-colors hover:text-white cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ) : (
                  <div className="w-20 h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <p className="text-xl font-semibold text-primary">Voice Recorder</p>
                <p className="text-secondary mt-2">
                  {isSignedIn ? "Click microphone to start" : "Sign in to use"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Powerful Features</h2>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            Transform your voice into organized information with our suite of AI-powered tools
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Voice-to-Text Transcription</h3>
            <p className="text-secondary">Instantly convert your spoken words into accurate text with our advanced AI technology.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Lecture Note-Taking</h3>
            <p className="text-secondary">Capture important points from lectures and meetings in real-time without typing.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Voice Diary with Date</h3>
            <p className="text-secondary">Create and organize diary entries with automatic date tagging using just your voice.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Task Management via Voice</h3>
            <p className="text-secondary">Create task lists and to-dos by simply speaking. Our AI organizes them for you.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Smart Organization</h3>
            <p className="text-secondary">Our AI automatically categorizes and tags your notes based on content for easy retrieval.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-background/30 p-6 rounded-xl">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Searchable Audio</h3>
            <p className="text-secondary">Find specific moments in your recordings with our powerful keyword search feature.</p>
          </div>
        </div>
      </section>

      {/* Voice Notes Section - Only visible to authenticated users */}
      {isSignedIn && (
        <section id="voice-notes" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-primary mb-8">Voice Notes</h2>
            <VoiceNoteSection />
          </div>
        </section>
      )}

      {/* Not Signed In Message - Only visible to unauthenticated users */}
      {!isSignedIn && (
        <section id="voice-notes" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Welcome to NotesTalk</h2>
            <p className="text-lg text-tertiary mb-8 max-w-2xl mx-auto">
              Sign in to create and manage your voice notes, diary entries, tasks, and lecture notes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="border border-primary text-primary hover:bg-primary/5 font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                  Create Free Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Who Uses NotesTalk?</h2>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            Our voice-to-text solution helps people across various fields
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Students */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">For Students</h3>
            <p className="text-secondary">
              Capture lectures in real-time without missing important information. Focus on understanding instead of frantically typing notes.
            </p>
          </div>
          
          {/* Professionals */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">For Professionals</h3>
            <p className="text-secondary">
              Capture meeting notes hands-free and focus on the discussion. Turn conversations into actionable items automatically.
            </p>
          </div>
          
          {/* Personal Use */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">Personal Use</h3>
            <p className="text-secondary">
              Maintain voice diaries and to-do lists effortlessly. Capture your thoughts on the go without having to type.
            </p>
          </div>
          
          {/* Accessibility */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">Accessibility</h3>
            <p className="text-secondary">
              Assist users who have difficulty typing or prefer voice interaction. Makes note-taking accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            Three simple steps to transform your voice into organized notes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative p-6 bg-background/30 rounded-xl">
            <div className="absolute -top-5 -left-5 h-12 w-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">Speak into the App</h3>
              <p className="text-secondary">
                Press the microphone button and start speaking. The app actively listens and transcribes your voice in real-time.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative p-6 bg-background/30 rounded-xl">
            <div className="absolute -top-5 -left-5 h-12 w-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">AI Processes Your Voice</h3>
              <p className="text-secondary">
                Our AI analyzes your speech patterns, identifies key information, and formats it into structured content.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative p-6 bg-background/30 rounded-xl">
            <div className="absolute -top-5 -left-5 h-12 w-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">Organize & Access</h3>
              <p className="text-secondary">
                Your voice is transformed into organized notes, tasks, or diary entries that you can easily access and manage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Main Home component
export default function Home() {
  return (
    <main>
      <ClerkLoading>
        <div className="py-20 px-4 text-center">
          <p className="text-xl text-primary">Loading...</p>
        </div>
      </ClerkLoading>
      
      <ClerkLoaded>
        <HomeContent />
      </ClerkLoaded>
    </main>
  );
}
