<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="secondary">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">Clippingz <span class="version">v3.1</span></b-navbar-brand>

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
              <b-button size="sm" text="Ok" variant="primary" @click="pesquisaNews" id="pesquisar">Pesquisar <b-icon icon="search"></b-icon></b-button>
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
      //reset da lista de pesquisa anterior
      this.$store.commit('resetNewsResult')
      //buscar no banco de dados
      this.$store.dispatch('pesquisaNewsDB',{palavra:this.palavra})

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

<style lang="scss">
@import "../../node_modules/bootstrap/scss/functions";
@import "../styles/variables";

.version{
  font-family: monospace;
  font-size: 0.4em;
}
#pesquisar{
  background-color: #035dbd;
}
</style>