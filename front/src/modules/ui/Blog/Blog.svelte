<script>
  import { onMount, onDestroy } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
  import { initBlogAnimations, cleanupBlogAnimations } from "./blogAnimation.js";
  import { useBlog, BlogUtils } from "./scriptBlog.js";
  import { initLenis } from "../../../stores/lenis.js";

  // Enregistrer ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Variables pour les éléments
  let container;
  let animations = {};
  let cleanupFunctions = [];
  
  // Variables pour le blog
  let searchQuery = "";
  let selectedCategory = "all";
  
  // Initialiser le hook du blog
  const blog = useBlog();
  
  // Articles filtrés (réactif)
  $: filteredArticles = selectedCategory === "all" 
    ? blog.articles 
    : blog.articles.filter(article => article.category === selectedCategory);
  
  // Articles recherchés
  $: searchedArticles = searchQuery.trim() === ""
    ? filteredArticles
    : blog.searchArticles(searchQuery);

  onMount(() => {
    // Initialiser Lenis pour le scroll smooth
    const lenisInstance = initLenis();
    lenisInstance.on("scroll", ScrollTrigger.update);
    
    // Boucle requestAnimationFrame pour Lenis
    let rafId = null;
    let isRafActive = true;
    
    function raf(time) {
      if (isRafActive) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }
    rafId = requestAnimationFrame(raf);
    
    // Fonction de cleanup pour Lenis
    const cleanupLenis = () => {
      isRafActive = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenisInstance.destroy();
    };
    cleanupFunctions.push(cleanupLenis);
    
    // Initialiser le store media query
    const cleanupMediaQuery = initMediaQuery();
    cleanupFunctions.push(cleanupMediaQuery);
    
    // Utiliser la fonction centralisée pour les media queries
    const {
      currentSize,
      cleanup: cleanupMediaQueryStores,
    } = useMediaQuery();
    cleanupFunctions.push(cleanupMediaQueryStores);

    // Initialiser les animations selon la taille d'écran
    animations = initBlogAnimations(currentSize);
  });

  onDestroy(() => {
    // Nettoyer les animations
    cleanupBlogAnimations(animations);
    
    // Nettoyer ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.clearMatchMedia();
    
    // Nettoyer les fonctions de nettoyage
    cleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
  });

  // Fonctions
  function handleCategoryFilter(category) {
    selectedCategory = category;
  }

  function handleSearch(event) {
    searchQuery = event.target.value;
  }
</script>

