async function main() {
  console.log('Sending request to generate dispute letters for discrepancies [1, 2, 3]...');
  try {
    const response = await fetch('http://localhost:3000/api/generate-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        discrepancyIds: [1, 2, 3],
        tone: 'legal',
        phase: 1
      })
    });

    const result = await response.json();
    console.log('Response Status:', response.status);
    
    if (response.ok && result.success) {
      console.log('SUCCESS: Dispute letters successfully generated!');
      console.log('Generated Letters Count:', result.letters.length);
      
      for (const letter of result.letters) {
        console.log('\n========================================');
        console.log(`BUREAU: ${letter.bureau} (Tone: ${letter.tone})`);
        console.log('CREDITORS:', letter.creitors || letter.creditors);
        console.log('========================================');
        console.log(letter.content.slice(0, 400) + '...\n');
      }
    } else {
      console.error('FAILED: API returned an error:', result);
    }
  } catch (err) {
    console.error('Network error during letter generation:', err);
  }
}

main();
