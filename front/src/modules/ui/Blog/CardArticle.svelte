<script>
  import { BlogUtils } from "./scriptBlog.js";

  export let article;
  export let formatDate;
  export let onRead;
</script>

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
      <span class="card-date">{formatDate(article.date)}</span>
      <span class="card-author">Par {article.author}</span>
    </div>
    <div class="card-tags">
      {#each article.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
    <button class="read-more-btn" on:click={onRead}>Lire l'article →</button>
  </div>
</article>

<style>
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
</style>