<div class="blog-container" bind:this={container}>
  <section id="blog-section">
    <h2 class="blog-title">Blog</h2>
    <p class="blog-description">Découvrez mes articles et tutoriels sur le développement web</p>

    <!-- Filtres et recherche -->
    <div class="blog-filters">
      <div class="category-filters">
        {#each blog.categories as category}
          <button 
            class="category-btn"
            class:active={selectedCategory === category}
            on:click={() => handleCategoryFilter(category)}
            style="--category-color: {BlogUtils.getCategoryColor(category)}"
          >
            {category}
          </button>
        {/each}
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Rechercher un article..." 
          class="search-input"
          on:input={handleSearch}
          bind:value={searchQuery}
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- Grille d'articles -->
    <div class="blog-articles">
      {#if searchedArticles.length === 0}
        <div class="no-results">
          <span class="no-results-icon">📝</span>
          <p>Aucun article trouvé</p>
        </div>
      {:else}
        {#each searchedArticles as article (article.id)}
          <article class="blog-card">
            <div class="card-image">
              <img src={article.image} alt={article.title} />
              <div class="card-category" style="background-color: {BlogUtils.getCategoryColor(article.category)}">
                {article.category}
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{article.title}</h3>
              <p class="card-excerpt">{BlogUtils.truncateText(article.excerpt, 120)}</p>
              <div class="card-meta">
                <span class="card-date">{blog.formatDate(article.date)}</span>
                <span class="card-author">Par {article.author}</span>
              </div>
              <div class="card-tags">
                {#each article.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
              <button class="read-more-btn">Lire l'article →</button>
            </div>
          </article>
        {/each}
      {/if}
    </div>
  </section>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap");

  .blog-container {
    display: flex;
    flex-direction: column;
    width: 99vw;
    min-width: 350px;
    padding: 2% 2% 15svh 2%;
    min-height: 90svh;
    height: auto;
  }

  #blog-section {
    width: 100%;
    min-height: 90svh;
    height: auto;
    display: flex;
    flex-direction: column;
  }

  h2.blog-title {
    font-family: "Orbitron", cursive;
    font-weight: 600;
    font-size: clamp(0.8rem, 3vw, 3rem);
    color: crimson;
    text-align: center;
    margin-bottom: 10px;
  }

  p.blog-description {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(0.7rem, 4vw, 2.5rem);
    color: rgb(250, 245, 245);
    text-align: center;
    margin-bottom: 40px;
  }

  /* Filtres et recherche */
  .blog-filters {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
    align-items: center;
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .category-btn {
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(220, 20, 60, 0.3);
    color: rgb(250, 245, 245);
    padding: 8px 16px;
    border-radius: 20px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: capitalize;
  }

  .category-btn:hover {
    border-color: var(--category-color, crimson);
    background: rgba(220, 20, 60, 0.2);
    transform: translateY(-2px);
  }

  .category-btn.active {
    background: linear-gradient(45deg, crimson, #ff4444);
    border-color: crimson;
    box-shadow: 0 0 15px rgba(220, 20, 60, 0.5);
  }

  .search-container {
    position: relative;
    width: 100%;
    max-width: 500px;
  }

  .search-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(220, 20, 60, 0.3);
    color: rgb(250, 245, 245);
    padding: 12px 45px 12px 20px;
    border-radius: 25px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    outline: none;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    border-color: crimson;
    box-shadow: 0 0 15px rgba(220, 20, 60, 0.3);
  }

  .search-input::placeholder {
    color: rgba(220, 220, 220, 0.6);
  }

  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    pointer-events: none;
  }

  /* Grille d'articles */
  .blog-articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 20px;
  }

  .blog-card {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(220, 20, 60, 0.1));
    border: 2px solid rgba(220, 20, 60, 0.3);
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(220, 20, 60, 0.4);
    border-color: crimson;
  }

  .card-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .blog-card:hover .card-image img {
    transform: scale(1.1);
  }

  .card-category {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 5px 12px;
    border-radius: 15px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.6rem, 1vw, 0.8rem);
    color: white;
    font-weight: 600;
    text-transform: capitalize;
  }

  .card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .card-title {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(0.9rem, 1.5vw, 1.2rem);
    margin: 0;
  }

  .card-excerpt {
    font-family: "Orbitron", cursive;
    color: rgb(220, 220, 220);
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    line-height: 1.5;
    margin: 0;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: clamp(0.6rem, 1vw, 0.75rem);
    color: rgba(220, 220, 220, 0.7);
    font-family: "Orbitron", cursive;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    background: rgba(220, 20, 60, 0.2);
    color: rgb(250, 245, 245);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: clamp(0.6rem, 1vw, 0.7rem);
    border: 1px solid rgba(220, 20, 60, 0.3);
    font-family: "Orbitron", cursive;
  }

  .read-more-btn {
    background: linear-gradient(45deg, crimson, #ff4444);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
    margin-top: auto;
  }

  .read-more-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.5);
  }

  .no-results {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: rgba(220, 220, 220, 0.7);
  }

  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .no-results p {
    font-family: "Orbitron", cursive;
    font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  }

  /* Media Queries Responsive */
  
  /* Small Mobile (max-width: 480px) */
  @media (max-width: 480px) {
    .blog-container {
      width: 100vw;
      padding: 1% 1% 12svh 1%;
    }

    .blog-articles {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .card-image {
      height: 180px;
    }
  }

  /* Medium Mobile (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    .blog-articles {
      grid-template-columns: 1fr;
      gap: 25px;
    }
  }

  /* Tablet (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    .blog-articles {
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
    }
  }

  /* Desktop (1025px - 1440px) */
  @media (min-width: 1025px) and (max-width: 1440px) {
    .blog-container {
      width: 90vw;
    }

    .blog-articles {
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
  }

  /* Large Desktop (1441px - 1920px) */
  @media (min-width: 1441px) and (max-width: 1920px) {
    .blog-container {
      width: 100%;
      height: 130vh;
      margin-top: 10%;
    }
    .search-input {
      width: 85%;
    }

    .blog-articles {
      grid-template-columns: repeat(3, 1fr);
      gap: 35px;
    }
  }

  /* XL Desktop (1921px+) */
  @media (min-width: 1921px) {
    .blog-container {
      width: 80vw;
    }

    .blog-articles {
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
    }
  }
</style>

