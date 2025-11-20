<script lang="ts">
  import { onMount } from 'svelte';
  import SnowEffect from './SnowEffect.svelte';

  export let particleCount = 60;
  export let speed = 0.8;

  let showSnow = false;

  onMount(() => {
    checkIfChristmasSeason();
  });

  function checkIfChristmasSeason() {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed (0 = January, 11 = December)
    const day = now.getDate();

    // Show snow from December 1st (month 11) to January 6th (month 0)
    if (month === 11 && day >= 1) {
      // December 1st onwards
      showSnow = true;
    } else if (month === 0 && day <= 6) {
      // Up to January 6th (Reyes Magos)
      showSnow = true;
    } else {
      showSnow = false;
    }
  }
</script>

{#if showSnow}
  <SnowEffect {particleCount} {speed} />
{/if}
