<template>
  <b-container fluid="sm" class="mt-4">
    <b-row>
      <b-col class="col-sm-9 col-md-7 col-lg-5 offset-md-2 offset-lg-0">
        <b-form @submit="pesquisar" @reset="onReset" v-if="show">
          <b-form-group
              required
              id="pcLabel">
            <label>
              <b-icon icon="binoculars"></b-icon>
              Palavra Chave:</label>
            <b-form-input id="palavra" v-model="palavrachave" trim autocomplete="on"
                          placeholder="Pesquise aqui por palava-chave"></b-form-input>
          </b-form-group>
          <hr>
          <b-form-group class="mt-4">
            <label class="mr-4">
              <b-icon icon="signpost-split"></b-icon>
              Onde pesquisar nas notícias:</label>
            <b-form-radio-group
                buttons
                size="sm"
                :options="options"
                v-model="campoPesquisa">
            </b-form-radio-group>
          </b-form-group>
          <hr>
          <b-form-group class="mt-4">
            <label>
              <b-icon icon="option"></b-icon>
              Idioma das notícias:</label>
            <b-form-select
                :options="optIdiomas"
                v-model="idiomas">
            </b-form-select>
            <template #first>
              <b-form-select-option :value="null" disabled>-- Favor selecionar uma opção --</b-form-select-option>
            </template>
          </b-form-group>
          <hr>
          <b-form-group class="mt-4">
            <label>
              <b-icon icon="sort-numeric-down"></b-icon>
              Número de resultados da pesquisa:</label>
            <b-form-select
                :options="optNumNews"
                v-model="numNews">
            </b-form-select>
            <template #first>
              <b-form-select-option :value="null" disabled>-- Favor selecionar uma opção --</b-form-select-option>
            </template>
          </b-form-group>
          <hr>
          <b-button size="sm" type="submit">Pesquisar
            <b-icon icon="search"></b-icon>
          </b-button>
          <b-button size="sm" type="reset" class="ml-2">Limpar
            <b-icon icon="exclamation-triangle"></b-icon>
          </b-button>
        </b-form>
      </b-col>
      <!--      segunda coluna - exclusão-->
      <b-col class="col-sm-9 col-md-7 col-lg-5 offset-md-2 offset-lg-0">
        <b-form>
          <b-form-group label="Selecione as matérias para exclusão:">
            <b-form-radio-group
                id="radio-group-exclusao"
                v-model="selExclusao"
                :options="optExclusao"
                name="radio-options"></b-form-radio-group>
            <hr>
            <b-form-group class="text-right mt-5">
              <b-button size="sm" @click="listarExclusao($event)">Listar Matérias Cadastradas
                <b-icon icon="card-list"></b-icon>
              </b-button>
            </b-form-group>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <!--    tabela para mostrar o resultado da pesquisa sobre notícias-->
    <b-row class="mt-4" v-show="$store.getters.getNewsTemp.length > 0">
      <b-col>
        <b-row>
          <b-col>
            <h5>Resultados da pesquisa: <span>{{ $store.getters.getNewsTemp.length }}</span></h5>
          </b-col>
          <b-col class="text-right">
            <b-button class="mr-2" @click="actionTodas($event)">{{ btnText }} todas</b-button>
            <b-button @click="actionSeleciondadas($event)">{{ btnText }} selecionadas</b-button>
          </b-col>
        </b-row>
        <b-table responsive="sm"
                 select-mode="range"
                 ref="resultTable"
                 selectable @row-selected="onRowSelected"
                 bordered hover striped head-variant="dark"
                 :items="newsList" :fields="newsFields"
                 caption-top
                 caption-html="
                  Quando uma notícia é clicada, outra(s) é(são) desmarcada(s).
                  Shift + click seleciona um intervalo contínuo de sessões.
                  Ctrl + click alterna a seleção da sessão clicada.">
          <template #head()="data">
            {{ data.label.toUpperCase() }}
          </template>
          <template #cell(author)="data">
            {{ data.item.author || "Desconhecida" }}
          </template>
          <template #cell(url)="data">
            <b-link target="_blank" :href="data.item.url">Link</b-link>
          </template>
          <template #cell(urlToImage)="data">
            <b-img-lazy thumbnail fluid width="140px" :src="data.item.urlToImage || image404"
                        alt="imagem da notícia"></b-img-lazy>
          </template>
        </b-table>
        <b-row>
          <b-col>
          </b-col>
          <b-col class="text-right mb-5">

          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!--model erro-->
    <b-modal id="modalError" ref="modal-error" hide-footer>
      <template #modal-title>
        <b-icon icon="x-circle" scale="1.4" variant="danger"></b-icon>
        <span class="m-3">Erro na Solicitação</span>
      </template>
      <div class="d-block text-center">
        <h5> {{ error }}</h5>
      </div>
      <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalError')">Fechar</b-button>
    </b-modal>
    <!--      modal ok-->
    <b-modal id="modalok" ref="modal-ok" hide-footer>
      <template #modal-title>
        <b-icon icon="check2-circle" scale="1.4" variant="success"></b-icon>
        <span class="m-3">Inserção das Notícias</span>
      </template>
      <div class="d-block text-center">
        <h5>Notícia(s) inserida(s) com sucesso!</h5>
      </div>
      <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('modalok')">Fechar</b-button>
    </b-modal>
    <!-- modal exclusão-->
    <b-modal id="modalexc" ref="modal-exclusao" hide-footer>
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
    <b-modal id="modalsemnot" ref="modal-no-docs" hide-footer>
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
  </b-container>
</template>

