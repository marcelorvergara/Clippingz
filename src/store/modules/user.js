import axios from "axios";
import { apiUrl } from '@/store/url';

const state = {
    user: {
        loggedIn: false,
        data: null,
    }
}

const getters = {
    user(state){
        return state.user
    },
    SET_LOGGED_IN(state, value) {
        state.user.loggedIn = value;
    },
    SET_USER(state, data) {
        state.user.data = data;
    }
}

const mutations = {
    SET_LOGGED_IN(state, value) {
        state.user.loggedIn = value;
    },
    SET_USER(state, data) {
        state.user.data = data;
    }
}

const actions ={
    logout(context){
        return new Promise((resolve, reject) => {
            const getUrl = apiUrl + "/logout"
            axios.get (getUrl)
                .then(res => {
                    if (res.data === "logout_com_sucesso"){
                        context.commit('SET_LOGGED_IN', false)
                        context.commit("SET_USER", null)
                        resolve('ok')
                    }else {
                        reject('resposta do logout', res.data)
                    }
                })
        })
    },
    logarUser(context,infos){
        return new Promise ((resolve, reject) => {
            let formData = new FormData()
            formData.set("username", infos.username)
            formData.set("password", infos.password)
            const getUrl = apiUrl + "/login"
            axios.post (getUrl,formData, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}, withCredentials: true})
                .then(function(resp){
                    if (resp.data === 'welcome'){
                        context.commit('SET_LOGGED_IN', true)
                        context.commit("SET_USER", {
                            displayName: infos.username,
                            email: infos.username,
                        });
                        resolve('ok.')
                    }else{
                        resolve('erro na autenticacao')
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    criarLogin(context, infos){
        return new Promise ((resolve, reject) => {
            const getUrl = apiUrl + "/registro"
            const options = {
                method: 'POST',
                url: getUrl,
                headers: {'Content-Type': 'application/json'},
                data: {
                    username: infos.username,
                    password: infos.password,
                    passwordConfirm: infos.passwordConfirm
                }
            };
            axios.request (options).then(function(resp){
                resolve(resp)
            }).catch(err => {
                reject(err)
            })
        })
    },
    fetchUser({ commit }, user) {
        //se usuário logado
        commit("SET_LOGGED_IN", user !== null);
        if (user) {
            commit("SET_USER", {
                displayName: user.displayName,
                email: user.email,
                uid: user.uid
            });
        } else {
            commit("SET_USER", null);
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}