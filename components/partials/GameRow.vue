<template>
  <div class="py-5 border-t border-gray-300 flex flex-row justify-between items-center">
    <div class="game-details flex flex-row space-x-8 items-center">
      <div class="game-details-player-numbers text-xl">
        <span
          class="font-bold"
          :class="isFull"
        >
          {{ playerNumber }}</span> / {{ maxPlayers }}
        <p class="inline text-xl ml-3 mr">Spieler</p>
      </div>
      <p class="text-xl">{{ game.title }}</p>
      <p class="text-slate-400 text-xl">{{ game.date|formatDate() }}</p>
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
    data() {
      return {
        maxPlayers: 16
      }
    },
    computed: {
      gameLink() {
        return `/game/${this.id}`
      },
      isFull() {
        return this.playerNumber == this.maxPlayers ? 'text-red-700' : 'text-green-700'
      },
      playerNumber() {
        return this.game.players.data.length
      }
    }
  }
</script>
