<template>
  <div>
    <b-navbar toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">Clippingz</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text class="ml-3 text-monospace">Notícias Selecionadas</b-nav-text>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-input-group size="sm" prepend="Notícias">
            <b-form-input autocomplete="off" v-model="palavra"></b-form-input>
            <b-input-group-append>
              <b-button size="sm" text="Ok" variant="" @click="pesquisaNews">Pesquisar</b-button>
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
      var newsArr = this.$store.getters.getNewsLista
      for (let i= 0; i< newsArr.length;i++){
        var ok = newsArr[i].desc.includes(this.palavra)
        if (ok){
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
            this.$router.replace({
              name: "lista"
            });
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

</style>