export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Three simple steps to transform your voice into organized notes
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="relative p-6 bg-background/30 rounded-xl">
          <div className="absolute -top-5 -left-5 bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
            1
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-center text-primary">Record Your Voice</h3>
          <p className="text-gray-600 text-center">
            Tap the microphone button and start speaking. Our app captures high-quality audio in multiple languages.
          </p>
        </div>
        
        {/* Step 2 */}
        <div className="relative p-6 bg-background/30 rounded-xl">
          <div className="absolute -top-5 -left-5 bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
            2
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-center text-primary">Get Real-Time Transcription</h3>
          <p className="text-gray-600 text-center">
            Our AI instantly converts your speech to accurate text, handling technical terms, punctuation, and formatting.
          </p>
        </div>
        
        {/* Step 3 */}
        <div className="relative p-6 bg-background/30 rounded-xl">
          <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
            3
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-center text-primary">Organize and Access Anytime</h3>
          <p className="text-gray-600 text-center">
            Notes are automatically organized, categorized, and saved for easy access across all your devices.
          </p>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-lg text-gray-700 mb-8">
          Ready to transform the way you take notes?
        </p>
        <button className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center transition-colors">
          Try NotesTalk Now
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </section>
  );
} 