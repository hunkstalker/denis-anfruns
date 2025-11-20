<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount, onDestroy } from 'svelte';
  import type { Project } from '../data/projects';
  import { getTechnology } from '../data/technologies';

  export let projects: Project[] = [];
  
  let currentIndex = 0;
  let currentImageIndex = 0;
  const projectCycleInterval = 9000; // 3 seconds per project
  const imageCycleInterval = 3000; // 1 second per image

  $: activeProject = projects[currentIndex];
  $: currentImage = activeProject?.images[currentImageIndex] || activeProject?.images[0];

  let projectInterval: ReturnType<typeof setInterval>;
  let imageInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    // Cycle through images within the current project
    imageInterval = setInterval(() => {
      if (activeProject && activeProject.images.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % activeProject.images.length;
      }
    }, imageCycleInterval);

    // Cycle through projects
    projectInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % projects.length;
      currentImageIndex = 0; // Reset image index when changing project
    }, projectCycleInterval);
  });

  onDestroy(() => {
    clearInterval(imageInterval);
    clearInterval(projectInterval);
  });
</script>

<!-- Hero Card - Main Project Display -->
<div class="relative w-full min-h-[50vh] rounded-lg overflow-hidden bg-zinc-950 shadow-2xl border border-white/5">
  {#key activeProject?.title}
    <div 
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 200 }}
      class="absolute inset-0"
    >
      <!-- Background Image Slideshow -->
      <div class="absolute inset-0">
        {#key currentImage}
          <img 
            in:fade={{ duration: 600 }}
            out:fade={{ duration: 300 }}
            src={currentImage} 
            alt={activeProject?.title}
            class="w-full h-full object-cover"
          />
        {/key}
        <!-- Dark overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
      </div>

      <!-- Content Container -->
      <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
        <div class="max-w-4xl">
          <!-- Tags -->
          <div 
            in:fly={{ y: 20, duration: 500, delay: 200, easing: quintOut }}
            class="flex flex-wrap gap-2 mb-6"
          >
            {#each activeProject?.tags || [] as tagId}
              {@const tech = getTechnology(tagId)}
              {#if tech}
                <span 
                  class="px-4 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium border"
                  style="background-color: {tech.lightColor || tech.color}15; color: {tech.lightColor || tech.color}; border-color: {tech.lightColor || tech.color}30;"
                >
                  {tech.name}
                </span>
              {/if}
            {/each}
          </div>
          
          <!-- Title -->
          <h2 
            in:fly={{ y: 20, duration: 500, delay: 300, easing: quintOut }}
            class="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {activeProject?.title}
          </h2>
          
          <!-- Description -->
          <p 
            in:fly={{ y: 20, duration: 500, delay: 400, easing: quintOut }}
            class="text-gray-300 text-lg md:text-2xl leading-relaxed mb-8 max-w-3xl"
          >
            {activeProject?.description}
          </p>

          <!-- CTA Button -->
          {#if activeProject?.link}
            <div in:fly={{ y: 20, duration: 500, delay: 500, easing: quintOut }}>
              <a 
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105"
              >
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          {/if}

          <!-- Image Progress Indicators -->
          <div 
            in:fly={{ y: 20, duration: 500, delay: 600, easing: quintOut }}
            class="flex gap-2 mt-8"
          >
            {#each activeProject?.images || [] as _, i}
              <div class="h-1 flex-1 rounded-full bg-white/20 overflow-hidden max-w-[60px]">
                {#if i === currentImageIndex}
                  <div class="h-full bg-white animate-[progress_1s_linear_infinite]"></div>
                {:else if i < currentImageIndex}
                  <div class="h-full bg-white"></div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/key}
</div>

<style>
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
</style>
