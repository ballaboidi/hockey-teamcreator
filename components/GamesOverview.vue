<template>
  <div 
    v-if="games"
    class="container mx-auto bg-white rounded-lg shadow-lg p-10">
    <GameRow 
      v-for="game in games"
      :key="game.id"
      :id="game.id"
      :game="game.attributes"
    />
  </div>
</template>

<script>
  import { AllGames } from '~/apollo/queries/Games.gql'
  import GameRow from './partials/GameRow.vue'

  export default {
    components: {
      GameRow
    },
    apollo: {
      games: {
        prefetch: true,
        query: AllGames,
        update(data) {
          return data.games.data
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>