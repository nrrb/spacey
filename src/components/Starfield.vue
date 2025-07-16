<template>
  <div class="relative w-screen h-screen bg-[#0c0c1d] font-mono overflow-hidden m-0 p-0">
    <canvas 
      ref="canvasRef"
      class="absolute top-0 left-0"
    />
    <ProfileCard>
      <button 
        v-if="!musicStore.isPlaying"
        @click="togglePlay"
        class="mt-6 px-6 py-2 rounded-lg text-lg font-bold text-white transition bg-green-600 hover:bg-green-700"
      >
        A cosmic ray told me to play this song
      </button>
    </ProfileCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMusicStore } from '../stores/music'
import ProfileCard from './ProfileCard.vue'

const canvasRef = ref(null)
const musicStore = useMusicStore()

const togglePlay = async () => {
  if (!musicStore.isPlaying) {
    await musicStore.start()
  } else {
    musicStore.stop()
  }
}

const maxSpeed = 4
const minSpeed = 1
const maxSize = 2
const minSize = 0.5

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  
  // Create stars
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
  }))
  
  // Animation function
  function animate() {
    ctx.fillStyle = 'rgba(24,24,36,0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    stars.forEach(star => {
      star.x = (star.x + star.speed) % canvas.width
      ctx.fillStyle = 'white'
      let size = (star.speed - minSpeed) * (maxSize - minSize) / (maxSpeed - minSpeed) + minSize
      ctx.fillRect(star.x, star.y, size, size)
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
