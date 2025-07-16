<template>
  <div class="text-overlay absolute md:top-1/2 top-8 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 text-white z-10 max-w-3xl w-full p-8">
    <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
      <div class="text-center md:text-left">
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
