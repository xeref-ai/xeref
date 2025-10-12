
export const changelogData = {
  latestVersion: 'v46',
  versions: [
    // ... other versions
    {
      version: 'v43',
      date: 'October 08, 2025',
      changes: [
        // ** THE FIX **: Use backticks (template literals) for the string
        { type: 'Improved', description: `Updated the "Today's Focus" panel with a new look and dynamic date.` },
        { type: 'Fixed', description: 'Resolved critical browser microphone permission errors and Firestore offline connectivity bugs.' },
      ],
    },
    // ... rest of the changelog data
  ],
};