<script>
import {mapGetters} from "vuex";
import image404 from '../assets/erro404.jpg'

export default {
  name: "RegistroNews",
  data() {
    return {
      image404,
      btnText: '',
      palavrachave: '',
      campoPesquisa: 'qInTitle',
      idiomas: null,
      numNews: null,
      newsSelecionadas: [],
      selExclusao: '',
      optExclusao: [
        {text: ' Selecionar apenas matérias inseridas hoje', value: 'hoje'},
        {text: ' Selecionar todas as matérias', value: 'todas'}
      ],
      options: [
        {text: 'Título', value: 'qInTitle'},
        {text: 'Conteúdo', value: 'q'}
      ],
      optIdiomas: [
        {value: null, text: "Selecione um Idioma"},
        {value: 'pt', text: "Português"},
        {value: 'de', text: "Deutsch"},
        {value: 'en', text: "English"},
        {value: 'es', text: "Español"},
        {value: 'fr', text: "français"},
        {value: 'it', text: "Italiano"},
        {value: 'nl', text: "Nederlands"},
        {value: 'no', text: "Norsk"},
      ],
      optNumNews: [
        {value: null, text: "Selecione a Quantidade de Notícias"},
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
      show: true,
      error: '',
      newsList: [],
      newsFields: [
        {key: 'author', label: 'Origem', sortable: true},
        {key: 'title', label: 'Título', sortable: true},
        {key: 'url', label: 'Matéria'},
        {key: 'urlToImage', label: 'Imagem'}
      ]
    }
  },
  methods: {
    listarExclusao(e) {
      this.onReset(e)
      this.btnText = 'Excluir'
      if (this.selExclusao === 'hoje') {
        this.$store.dispatch('getNewsDBExclusao')
            .then(() => {
              if (this.$store.getters.getNewsTemp.length === 0) {
                console.log('teste')
                this.$refs['modal-no-docs'].show()
              } else {
                this.newsList = this.$store.getters.getNewsTemp
              }
            })
      } else {
        this.$store.dispatch('getNewsDBExclusaoTodas')
            .then(() => {
              this.newsList = this.$store.getters.getNewsTemp
            })
      }
    },
    //botão de inserir ou excluir notícias - linhas selecionadas na tabela
    actionSeleciondadas(e) {
      if (this.btnText === 'Inserir') {
        this.$store.dispatch('inserirSelected', this.newsSelecionadas)
            .then(res => {
              if (res === "ok.") {
                this.$refs['modal-ok'].show()
              }
            })
            .catch(error => {
              this.error = error
              this.$refs['modal-error'].show()
            })
      } else if (this.btnText === 'Excluir') {
        this.$store.dispatch('excluirNewsSelected', this.newsSelecionadas)
            .then(res => {
              if (res === "ok.") {
                //refresh da tabela para mostrar que exluiu
                this.$store.dispatch('getNewsDBExclusao')
                    .then(() => {
                      this.listarExclusao(e)
                    })
                this.$refs['modal-exclusao'].show()
              }
            })
            .catch(error => {
              this.error = error
              this.$refs['modal-error'].show()
            })
      }
    },
    //botão de inserir ou excluir TODAS as notícias, independente da seleção na tabela
    actionTodas(e) {
      //a ação de excluir ou inserir será de acordo com com o texto do btn
      if (this.btnText === 'Inserir') {
        //inserir notícias que já estão no vuex (newsTemp)
        this.$store.dispatch('inserirNews2')
            .then(res => {
              if (res === "ok.") {
                this.$refs['modal-ok'].show()
              }
            })
            .catch(error => {
              this.error = error
              this.$refs['modal-error'].show()
            })
      } else if (this.btnText === "Excluir") {
        //excluir notícias que já estão no vuex (newsTemp)
        this.$store.dispatch('excluirNews')
            .then(res => {
              if (res === "ok.") {
                this.listarExclusao(e)
                this.$refs['modal-exclusao'].show()
              }
            })
            .catch(error => {
              this.error = error
              this.$refs['modal-error'].show()
            })
      }
    },
    onRowSelected(news) {
      this.newsSelecionadas = news
    },
    selectAllRows() {
      this.$refs.resultTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.resultTable.clearSelected()
    },
    pesquisar(event) {
      this.btnText = 'Inserir'
      event.preventDefault()
      if (this.palavrachave === null || this.palavrachave === '' || this.campoPesquisa === '') {
        this.error = 'É necessário inserir uma palavra para pesquisa e escolher onde a pesquisa será feita!'
        this.$refs['modal-error'].show()
      } else {
        this.$store.dispatch('getNewsFunctions',
            {
              palavra: this.palavrachave,
              onde: this.campoPesquisa,
              idioma: this.idiomas,
              np: this.numNews
            })
            .then(res => {
              console.log(res)
              if (res === 'login') {
                this.$router.replace({
                  name: "acessorestrito"
                })
              }
              this.newsList = this.$store.getters.getNewsTemp
            })
      }
    },
    onReset(event) {
      event.preventDefault()
      this.palavrachave = ''
      this.campoPesquisa = 'qInTitle'
      this.idiomas = null
      this.numNews = null
      //uso geral
      this.newsList = []
      this.$store.commit('resetNewsTemp')
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  created() {
    this.$store.commit('resetNewsTemp')
    if (this.user.data === null) {
      this.$router.replace({
        name: "acessorestrito"
      })
    }
  }
}
</script>

<style scoped>
label {
  color: #5a5a5a;
}

form {
  padding: 10px;
  border: 1px gray solid;
  border-radius: 4px;
}

</style>