<template>
  <div>
    <b-progress v-if="$store.getters.getProgress" :value="this.numNews" :max="$store.getters.getNewsTemp.length" animated></b-progress>
    <b-container class="container-fluid">
      <b-card no-body
              class="mt-3 text-center"
              header="Acesso Restrito"
              header-bg-variant="secondary"
              header-text-variant="white"
      >
      <b-row v-if="user.data">
        <b-col style="min-width: 260px" class="mt-2">
          <b-card no-body
                  style="min-height: 360px"
                  header="Pesquisa de Notícias"
                  header-bg-variant="secondary"
                  header-text-variant="white"
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
                  label="Onde pesquisar nas notícias:"
                  label-align-sm="left" class="mt-3">
                <b-form-radio-group
                    class="pt-2 text-left"
                    :options="options"
                    v-model="campoPesquisa"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group class="text-right mt-3">
                <b-form-select v-model="idiomas" :options="optIdiomas"></b-form-select>
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Favor selecionar uma opção --</b-form-select-option>
                </template>
              </b-form-group>
              <b-form-group class="text-right mt-3">
                <b-form-select v-model="numNews" :options="optNumNews"></b-form-select>
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Favor selecionar uma opção --</b-form-select-option>
                </template>
              </b-form-group>
              <b-form-group class="text-right mt-3">
                <b-button @click="pesquisaNews">Pesquisar
                  <b-icon icon="search"></b-icon>
                </b-button>
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
                  header="Excluir Notícias"
                  header-bg-variant="secondary"
                  header-text-variant="white">
            <div class="card-body text-left">

              <b-form-group label="Selecione as matérias para exclusão:">
                <b-form-radio-group
                    id="radio-group-exclusao"
                    v-model="selExclusao"
                    :options="optExclusao"
                    name="radio-options"></b-form-radio-group>
                <b-form-group class="text-right mt-3">
                  <b-button @click="pesquisarExcluir">Listar
                    <b-icon icon="card-list"></b-icon>
                  </b-button>
                </b-form-group>
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
          <b-card-group deck columns v-if="$store.getters.getNewsTemp">
            <b-card border-variant="dark" align="left"
                    v-for="(news,index) in $store.getters.getNewsTemp" :key="index"
                    header-bg-variant="secondary"
                    style="min-width: 254px; max-width: 254px"
                    :header="news.title"
                    class="mt-2"
                    header-text-variant="white">

              <b-card-text align="left">{{ news.description}}</b-card-text>
              <b-card-text>
                <b-form-group label="Selecione para clipping:">
                  <b-form-checkbox
                      switch
                      name="materia"
                      v-model="materias"
                      :options="news"
                      :value="news"
                      v-b-tooltip.hover.rightbottom title="Selecione aqui a matéria para inserção no clipping e depois
                                      clique no botão Adicionar no final dessa página">
                    Matéria selecionada
                  </b-form-checkbox>
                </b-form-group>
              </b-card-text>
            </b-card>
          </b-card-group>
<!--       lista   exclusao-->
          <b-card-group deck columns v-if="excluLista">
            <b-card border-variant="danger" align="left"
                    v-for="(news,index) in excluLista" :key="index"
                    header-bg-variant="secondary"
                    style="min-width: 254px; max-width: 254px"
                    :header="news.title"
                    class="mt-2"
                    header-text-variant="white">
              <b-card-text align="left">{{ news.desc }}</b-card-text>
              <b-card-text>
                <b-form-group label="Selecione para excluir:">
                  <b-form-checkbox
                      switch
                      name="materia"
                      v-model="meteriasExcl"
                      :options="news"
                      :value="news"
                      v-b-tooltip.hover.rightbottom title="Selecione aqui a matéria para excluir da base de dados e depois
                                      clique no botão Excluir no final dessa página">
                    <span class="text-danger">Matéria será excluída <b-icon icon="trash-fill"></b-icon></span>
                  </b-form-checkbox>
                </b-form-group>
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="mt-2 mb-5" v-if="listaBool">
        <b-col>
          <b-button block @click="enviaLista(materias)">Adicionar <b-icon icon="journal-plus"></b-icon></b-button>
        </b-col>
      </b-row>
      <b-row class="mt-2 mb-5" v-if="excluListaBool">
        <b-col>
          <b-button block @click="excluirMat(meteriasExcl)">Excluir <b-icon icon="trash"> </b-icon></b-button>
        </b-col>
      </b-row>
