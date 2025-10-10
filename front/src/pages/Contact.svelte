<script>
  import { onMount } from 'svelte';
    import Navbar from '../modules/ui/portfolio/navbar/Navbar.svelte';
    import ChatMvp from '../modules/ui/chatMvp/ChatMvp.svelte';
    let email = '';
  let message = '';
  let isSubmitted = false;

  function handleSubmit() {
    if (email && message) {
      const mailtoLink = `mailto:contact@codeurbase.fr?subject=Contact&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
      isSubmitted = true;
    }
  }
</script>


<svelte:head>
  <title>Contact moi! - CodeurBase</title>
</svelte:head>

<section class="contact-section">
  <ChatMvp />
</section>

<style>
  .contact-section {
 
    background-color: #322f2ff4;
    width: 100vw;
  }

  /* .contact-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
  }

  h1 {
    margin-bottom: 1rem;
    font-size: 2rem;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  } */

  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover {
    background-color: #556cd6;
  }

  .success-message {
    margin-top: 1rem;
    color: green;
    text-align: center;
  }
</style>
