<script>
  import { onMount } from 'svelte';
  import Navbar from '../modules/ui/navbar/Navbar.svelte';
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

<Navbar />

<svelte:head>
  <title>Contact Us - CodeurBase</title>
</svelte:head>

<section class="contact-section">
  <div class="contact-container">
    <h1>Contact Us</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} required />
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" bind:value={message} required></textarea>
      </div>
      <button type="submit">Send</button>
    </form>
    {#if isSubmitted}
      <p class="success-message">Thank you for your message! We will get back to you soon.</p>
    {/if}
  </div>
</section>

<style>
  .contact-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100svh;
    background-color: #f4f4f9;
  }

  .contact-container {
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
  }

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