<!--      model ok-->
      <b-modal id="modalok" ref="my-modal" hide-footer>
        <template #modal-title>
          <b-icon icon="check2-circle" scale="2" variant="success"></b-icon>
          <span class="m-3">Inserção das Notícias</span>
        </template>
        <div class="d-block text-center">
          <h5>Notícia(s) inserida(s) com sucesso!</h5>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalok')">Fechar</b-button>
      </b-modal>
<!-- model exclusão-->
      <b-modal id="modalexc" ref="my-modal-exc" hide-footer>
        <template #modal-title>
          <b-icon icon="exclamation-triangle-fill" scale="2" variant="warning"></b-icon>
          <span class="m-3">Exclusão de Notícias</span>
        </template>
        <div class="d-block text-center">
          <h5>Notícia(s) excluída(s) com sucesso!</h5>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalexc')">Fechar</b-button>
      </b-modal>
      <!-- model não há docs na base-->
      <b-modal id="modalsemnot" ref="my-modal-no-docs" hide-footer>
        <template #modal-title>
          <b-icon icon="exclamation-triangle-fill" scale="2" variant="warning"></b-icon>
          <span class="m-3">Não há Notícias no Banco de Dados</span>
        </template>
        <div class="d-block text-center">
          <h5>Não foram encontradas notícias para o dia atual no banco de dados!
            É necessário incluir notícias primeiro para excluir posteriormente!</h5>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalsemnot')">Fechar</b-button>
      </b-modal>
