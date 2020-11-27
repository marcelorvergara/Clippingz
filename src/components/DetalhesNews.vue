<template>
  <b-container>
    <b-card-text>
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
      <b-card-text>
        <b-link target="_blank" :href="$route.params.news.url" variant="outline-warning"> Ir para a matéria completa </b-link>
      </b-card-text>

      <b-button @click="$router.go(-1)" squared variant="info">Voltar <b-icon icon="skip-backward-fill"></b-icon></b-button>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "DetalhesNews"
}
</script>

<style scoped>

</style>