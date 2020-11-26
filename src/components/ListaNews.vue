<template>
  <b-container class="mt-3">
      <b-carousel
          v-if="this.$store.getters.getNewsLista"
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
            :img-src=imagens[index].img
        >
        <router-link
            exact :style="{ cursor: 'grab'}"
            tag="h5" class="card-title" :to="{ name:'detalhesnews', params:{news: news}}">
            Clique Aqui para Detalhes
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
      imagens:[
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'},
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'},
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'},
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'},
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'},
        {img: 'https://picsum.photos/1024/480/?image=52'},
        {img: 'https://picsum.photos/1024/480/?image=54'},
        {img: 'https://picsum.photos/1024/480/?image=55'},
        {img: 'https://picsum.photos/1024/480/?image=10'},
        {img: 'https://picsum.photos/1024/480/?image=12'},
        {img: 'https://picsum.photos/1024/480/?image=22'},
        {img: 'https://picsum.photos/1024/480/?image=23'}
      ]
    }
  },
  methods:{
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
        // eslint-disable-next-line no-unused-vars
        const db = firebase.firestore().collection("materias")
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

</style>