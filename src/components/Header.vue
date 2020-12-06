<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="secondary">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">Clippingz <span class="version">v.1</span></b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text class="ml-3 text-monospace">Notícias Selecionadas
          <b-icon scale="1" icon="newspaper"></b-icon>
          </b-nav-text>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-input-group size="sm" prepend="Notícias">
            <b-form-input autocomplete="off" v-model="palavra"></b-form-input>
            <b-input-group-append>
              <b-button size="sm" text="Ok" variant="primary" @click="pesquisaNews">Pesquisar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item class="ml-4" to="/confignews">Acesso Restrito</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
      <b-button v-show="user.data" variant="outline-danger" @click="signOut" class="ml-2" size="sm"><b-icon icon="door-closed"></b-icon></b-button>
    </b-navbar>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import firebase from "firebase";

export default {
  name: "Header",
  data(){
    return{
      palavra:''
    }
  },
  methods:{
    pesquisaNews(){
      this.$store.commit('resetNewsResult')
      const newsArr = this.$store.getters.getNewsLista
      console.log(newsArr)
      for (let i = 0; i < newsArr.length; i++){
        console.log(i)
        if (newsArr[i].desc.toLowerCase().includes(this.palavra.toLowerCase()) ||
              newsArr[i].content.toLowerCase().includes(this.palavra.toLowerCase()) ||
              newsArr[i].title.toLowerCase().includes(this.palavra.toLowerCase()))
        {
          this.$store.commit('setNewsResult',newsArr[i])
        }
      }
      if (this.$route.name !== 'resultadopesquisa'){
        this.$router.push({name: 'resultadopesquisa'})
      }
    },
    signOut() {
      firebase
          .auth()
          .signOut()
          .then(() => {
            if (this.$route.name !== 'lista'){
              this.$router.replace({
                name: "lista"
              });
            }
          });
    }
  },
  computed:{
    ...mapGetters({
      user: "user"
    })
  }
}
</script>

<style scoped>
.version{
  font-family: monospace;
  font-size: 0.4em;
}
</style>