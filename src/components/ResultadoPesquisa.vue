<template>
  <b-container class="mt-2">
    <b-card-group columns v-if="$store.getters.getNewsResult">
      <b-card v-for="(news,index) in $store.getters.getNewsResult" :key="index"
          :title="news.title"
          :img-src="news.urlToImage"
          img-alt="Image"
          img-top>
        <b-card-text>
          {{ news.desc }}
        </b-card-text>
        <template #footer>
          <small class="text-muted"> {{ news.dataMat }}</small>
          <b-card-text class="mt-2 text-right">
            <b-link :href="news.url" variant="outline-warning"> Link para a Matéria </b-link>
          </b-card-text>
        </template>
      </b-card>
    </b-card-group>
    <b-card-group columns v-if="$store.getters.getNewsResult">
      <b-card>
        <b-card-text>
          Nenhuma notícia encontrada
        </b-card-text>
        <b-card-text class="mt-5 text-right">
          <router-link
              exact :style="{ cursor: 'grab'}"
              tag="button" class="card-title btn btn-outline-info" :to="{ name:'lista'}">
            <b-icon icon="skip-backward-fill"></b-icon>
            Voltar
          </router-link>
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