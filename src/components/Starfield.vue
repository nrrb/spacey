<template>
  <div class="relative w-full h-screen bg-[#0c0c1d] font-mono overflow-hidden">
    <canvas 
      ref="canvasRef"
      class="absolute top-0 left-0"
    />
    <div class="text-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10" :style="{ textShadow: '0 0 4px rgba(0,0,0,0.7)' }">
      <h1 class="text-2xl">Nicholas Bennett</h1>
      <h1 class="text-2xl">Frontend Developer</h1>
      <p class="code-comment mt-2 text-sm text-[#66ff66]">// Decoding Dev Mysteries for Actual Humans</p>
      <button 
        v-if="!musicStore.isPlaying"
        @click="togglePlay"
        class="mt-4 px-6 py-2 rounded-lg text-lg font-bold text-white transition bg-green-600 hover:bg-green-700"
      >
        A cosmic ray told me to play this song
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMusicStore } from '../stores/music'

const canvasRef = ref(null)
const musicStore = useMusicStore()

const togglePlay = async () => {
  if (!musicStore.isPlaying) {
    await musicStore.start()
  } else {
    musicStore.stop()
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  
  // Create stars
  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 3 + 1
  }))
  
  // Animation function
  function animate() {
    ctx.fillStyle = 'rgba(24,24,36,0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    stars.forEach(star => {
      star.x = (star.x + star.speed) % canvas.width
      ctx.fillStyle = 'white'
      ctx.fillRect(star.x, star.y, 2, 2)
    })
    
    requestAnimationFrame(animate)
  }
  
  // Start animation
  animate()
  
  // Handle window resizing
  function handleResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    musicStore.cleanup()
  })
})
</script>

<style scoped>
.text-overlay {
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
}
</style>