<!--model erro-->
      <b-modal id="modalerr" ref="my-modal-err" hide-footer>
        <template #modal-title>
          <b-icon icon="x-circle" scale="2" variant="danger"></b-icon>
          <span class="m-3">Erro</span>
        </template>
        <div class="d-block text-center">
          <h5> {{ error }}</h5>
        </div>
        <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalerr')">Fechar</b-button>
      </b-modal>
      </b-card>
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
      numNews:null,
      optNumNews:[
        {value: null ,text: "Selecione a Quantidade de Notícias"},
        {value: 5, text: 'Cinco Notícias'},
        {value: 6, text: 'Seis Notícias'},
        {value: 7, text: 'Sete Notícias'},
        {value: 8, text: 'Oito Notícias'},
        {value: 9, text: 'Nove Notícias'},
        {value: 10, text: 'Dez Notícias'},
        {value: 11, text: 'Onze Notícias'},
        {value: 12, text: 'Doze Notícias'},
        {value: 13, text: 'Treze Notícias'},
        {value: 14, text: 'Quatorze Notícias'},
        {value: 15, text: 'Quinze Notícias'},
        {value: 100, text: 'Todas as Notícia'},
      ],
      idiomas:null,
      optIdiomas:[
        {value: null ,text: "Selecione um Idioma"},
        {value: 'pt' ,text: "Português"},
        {value: 'de' ,text: "Deutsch"},
        {value: 'en' ,text: "English"},
        {value: 'es' ,text: "Español"},
        {value: 'fr' ,text: "français"},
        {value: 'it' ,text: "Italiano"},
        {value: 'nl' ,text: "Nederlands"},
        {value: 'no' ,text: "Norsk"},
      ],
      optExclusao:[
        { text:' Selecionar apenas matérias inseridas hoje', value: 'hoje'},
        { text:' Selecionar todas as matérias', value:'todas'}
      ],
      selExclusao:'',
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
      palavrachave: null,
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
      for (let i=0; i< this.$store.getters.getNewsTemp.length; i++){
        this.materias.push(this.$store.getters.getNewsTemp[i])
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
      if (materiasExcl.length === 0){
        this.error = 'É necessário selecionar alguma notícia para excluir!'
        this.$refs['my-modal-err'].show()
      }else{
          this.$store.dispatch('excluitMatDB',{materiasExcl: materiasExcl})
          this.$refs['my-modal-exc'].show();
          this.excluLista = [];
          this.excluListaBool = false;
          this.mostraSelTodas = false;
          this.selExclusao = ''
        }
      },
    pesquisarExcluir(){
      //limpar a tela
      this.$store.commit('resetNewsTemp')
      //botões de listar e desmarcar todas
      this.seleTodas = false;
      this.mostraSelTodas = true;
      this.listaBool = false
      this.excluListaBool = true
      //limpando a lista anterior
      this.excluLista = []
      if (this.selExclusao === '' || this.selExclusao === null){
        this.error = 'É necessário o período em que as matérias foram inseridas no sistema!'
        this.$refs['my-modal-err'].show()
        this.excluListaBool = false
        this.mostraSelTodas = false;
      } else {
        if (this.selExclusao === 'hoje'){
          const dataMat = new Date().toLocaleDateString()
          // eslint-disable-next-line no-unused-vars
          const db = firebase.firestore().collection("materias")
              .where('dataMat','==',dataMat)
              .get()
              .then((querySnapshot) =>{
                if (!querySnapshot.empty){
                  querySnapshot.forEach((doc) => {
                    this.excluLista.push(doc.data())
                  });
                }else {
                  this.$refs['my-modal-no-docs'].show()
                }
              })
              .catch(function(error) {
                this.error = error
                this.$refs['my-modal-err'].show()
                console.error("Error getting documents: ", error);
              });
        } else if (this.selExclusao === 'todas'){
          // eslint-disable-next-line no-unused-vars
          const db = firebase.firestore().collection("materias")
              .get()
              .then((querySnapshot) =>{
                if (!querySnapshot.empty){
                  querySnapshot.forEach((doc) => {
                    this.excluLista.push(doc.data())
                  });
                }else {
                  this.$refs['my-modal-no-docs'].show()
                }
              })
              .catch(function(error) {
                this.error = error
                this.$refs['my-modal-err'].show()
                console.error("Error getting documents: ", error);
              });
        }
      }
    },
    enviaLista(mat){
      if (mat.length === 0){
        this.error = 'É necessário selecionar alguma notícia para insersão!'
        this.$refs['my-modal-err'].show()
      }else {
        //segue inserção no db
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
                //limpando a tela
                this.listaBool = false;
                this.seleTodas = false;
                this.palavrachave = '';
                this.campoPesquisa = ''
                this.$store.commit('resetNewsTemp')
              })
              .catch((error)=> {
                this.error = error
                this.$refs['my-modal-err'].show()
              });
        }
      }
    },
    pesquisaNews(){
      this.$store.commit('setProgress', true)
      //enviando this.user.data.uid para restringir acesso no banco
      if (this.palavrachave === null || this.palavrachave === '' || this.campoPesquisa ===''){
        this.error = 'É necessário inserir uma palavra para pesquisa e escolher onde a pesquisa será feita!'
        this.$refs['my-modal-err'].show()
      }else {
        //botões de seleção exclusão
        this.mostraSelTodas = false
        //botões de seleção inclusão de notícias
        this.seleTodas = true
        //botões para inclusão e exclusão
        this.listaBool = true
        this.excluListaBool = false
        //limpa lista de exclusão se estiver na tela
        this.excluLista = []
        //função que irá ger o get na API
        this.$store.dispatch('getNewsFunctions',
            {palavra: this.palavrachave,
                    onde: this.campoPesquisa,
                    idioma: this.idiomas,
                    np: this.numNews});
      }
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