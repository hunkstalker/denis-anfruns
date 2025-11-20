<script>
  import { flip } from 'svelte/animate';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { technologies, categories, getTechnology } from '../data/technologies';

  export let projects = [];
  export let allTechnologies = [];

  let selectedFilter = 'all';

  $: filteredProjects = selectedFilter === 'all'
    ? projects
    : projects.filter(project => project.tags.includes(selectedFilter));

  // Group technologies by category
  $: techsByCategory = Object.entries(categories).reduce((acc, [key, cat]) => {
    const techs = allTechnologies
      .map(id => getTechnology(id))
      .filter(tech => tech && tech.category === key);
    if (techs.length > 0) {
      acc[key] = { ...cat, techs };
    }
    return acc;
  }, {});

  function setFilter(tech) {
    selectedFilter = tech;
  }
</script>

<div class="space-y-12">
  <!-- Filter Buttons -->
  <div class="space-y-6">
    <!-- All Projects Button -->
    <div class="flex justify-center">
      <button
        class="relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden group
        {selectedFilter === 'all' ? 'text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'text-gray-400 hover:text-white'}"
        on:click={() => setFilter('all')}
      >
        <span class="relative z-10">All Projects</span>
        {#if selectedFilter === 'all'}
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        {:else}
          <div class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
        {/if}
      </button>
    </div>

    <!-- Technologies by Category -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each Object.entries(techsByCategory) as [categoryKey, category]}
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <span class="text-lg">{category.icon}</span>
            {category.name}
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each category.techs as tech}
              {@const displayColor = selectedFilter === tech.id ? tech.color : (tech.lightColor || tech.color)}
              <button
                class="relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 overflow-hidden
                {selectedFilter === tech.id ? 'scale-105 shadow-lg' : 'opacity-70 hover:opacity-100'}"
                style="background-color: {selectedFilter === tech.id ? tech.color : displayColor + '20'}; 
                       color: {selectedFilter === tech.id ? '#ffffff' : displayColor};
                       border: 1px solid {displayColor}50;"
                on:click={() => setFilter(tech.id)}
              >
                {tech.name}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Projects Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredProjects as project (project.title)}
      <div
        animate:flip={{ duration: 300 }}
        in:fly={{ y: 20, duration: 400, easing: quintOut }}
        out:fade={{ duration: 200 }}
        class="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-500"
      >
        <!-- Project Image -->
        <div class="aspect-video w-full overflow-hidden bg-zinc-900">
          <img
            src={project.images[0]}
            alt={project.title}
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p class="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            {#each project.tags as tagId}
              {@const tech = getTechnology(tagId)}
              {#if tech}
                <span 
                  class="text-xs px-2.5 py-1 rounded-full font-medium border transition-all duration-300"
                  style="background-color: {tech.lightColor || tech.color}15; color: {tech.lightColor || tech.color}; border-color: {tech.lightColor || tech.color}30;"
                >
                  {tech.name}
                </span>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
