<script lang="ts">
  import { onMount } from 'svelte';
  import SnowEffect from './SnowEffect.svelte';
  import AutumnLeavesEffect from './AutumnLeavesEffect.svelte';

  export let particleCount = 60;
  export let speed = 0.8;

  let currentEffect: 'snow' | 'autumn' | null = null;
  let isUnlocked = false;

  onMount(() => {
    // Only listen for Konami unlock event (no persistence)
    if (typeof window !== 'undefined') {
      window.addEventListener('konamiUnlocked', handleKonamiUnlock);
      
      return () => {
        window.removeEventListener('konamiUnlocked', handleKonamiUnlock);
      };
    }
  });

  function handleKonamiUnlock() {
    isUnlocked = true;
    detectSeason();
  }

  function detectSeason() {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed (0 = January, 11 = December)
    const day = now.getDate();

    // Winter/Christmas: December 1 - January 6
    if (month === 11 && day >= 1) {
      currentEffect = 'snow';
    } else if (month === 0 && day <= 6) {
      currentEffect = 'snow';
    }
    // Autumn: September 21 - December 20
    else if (
      (month === 8 && day >= 21) || // September 21+
      month === 9 ||                  // October
      month === 10 ||                 // November
      (month === 11 && day < 21)     // December 1-20
    ) {
      currentEffect = 'autumn';
    }
    // Spring/Summer: No effect (or could add flowers, etc.)
    else {
      currentEffect = null;
    }
  }
</script>

{#if isUnlocked && currentEffect === 'snow'}
  <SnowEffect {particleCount} {speed} />
{:else if isUnlocked && currentEffect === 'autumn'}
  <AutumnLeavesEffect particleCount={30} {speed} />
{/if}
