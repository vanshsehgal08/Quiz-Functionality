// import React from 'react';

// export default function Quiz() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-green-800 mb-4">Interactive Quiz</h1>
//       <p className="text-gray-600">Coming soon...</p>
//     </div>
//   );
// }

import React, { useEffect } from 'react';

export default function Quiz() {
  useEffect(() => {
    // Directly redirect to the homepage
    window.location.href = "https://quiz-functionality.vercel.app/";
  }, []);

  return null; // No UI needed, the user is redirected immediately
}
