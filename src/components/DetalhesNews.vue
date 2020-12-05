<template>
  <b-container>
    <div v-if="!$route.params.news.title" class="mt-4">
      Nenhuma notícia selecionada
      <hr>
      <b-button  variant="dark" @click="$router.go(-1)">
        <span>Voltar </span><b-icon icon="backspace"></b-icon></b-button>
    </div>
    <div v-else>
    <b-card-text class="mt-2">
      <span style="text-shadow: 1px 1px 2px #333;font-size: 2.2em" v-html="$route.params.news.title"></span>
    </b-card-text>
    <b-card
        overlay
        img-width="1024"
        text-variant="white"
        :sub-title="$route.params.news.desc"
        :img-src="$route.params.news.urlToImage"
        img-alt="Image"
        img-top
        tag="article"
        class="mt-2"
        style="max-width: 80rem;text-shadow: 1px 1px 2px #333;">
      <b-card-text>
        <span style="text-shadow: 1px 1px 2px #333;" v-html="$route.params.news.content"></span>
      </b-card-text>
      <div class="text-right">
        <b-card-text>
          <b-link target="_blank" :href="$route.params.news.url">
          <b-button variant="light">
            <span>Ir para a matéria completa </span><b-icon icon="globe"></b-icon></b-button>
          </b-link>
        </b-card-text>
        <b-card-text>
          <b-button variant="light" @click="$router.go(-1)">
            <span>Voltar </span><b-icon icon="backspace"></b-icon></b-button>
        </b-card-text>
      </div>
    </b-card>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "DetalhesNews"
}
</script>

<style scoped>

</style>