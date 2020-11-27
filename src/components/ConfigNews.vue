<template>
  <div>
    <b-container class="container-fluid">
      <b-row v-if="user.data">
        <b-col style="min-width: 260px" class="mt-2">
          <b-card no-body
                  style="min-height: 360px"
                  header="Pesquisa de Notícias"
                  header-bg-variant="light"
                  >
            <div class="card-body">
              <b-form-group
                  required
                  id="pclabel"
                  description="Pesquise aqui notícias por palava-chave"
                  label="Palavra-Chave"
                  label-for="palavra"
                  label-align-sm="left" class="mb-0">
                <b-form-input id="palavra" v-model="palavrachave" trim ></b-form-input>
              </b-form-group>
              <b-form-group
                  label="Campo da pesquisa:"
                  label-align-sm="left" class="mt-3">
                <b-form-radio-group
                    class="pt-2"
                    :options="options"
                    v-model="campoPesquisa"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group class="text-right mt-3">
                <b-button @click="pesquisar">Pesquisar</b-button>
              </b-form-group>
              <b-form-group class="text-right mt-3" v-if="seleTodas">
                <b-button @click="slecionarTodasPesquisa" variant="outline-secondary" size="sm">Selecionar Todas</b-button>
              </b-form-group>
              <b-form-group class="text-right mt-3" v-if="seleTodas">
                <b-button @click="desmarcarTodasPesquisa" variant="outline-secondary" size="sm">Desmarcar Todas</b-button>
              </b-form-group>
            </div>
          </b-card>
        </b-col>
        <b-col style="min-width: 260px" class="mt-2">
          <b-card no-body
                  style="min-height: 360px"
                  header="Excluir Notícias do Slide"
                  header-bg-variant="light">
            <div class="card-body">
              <b-form-group class="text-right mt-3">
                <b-button @click="pesquisarExcluir">Listar Matérias</b-button>
              </b-form-group>
            </div>
            <div class="card-body" v-if="mostraSelTodas">
              <b-form-group class="text-right mt-3">
                <b-button @click="slecionarTodasExcluir" variant="outline-secondary" size="sm">Selecionar Todas</b-button>
              </b-form-group>
              <b-form-group class="text-right mt-3">
                <b-button @click="desmarcarTodasExcluir" variant="outline-secondary" size="sm">Desmarcar Todas</b-button>
              </b-form-group>
            </div>
          </b-card>
        </b-col>
      </b-row>

<!--      abaixo o resultado das pesquisas-->
      <b-row class="mt-4 text-right">
        <b-col>
<!--          inclusão de matérias-->
          <b-card-group deck columns v-if="lista">
            <b-card v-for="(news,index) in lista.news" :key="index"
                    header-bg-variant="secondary"
                    style="min-width: 254px; max-width: 254px"
                    :header="news.title"
                    align="center"
                    class="mt-2"
                    header-text-variant="white">
              <b-card-text align="left">{{ news.description}}</b-card-text>
              <b-card-text>
                <b-form-group label="Selecione para clipping:">
                  <b-form-checkbox
                      name="materia"
                      v-model="materias"
                      :options="news"
                      :value="news">
                    Matéria selecionada
                  </b-form-checkbox>
                </b-form-group>
              </b-card-text>
            </b-card>
          </b-card-group>
<!--       lista   exclusao-->
          <b-card-group deck columns v-if="excluLista">
            <b-card v-for="(news,index) in excluLista" :key="index"
                    header-bg-variant="secondary"
                    style="min-width: 254px; max-width: 254px"
                    :header="news.title"
                    align="center"
                    class="mt-2"
                    header-text-variant="white">
              <b-card-text align="left">{{ news.desc }}</b-card-text>
              <b-card-text>
                <b-form-group label="Selecione para excluir:">
                  <b-form-checkbox
                      name="materia"
                      v-model="meteriasExcl"
                      :options="news"
                      :value="news">
                    Matéria a ser deletada
                  </b-form-checkbox>
                </b-form-group>
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="mt-2 mb-5" v-if="listaBool">
        <b-col>
          <b-button block @click="enviaLista(materias)">Gravar</b-button>
        </b-col>
      </b-row>
      <b-row class="mt-2 mb-5" v-if="excluListaBool">
        <b-col>
          <b-button block @click="excluirMat(meteriasExcl)">Excluir</b-button>
        </b-col>
      </b-row>

      <b-modal id="modalok" ref="my-modal" hide-footer>
        <template #modal-title>
          Configuração das Notícias
        </template>
        <div class="d-block text-center">
          <h3>Notícia(s) inserida(s) com sucesso!</h3>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalok')">Fechar</b-button>
      </b-modal>

      <b-modal id="modalexc" ref="my-modal-exc" hide-footer>
        <template #modal-title>
          Exclusão de Notícias
        </template>
        <div class="d-block text-center">
          <h3>Notícia(s) excluída(s) com sucesso!</h3>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalexc')">Fechar</b-button>
      </b-modal>

      <b-modal id="modalerr" ref="my-modal-err" hide-footer>
        <template #modal-title>
          Erro
        </template>
        <div class="d-block text-center">
          <h3> {{ error }}</h3>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalerr')">Fechar</b-button>
      </b-modal>

    </b-container>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import firebase from "firebase";

