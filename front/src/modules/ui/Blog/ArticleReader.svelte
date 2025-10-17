<script>
  import { BlogUtils } from "./scriptBlog.js";
  import { stopLenis, startLenis } from "../../../stores/lenis.js";
  import { onMount, onDestroy } from 'svelte';

  export let article;
  export let formatDate;
  export let onClose;

  // Pas de gestion Lenis ici, on utilise CSS pour forcer le scroll natif
</script>

<div class="article-reader-overlay" on:click={onClose} on:keydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="-1" data-lenis-prevent>
  <div class="article-reader-card" on:click={(e) => e.stopPropagation()} on:keydown role="none" data-lenis-prevent>
    <button class="close-btn" on:click={onClose}>✕</button>
    
    <div class="article-header">
      <img src={article.image} alt={article.title} class="article-image" />
      <div class="article-category" style="background-color: {BlogUtils.getCategoryColor(article.category)}">
        {article.category}
      </div>
    </div>
    
    <div class="article-content">
      <h1 class="article-title">{article.title}</h1>
      
      <div class="article-meta">
        <span class="article-date">{formatDate(article.date)}</span>
        <span class="article-author">Par {article.author}</span>
      </div>
      
      <div class="article-tags">
        {#each article.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
      
      <div class="article-body">
        {@html article.content || article.excerpt}
      </div>
    </div>
  </div>
</div>

<style>
  .article-reader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
    overflow-y: auto;
    /* Forcer le scroll natif et empêcher Lenis */
    overscroll-behavior: contain;
    /* Désactiver le smooth scroll de Lenis sur cet élément */
    scroll-behavior: auto !important;
  }

  .article-reader-card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1afa, #dc143c1a);
    border: 2px solid rgba(220, 20, 60, 0.5);
    border-radius: 15px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow: auto;
    overflow-x: hidden;
    box-shadow: 0 20px 60px #dc143c66;
    /* Forcer le scroll natif et empêcher Lenis */
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: auto !important;
  }

  .close-btn {
    position: sticky;
    top: 5px;
    left: 15px;
    background: #dc143ccc;
    border: none;
    color: #fff;
    width: 2%;
    height: 30px;
    border-radius: 50%;
    /* font-size: 1.5rem; */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .close-btn:hover {
    background: crimson;
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 0 20px rgba(220, 20, 60, 0.6);
  }

  .article-header {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
  }

  .article-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .article-category {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    color: white;
    font-weight: 600;
    text-transform: capitalize;
  }

  .article-content {
    padding: 40px;
  }

  .article-title {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    margin: 0 0 20px 0;
    line-height: 1.3;
  }

  .article-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    color: rgba(220, 220, 220, 0.7);
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
  }

  .tag {
    background: rgba(220, 20, 60, 0.2);
    color: rgb(250, 245, 245);
    padding: 6px 14px;
    border-radius: 15px;
    font-size: clamp(0.7rem, 1vw, 0.9rem);
    border: 1px solid rgba(220, 20, 60, 0.3);
    font-family: "Orbitron", cursive;
  }

  .article-body {
    font-family: "Orbitron", cursive;
    color: rgb(220, 220, 220);
    font-size: clamp(0.9rem, 1.3vw, 1.1rem);
    line-height: 1.8;
  }

  .article-body :global(h2) {
    color: crimson;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .article-body :global(h3) {
    color: #ff6b6b;
    margin-top: 25px;
    margin-bottom: 12px;
  }

  .article-body :global(p) {
    margin-bottom: 15px;
  }

  .article-body :global(a) {
    color: crimson;
    text-decoration: underline;
  }

  .article-body :global(code) {
    background: rgba(220, 20, 60, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .article-reader-overlay {
      padding: 1px;
    }

    .article-header {
      height: 200px;
    }

    .article-content {
      padding: 20px;
    }

    .close-btn {
      width: 35px;
      height: 35px;
      font-size: 1.2rem;
    }
  }
</style>

