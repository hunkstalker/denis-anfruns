<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Konami Code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA'
  ];

  const KEY_SYMBOLS: Record<string, string> = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'KeyB': 'B',
    'KeyA': 'A'
  };

  let showPanel = false;
  let currentSequence: string[] = [];
  let isComplete = false;
  let hasError = false;

  // Audio context for sound generation
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
    // Toggle panel with Space key
    if (event.code === 'Space' && !showPanel) {
      event.preventDefault();
      showPanel = true;
      currentSequence = [];
      isComplete = false;
      hasError = false;
      return;
    }

    // Only process Konami code keys when panel is visible
    if (!showPanel || isComplete) return;

    const key = event.code;
    if (!KONAMI_CODE.includes(key)) return;

    event.preventDefault();

    // Check if this key is the next expected key
    const expectedKey = KONAMI_CODE[currentSequence.length];

    if (key === expectedKey) {
      // Correct key!
      currentSequence = [...currentSequence, key];
      playCoinSound();

      // Check if completed
      if (currentSequence.length === KONAMI_CODE.length) {
        isComplete = true;
        playSuccessSound();
        setTimeout(() => {
          showPanel = false;
          // Here you could trigger the actual easter egg effect
          activateEasterEgg();
        }, 2000);
      }
    } else {
      // Wrong key!
      hasError = true;
      playErrorSound();
      setTimeout(() => {
        currentSequence = [];
        hasError = false;
      }, 500);
    }
  }

  function closePanel() {
    showPanel = false;
    currentSequence = [];
    isComplete = false;
    hasError = false;
  }

  // Sound generation functions (temporary until real sounds are provided)
  function playCoinSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 988; // B5
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  function playErrorSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function playSuccessSound() {
    if (!audioContext) return;
    
    // Bat screech approximation (high-pitched sweep)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2400, audioContext.currentTime + 0.15);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function activateEasterEgg() {
    if (typeof window === 'undefined') return;
    
    console.log('🦇 KONAMI CODE ACTIVATED! 🦇');
    
    // Determine current season
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    
    let targetGradient = '';
    
    // Winter/Christmas: December 1 - January 6
    if ((month === 11 && day >= 1) || (month === 0 && day <= 6)) {
      targetGradient = 'var(--christmasSnow-gradient)';
    }
    // Autumn: September 21 - December 20
    else if (
      (month === 8 && day >= 21) ||
      month === 9 ||
      month === 10 ||
      (month === 11 && day < 21)
    ) {
      targetGradient = 'var(--christmasAutumn-gradient)';
    }
    
    if (targetGradient) {
      performCurtainTransition(targetGradient);
    }
    
    // Dispatch event to activate seasonal effects
    window.dispatchEvent(new Event('konamiUnlocked'));
  }

  function performCurtainTransition(newGradient: string) {
    if (typeof document === 'undefined') return;
    
    // Create curtain element
    const curtain = document.createElement('div');
    curtain.className = 'background-curtain';
    curtain.style.setProperty('--curtain-gradient', newGradient);
    document.body.appendChild(curtain);
    
    // Trigger curtain slide from left
    requestAnimationFrame(() => {
      curtain.classList.add('active');
    });
    
    // After transition completes, update HTML background and remove curtain
    setTimeout(() => {
      const htmlElement = document.documentElement;
      if (htmlElement.classList.contains('dark')) {
        htmlElement.style.background = newGradient;
        htmlElement.style.backgroundAttachment = 'fixed';
      }
      curtain.remove();
    }, 1200);
  }
</script>

{#if showPanel}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="konami-panel" role="dialog" aria-label="Konami Code Panel" tabindex="-1">
    <!-- Close button -->
    <button class="close-btn" on:click={closePanel} aria-label="Close">✕</button>

    <!-- Title -->
    <h2 class="title">
      {#if isComplete}
        🦇 COMPLETE! 🦇
      {:else}
        ENTER CODE
      {/if}
    </h2>

    <!-- Code sequence display -->
    <div class="sequence-container">
      {#each KONAMI_CODE as key, index}
        <div
          class="key-box"
          class:active={index < currentSequence.length}
          class:current={index === currentSequence.length && !isComplete}
          class:error={hasError && index === currentSequence.length}
          class:complete={isComplete}
        >
          {#if index < currentSequence.length}
            {KEY_SYMBOLS[key]}
          {:else}
            ?
          {/if}
        </div>
      {/each}
    </div>

    <!-- Progress bar -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {(currentSequence.length / KONAMI_CODE.length) * 100}%"
        class:complete={isComplete}
        class:error={hasError}
      ></div>
    </div>
  </div>
{/if}

<style>
  .konami-panel {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
    backdrop-filter: blur(10px);
    border: 2px solid #00ff88;
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow:
      0 8px 32px rgba(0, 255, 136, 0.2),
      inset 0 0 30px rgba(0, 255, 136, 0.05);
    z-index: 10000;
    animation: slideDown 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    max-width: 95%;
  }

  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: 1px solid #ff4444;
    color: #ff4444;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .close-btn:hover {
    background: #ff4444;
    color: white;
    transform: rotate(90deg);
  }

  .title {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #00ff88;
    text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
    margin: 0 0 12px 0;
    letter-spacing: 1px;
  }

  .sequence-container {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 10px;
  }

  .key-box {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
    font-family: 'Arial', sans-serif;
  }

  .key-box.current {
    border-color: #ffaa00;
    box-shadow: 0 0 12px rgba(255, 170, 0, 0.5);
    animation: pulse 1s infinite;
  }

  .key-box.active {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    color: #00ff88;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
  }

  .key-box.complete {
    animation: celebrate 0.5s ease-out;
  }

  .key-box.error {
    background: rgba(255, 68, 68, 0.2);
    border-color: #ff4444;
    animation: shake 0.3s;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff88, #00cc6a);
    transition: width 0.3s ease-out, background 0.3s;
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
  }

  .progress-fill.complete {
    background: linear-gradient(90deg, #ffaa00, #ff6600);
  }

  .progress-fill.error {
    background: #ff4444;
  }

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .konami-panel {
      padding: 12px 16px;
    }

    .key-box {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }

    .title {
      font-size: 12px;
      margin-bottom: 10px;
    }

    .sequence-container {
      gap: 4px;
    }
  }
</style>