export default {
name: "ConfigNews",
  data(){
    return{
      seleTodas:false,
      mostraSelTodas: false,
      listaBool: false,
      excluListaBool: false,
      excluirBusca:'',
      excluLista: [],
      newsLista: [],
      sucesso:'',
      error:'',
      materias:[],
      meteriasExcl:[],
      lista:'',
      palavrachave:'',
      options:[
        {text: 'Título',value:'qInTitle'},
        {text: 'Conteúdo',value:'q'}
      ],
      optionsExc:[
        {text: 'Título',value:'qInTitle'},
        {text: 'Descrição',value:'q'}
      ],
      campoPesquisa:'',
      campoPesquisaExcl:''
    }
  },
  methods:{
    desmarcarTodasPesquisa(){
      this.materias = []
    },
    slecionarTodasPesquisa(){
      for (let i=0; i< this.lista.news.length; i++){
        this.materias.push(this.lista.news[i])
      }
    },
    desmarcarTodasExcluir(){
      this.meteriasExcl = []
    },
    slecionarTodasExcluir(){
      for (let i=0; i< this.excluLista.length; i++){
        this.meteriasExcl.push(this.excluLista[i])
      }
    },
    excluirMat(materiasExcl){
      const db = firebase.firestore()
      for (let i=0; i < materiasExcl.length; i++){
        var matTit = materiasExcl[i].title
        var materia =
            db.collection('materias')
            .where('title','==',matTit);
        materia.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
            this.$refs['my-modal-exc'].show();
            this.excluLista = [];
            this.excluListaBool = false;
            this.mostraSelTodas = false;
          });
        });
      }
    },
    pesquisarExcluir(){
      this.seleTodas = false;
      this.mostraSelTodas = true;
      this.listaBool = false
      this.excluListaBool = true
      this.excluLista = []
      this.lista = []
      const dataMat = new Date().toLocaleDateString()
        // eslint-disable-next-line no-unused-vars
        const db = firebase.firestore().collection("materias")
            .where('dataMat','==',dataMat)
            .get()
            .then((querySnapshot) =>{
              querySnapshot.forEach((doc) => {
                this.excluLista.push(doc.data())
              });
            })
            .catch(function(error) {
              console.error("Error getting documents: ", error);
            });
    },
    enviaLista(mat){
      this.sucesso = '';
      this.error = '';
      const db = firebase.firestore().collection("materias")
      const dataMat = new Date().toLocaleDateString()
      //montar o objeto
      for (let i=0; i < mat.length; i++){
        db.doc()
            .set({
              dataMat: dataMat,
              title:mat[i].title,
              desc:mat[i].description,
              content:mat[i].content,
              urlToImage:mat[i].urlToImage,
              url:mat[i].url,
              author:mat[i].author
            }, { merge: true })
            .then(()=> {
              this.$refs['my-modal'].show()
              this.lista = [];
              this.listaBool = false;
              this.seleTodas = false;
              this.palavrachave = '';
              this.campoPesquisa = ''

            })
            .catch((error)=> {
              this.error = error
              this.$refs['my-modal-err'].show()
            });
      }

    },
    pesquisar(){
      this.mostraSelTodas = false
      this.seleTodas = true
      this.listaBool = true
      this.excluListaBool = false
      this.excluLista = []
      this.lista = []
      this.$store.commit('resetNews')
      this.$store.dispatch('getNews', {palavra: this.palavrachave, onde: this.campoPesquisa});
      this.lista = this.$store.state.news
    }
  },
  computed:{
    ...mapGetters({
      user: "user"
    })
  },
  created() {
    if (this.user.data == null){
      this.$router.replace({
        name: "acessorestrito"
      });
    }
  }
}
</script>

<style scoped>

</style>