<template>
  <b-container class="mt-2">
    <b-card-group columns v-if="$store.getters.getNewsResult">
      <b-card v-for="(news,index) in $store.getters.getNewsResult" :key="index"
          :title="news.title"
          :img-src="news.urlToImage"
          img-alt="Image"
          img-top>
        <b-card-text>
          <span>{{ news.desc }}</span>
        </b-card-text>
        <template #footer>
          <small class="text-muted"> {{ news.dataMat }}</small>
          <b-card-text class="mt-2 text-right">
            <b-link :href="news.url" variant="outline-warning"> Link para a Matéria </b-link>
          </b-card-text>
        </template>
      </b-card>
    </b-card-group>
    <b-card-group columns v-if="!$store.getters.getNewsResult.length">
      <b-card>
        <b-card-text>
          Nenhuma notícia encontrada. Tente outra palavra-chave.
        </b-card-text>
        <b-card-text class="mt-5 text-right">
          <b-button  variant="dark" @click="$router.go(-1)">
            <span>Voltar </span><b-icon icon="backspace"></b-icon></b-button>
        </b-card-text>
        <template #footer>
          <small class="text-muted"></small>
          <b-card-text class="mt-2 text-right">
          </b-card-text>
        </template>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
export default {
name: "ResultadoPesquisa"
}
</script>

<style scoped>

</style>