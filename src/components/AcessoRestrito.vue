<template>
  <b-container class="container-fluid mt-2">
    <b-row class="mt-2" cols-sm="3">
      <b-col></b-col>
      <b-col style="min-width: 300px">
        <b-card no-body
                header="Página de Login do Acesso Restrito"
                align="left"
                bg-variant="">
          <div class="card-body">
            <b-alert v-if="sucesso" show="5" variant="success" dismissible>{{sucesso}}</b-alert >
            <b-alert v-if="error" show="10" variant="danger" dismissible>{{error}}</b-alert >
            <form action="#" @submit.prevent="enviar">
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-8">
                  <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      value
                      required
                      autofocus
                      v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="senha" class="col-md-4 col-form-label text-md-right">Senha</label>

                <div class="col-md-8">
                  <input
                      id="senha"
                      type="password"
                      class="form-control"
                      name="senha"
                      v-model="form.senha"
                  />
                </div>
              </div>
              <b-form-group class="mb-0 text-right">
                <button @click="$router.go(-1)" class="btn btn-outline-dark">Voltar</button>
                <button @click="restSenha" class="ml-2 btn btn-outline-dark">
                  Reset Senha
                  <b-spinner v-show="loadingRS" small label="Carregando..."></b-spinner>
                </button>
                <button type="submit" class="ml-2 btn btn-outline-dark">
                  Login
                  <b-spinner v-show="loading" small label="Carregando..."></b-spinner>
                </button>
              </b-form-group>
            </form>
          </div>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      loadingRS:false,
      loading: false,
      form: {
        email: "",
        senha: ""
      },
      error: null,
      sucesso:null
    };
  },
  methods: {
    restSenha(){
      this.error = ''
      this.sucesso = ''
      this.loadingRS = true;
      var auth = firebase.auth();

      auth.sendPasswordResetEmail(this.form.email).then(() => {
        this.sucesso = `E-mail enviado para ${this.form.email} para procedimento de reset de senha!`
        this.loadingRS = false;
      }).catch((error) => {
        this.error = error
        this.loadingRS = false;
      });
    },
    enviar() {
      this.error = ''
      this.loading = true
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.senha)
          .then(() => {
            this.loading = false;
            this.$router.replace({ name: "confignews" });
          })
          .catch((error) => {
            this.error = error
            this.loading = false;
          });
    }
  }
};
</script>

<style scoped>

</style>