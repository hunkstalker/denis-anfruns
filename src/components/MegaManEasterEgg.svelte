<script lang="ts">
  import { onMount } from 'svelte';

  const TARGET_WORD = 'MEGAMAN';
  let currentSequence: string[] = [];
  let isComplete = false;
  let audioContext: AudioContext;

  onMount(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (audioContext) {
        audioContext.close();
      }
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (isComplete) return;

    const key = event.key.toUpperCase();
    
    // Check if this is a valid letter for our sequence
    if (!/^[A-Z]$/.test(key)) return;

    const expectedChar = TARGET_WORD[currentSequence.length];

    if (key === expectedChar) {
      // Correct letter!
      currentSequence = [...currentSequence, key];
      playMegaManSound(currentSequence.length);

      console.log(`✓ Progress: ${currentSequence.join('')}`);

      // Check if completed
      if (currentSequence.length === TARGET_WORD.length) {
        isComplete = true;
        playVictorySound();
        setTimeout(() => {
          activateMegaManEasterEgg();
        }, 1500);
      }
    } else if (currentSequence.length > 0) {
      // Wrong letter after starting, reset
      console.log(`✗ Reset! Expected ${expectedChar}, got ${key}`);
      playErrorSound();
      currentSequence = [];
    }
  }

  // Different Mega Man sounds for each letter
  function playMegaManSound(position: number) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for each letter to create a melody
    const frequencies = [
      523.25, // C5 - M
      659.25, // E5 - E
      783.99, // G5 - G
      880.00, // A5 - A
      987.77, // B5 - M
      1046.50, // C6 - A
      1174.66  // D6 - N
    ];

    oscillator.frequency.value = frequencies[position - 1];
    oscillator.type = 'square'; // 8-bit sound

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }

  function playErrorSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 180;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
  }

  function playVictorySound() {
    if (!audioContext) return;

    // Mega Man victory jingle (simplified)
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.50, time: 0.45 }, // C6
    ];

    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'square';

      const startTime = audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  function activateMegaManEasterEgg() {
    if (typeof window === 'undefined') return;
    
    console.log('🤖 MEGA MAN EASTER EGG ACTIVATED! 🤖');
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new Event('megamanActivated'));
    
    // Reset after a while
    setTimeout(() => {
      currentSequence = [];
      isComplete = false;
    }, 3000);
  }
</script>

<!-- This component doesn't render anything visible, it just listens for keypresses -->
