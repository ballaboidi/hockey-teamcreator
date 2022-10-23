<template>
  <div
    v-if="game"
    class="container mx-auto bg-white rounded-lg shadow-lg p-10"
  >
    <Header />
    <div class="border-t py-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
      <HomeBtn />
      <div class="game-general-info mb-5 w-1/2">
        <h1 class="uppercase text-3xl font-bold mb-1">
          {{ game.title }}
        </h1>
        <p class="text-slate-500">{{ game.date|formatDate() }}</p>
        <p class="mt-5 text-xl">Ort: {{ game.location }}</p>
      </div>
      <div class="game-general-players mb-5 flex flex-row items-center h-fit flex-wrap">
        <img
          class="h-[35px] "
          src="../../assets/img/beer_vector.svg" alt="Bier Icon"
        >
        <p class="text-xl ml-3"><strong>Unsere Biersponsoren sind diesmal: </strong></p>
        <div class="players-beer-list w-full flex flex-col">
          <div
            v-for="player in game.beers.data"
            :key="player.id"
            class="w-full mt-3 text-lg"
          >
            {{ player.attributes.name }} <strong>({{ player.attributes.beer.data.length }})</strong>
          </div>
        </div>
      </div>
      <div
        class="players-registered my-8"
      >
          <h2 class="text-2xl uppercase pb-3">Eingetragene Spieler*innen:</h2>
          <div
            v-for="player in game.players.data"
            :key="player.id"
            class="registered-player border-t py-3 flex flex-row items-center"
          >
            <p>{{ player.attributes.name }} <strong>({{ player.attributes.games.data.length }})</strong></p>
          </div>
      </div>
      <div
        v-if="teams"
        class="players-teams my-8"
      >
        <h3 class="mb-3 text-xl uppercase font-bold">BLACK TEAM</h3>
        <div
          v-for="player in teams.black"
          :key="player.id"
          class="w-full border-t py-3 text-lg"
        >
          <p>{{ player.name }}</p>
        </div>
        <h3 class="mb-3 mt-5 text-xl uppercase font-bold">WHITE TEAM</h3>
        <div
          v-for="player in teams.white"
          :key="player.id"
          class="w-full border-t py-3 text-lg"
        >
          <p>{{ player.name }}</p>
        </div>
      </div>
      <div
        v-if="!teams"
        class="create-teams-btn uppercase lg:col-span-2 py-3 cursor-pointer h-[65px] rounded-md
      bg-green-700 hover:bg-green-500 transition text-white flex items-center justify-center text-lg"
        @click ="generateTeams()"
      >
        Mannschaften erstellen
      </div>
      <div
        v-if="teams"
        class="recreate-teams-btn lg:col-span-2 uppercase py-3 cursor-pointer h-[55px] rounded-md 
        bg-yellow-600 hover:bg-yellow-500 transition text-white flex items-center justify-center text-lg"
        @click ="generateTeams()"
      >
        Mannschaften erneut generieren
      </div>
      <div class="dev-output w-full">
      </div>
      <div
        v-if="generating"
        class="generating-modal fixed flex items-center justify-center bg-white opacity-80 
        top-0 left-0 w-screen h-screen"
      >
        <img
          class="h-[55px] w-[55px]"
          src="../../assets/img/loader.svg"
        >
      </div>
    </div>
  </div>
</template>

<script>
  import { SingleGame } from '~/apollo/queries/Games.gql'
  import { UpdateGame } from '~/apollo/mutations/GamesMutations.gql'
  import HomeBtn from '~/components/partials/HomeBtn'

  export default {
    apollo: {
      game: {
        query: SingleGame,
        prefetch: ({ route }) => ({ id: route.params.id }),
        variables() {
          return { id: this.$route.params.id }
        },
        update(data) {
          return data.game.data.attributes
        }
      }
    },
    data() {
      return {
        generating: false,
        teams: undefined
      }
    },
    components: {
      HomeBtn
    },
    mounted() {
      setTimeout(() => {
        if(this.game.teams) {
          this.teams = JSON.parse(this.game.teams)
        }
      }, 300)
    },
    methods: {
      async generateTeams() {
        this.generating = true
        this.teams = undefined
        const players = await this.getRegisteredPlayers()
        players.sort(() => Math.random() - 0.5)
        setTimeout(() => {
          this.teams = this.addPlayersToTeams(players)
          this.generating = false
          this.updateTeamEntity()
        }, 3000)
      },
      async getRegisteredPlayers() {
        const players = []
        this.game.players.data.forEach((player) => {
          const playerObj = {
            id: player.id,
            name: player.attributes.name,
            strength: player.attributes.strength,
          }
          players.push(playerObj)
        })
        return players
      },
      addPlayersToTeams(players) {
        let teams = undefined
        let index = 1
        const black = []
        const white = []
        const schwab = []

        players.forEach((player) => {
          if (player.strength != 'schwab') {
            index % 2 == 0 ? black.push(player) : white.push(player)
            index++
          } else {
            schwab.push(player)
          }
        })

        if (schwab.length > 0) {
          schwab.forEach((player, index) => {
            const indexCalc = index + 1
            indexCalc % 2 == 0 ? black.push(player) : white.push(player)
          })
        }

        teams = {
          black,
          white
        }
        return teams
      },
      updateTeamEntity() {
        this.$apollo.mutate({
          mutation: UpdateGame, 
          variables: {
            id: this.$route.params.id,
            teams: JSON.stringify(this.teams)
          }
        })
      }
    }
  }
</script>
