<template>
  <div class="text-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10 max-w-3xl w-full p-8">
    <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
      <img
        src="/images/me.jpg"
        alt="Nicholas Bennett portrait"
        class="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-lg border-4 border-green-500"
      >
      <div class="text-center md:text-left">
        <h1 class="text-3xl font-bold text-white mb-2">Nicholas Bennett</h1>
        <h2 class="text-2xl mb-2">Frontend Developer</h2>
        <p class="code-comment mt-2 text-sm text-[#66ff66]">// Decoding Dev Mysteries for Actual Humans</p>
        <p class="text-lg mb-4">
          👋 Hi there! I make things with JavaScript, Python, and SQL.
        </p>
        <p class="text-lg mb-4">
          🚗 Fun fact: I drove 4,000+ Uber rides and reverse-engineered their hidden API to analyze my own data. Check out the full writeup on:
          <a href="https://dev.to/nrrb/how-i-hacked-ubers-hidden-api-to-download-4379-rides-35ai" class="text-green-400 hover:underline">DEV.to</a>
        </p>
        <p class="text-lg mb-4">
          💼 Let's connect:
        </p>
        <ul class="list-none space-y-2">
          <li>
            <a href="https://www.linkedin.com/in/nicholasrrbennett" class="text-green-400 hover:underline">LinkedIn</a>
          </li>
          <li>
            <a href="https://github.com/nrrb" class="text-green-400 hover:underline">GitHub</a>
          </li>
        </ul>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-overlay {
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
}
</style>
