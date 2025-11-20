<script lang="ts">
  import { onMount } from 'svelte';

  export let particleCount = 30; // Menos hojas que copos de nieve
  export let speed = 1;

  interface Leaf {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    rotation: number;
    rotationSpeed: number;
    leaf: string;
    color: string;
  }

  const leafEmojis = ['🍂', '🍁'];
  const leafColors = [
    '#D2691E', // Marrón chocolate
    '#CD853F', // Marrón dorado
    '#DAA520', // Dorado
    '#FF8C00', // Naranja oscuro
    '#DC143C', // Carmesí
    '#8B4513', // Marrón silla
  ];

  let leaves: Leaf[] = [];
  let animationId: number;

  onMount(() => {
    // Initialize leaves
    for (let i = 0; i < particleCount; i++) {
      leaves.push(createLeaf());
    }

    // Start animation
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });

  function createLeaf(): Leaf {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 20 + 15, // 15-35px
      speedY: Math.random() * 0.8 + 0.3, // Slower fall
      speedX: Math.random() * 1 - 0.5, // More horizontal drift
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2, // Rotation speed
      leaf: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    };
  }

  function animate() {
    leaves = leaves.map(leaf => {
      // Update position
      let newY = leaf.y + leaf.speedY * speed;
      let newX = leaf.x + leaf.speedX * speed;
      let newRotation = leaf.rotation + leaf.rotationSpeed * speed;

      // Add swaying motion (sine wave)
      newX += Math.sin(newY / 50) * 0.5;

      // Reset if out of bounds
      if (newY > window.innerHeight) {
        return createLeaf();
      }

      // Wrap horizontally
      if (newX > window.innerWidth) newX = 0;
      if (newX < 0) newX = window.innerWidth;

      return { ...leaf, x: newX, y: newY, rotation: newRotation };
    });

    animationId = requestAnimationFrame(animate);
  }
</script>

<!-- Autumn Leaves Container -->
<div class="leaves-container" role="presentation" aria-hidden="true">
  {#each leaves as leaf, i (i)}
    <div
      class="leaf"
      style="
        left: {leaf.x}px;
        top: {leaf.y}px;
        font-size: {leaf.size}px;
        transform: rotate({leaf.rotation}deg);
        filter: hue-rotate({Math.random() * 30}deg);
      "
    >
      {leaf.leaf}
    </div>
  {/each}
</div>

<style>
  .leaves-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .leaf {
    position: absolute;
    will-change: transform;
    user-select: none;
  }
</style>
