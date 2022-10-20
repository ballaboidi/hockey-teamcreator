<template>
  <div class="py-5 border-t border-gray-300 flex flex-row justify-between items-center">
    <div class="game-details flex flex-row space-x-8 items-center">
      <p class="text-lg">{{ game.title }}</p>
      <p class="text-slate-400 text-lg">{{ game.date|formatDate() }}</p>
    </div>
    <NuxtLink
      class="text-lg bg-slate-600 text-white px-3 py-2 uppercase rounded-md hover:bg-slate-500 transition"
      :to="gameLink"
    >
      Details
    </NuxtLink>
  </div>
</template>

<script>
  export default {
    name: 'GameRow',
    props: {
      id: {
        type: String,
        default: undefined
      },
      game: {
        type: Object,
        default: undefined,
      }
    },
    computed: {
      gameLink() {
        return `/game/${this.id}`
      }
    }
  }
</script>
