<script lang="ts">
  import { onMount } from 'svelte';

  export let particleCount = 50; // Number of snowflakes
  export let speed = 1; // Speed multiplier

  interface Snowflake {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    opacity: number;
  }

  let snowflakes: Snowflake[] = [];
  let animationId: number;

  onMount(() => {
    // Initialize snowflakes
    for (let i = 0; i < particleCount; i++) {
      snowflakes.push(createSnowflake());
    }

    // Start animation
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });

  function createSnowflake(): Snowflake {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 3 + 2, // 2-5px
      speedY: Math.random() * 1 + 0.5, // Fall speed
      speedX: Math.random() * 0.5 - 0.25, // Horizontal drift
      opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
    };
  }

  function animate() {
    snowflakes = snowflakes.map(flake => {
      // Update position
      let newY = flake.y + flake.speedY * speed;
      let newX = flake.x + flake.speedX * speed;

      // Reset if out of bounds
      if (newY > window.innerHeight) {
        return createSnowflake();
      }

      // Wrap horizontally
      if (newX > window.innerWidth) newX = 0;
      if (newX < 0) newX = window.innerWidth;

      return { ...flake, x: newX, y: newY };
    });

    animationId = requestAnimationFrame(animate);
  }
</script>

<!-- Snowflakes Container -->
<div class="snow-container" role="presentation" aria-hidden="true">
  {#each snowflakes as flake, i (i)}
    <div
      class="snowflake"
      style="
        left: {flake.x}px;
        top: {flake.y}px;
        width: {flake.size}px;
        height: {flake.size}px;
        opacity: {flake.opacity};
      "
    ></div>
  {/each}
</div>

<style>
  .snow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .snowflake {
    position: absolute;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    will-change: transform;
  }
</style>
