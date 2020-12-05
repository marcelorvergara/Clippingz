<template>
  <b-container class="mt-3">
      <b-card
          v-if="!$store.getters.getNewsLista.length"
          overlay
          img-alt="Card Image"
          text-variant="white"
          title="Nenhuma notícia encontrada no banco de dados"
          sub-title="O administrador do sistema não inseriu notícias no banco de dados para visualização dos usuários">
        <b-card-text>
          Para que os usuários do site Clippingz consigam ver notícias nessa página, é necessário que o administrador
          do sistema insira notícias no banco de dados. Assim que a primeira notícia for inserida, essa página dará
          lugar a notícia inserida.
        </b-card-text>
        <b-card-text class="d-flex justify-content-center mb-3">
          <b-spinner variant="danger" label="Loading..." style="width: 10rem; height: 10rem;" type="grow"></b-spinner>
        </b-card-text>
      </b-card>
    <b-carousel
        v-else
        id="carousel"
        v-model="slide"
        :interval="4000"
        fade
        controls
        indicators
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
    >
      <b-carousel-slide v-for="(news,index) in this.$store.getters.getNewsLista" :key="index"
          :caption="news.title"
          :text="news.description"
          :img-src=getIagens(index)
      >
      <router-link
          exact :style="{ cursor: 'grab'}"
          tag="h5" class="card-title" :to="{ name:'detalhesnews', params:{news: news}}">
          <span class="vejamais">Veja Mais</span>
      </router-link>
      </b-carousel-slide>
    </b-carousel>
  </b-container>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "ListaNews",
  data(){
    return{
      slide: 0,
      sliding: null,
      imagens:''
    }
  },
  methods:{
    getIagens(index){
      return `https://picsum.photos/1024/480?random=${index}`
    },
    // eslint-disable-next-line no-unused-vars
    onSlideStart(slide) {
      this.sliding = true
      },
    // eslint-disable-next-line no-unused-vars
    onSlideEnd(slide) {
      this.sliding = false
      },
    getNews(){
      this.$store.commit('resetNewsLista')
      const dataMat = new Date().toLocaleDateString()
        // eslint-disable-next-line no-unused-vars
        const db = firebase.firestore().collection("materias")
            .where('dataMat','==',dataMat)
            .get()
            .then((querySnapshot) =>{
              querySnapshot.forEach((doc) => {
                this.$store.commit('setNewsLista',doc.data())
              });
            })
            .catch(function(error) {
              console.error("Error getting documents: ", error);
            });
    }
  },
  created() {
    this.getNews()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap');
.vejamais{
  color: white;
  text-shadow: 2px 2px 4px #000000;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: bold;
}
</style>