const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require('./key.json')
const req = require('request');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://clippingz.firebaseio.com"
});

//buscar notícias na API e guardar no banco
exports.getNews = functions.https.onRequest((request,res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (request.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
       res.send('App ok!');
    }
    var totRestults;
    const data0 = hoje();
    const data1 = ontem();
    //pegando os parâmtros passados no get URL
    const kw = request.query.pc;
    const od = request.query.od;
    const id = request.query.id;
    const mp = request.query.np;
    const mpNum = parseInt(mp);
    const user = request.query.user
    var newsTemp = [];
    var linkApi = (`http://newsapi.org/v2/everything?`+`${od}`+`="`+`${kw}`+`"&language=`+`${id}`+`&from=`+`${data1}`+`&to=`+`${data0}`+`&pageSize=`+ `${mpNum}` +`&apiKey=6dfcde728d4041529026d9ccd3dff352`);
    console.log("link", linkApi)
    req.get(linkApi, (err,res,body) => {
        if (err){
            console.log("Erro na requisição a API: ", err)
        }
        if (res.statusCode === 200) {
            //listar o que temos de news no rep temporário de notícias
            let db = admin.firestore();
            db.collection(user)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        newsTemp.push(doc.data())
                    })
                    //deletar o que temos no banco relativo ao user
                    //para limpar (TempDB). Esse banco mostra os resultados
                    //de pesquisa
                    for (let i=0; i < newsTemp.length; i++){
                        db.collection(user).doc(newsTemp[i].id).delete()
                            .then(() => {
                            console.log("Deletando tempDB!");
                        })
                            .catch(function(error) {
                                console.error("Error removing document: ", error);
                            })
                    }
                })
                .catch(function(error) {
                    console.warn("Error getting documents: ", error);
                })
                .then(function (){
                        //gravar no banco os resultados da pesquisa de notícias
                        const jsonData = JSON.parse(body)
                        totRestults = jsonData.totalResults;
                        if (totRestults === 0) {
                            console.log("Nenhum resuldado encontrado")
                        } else {
                            if (totRestults >= mpNum) {
                                totRestults = mpNum;
                            }
                            for (let i=0; i< totRestults; i++){
                                const uuid = uuidv4();
                                jsonData.articles[i].id = uuid
                                inserirMat(jsonData.articles[i],user,uuid)
                            }
                        }
                    })

        }
    })
})

//funções auxiliares
async function inserirMat(mat,user,uuid){
    let db = admin.firestore();
    return await db.collection(user).doc(uuid).set(mat);
}
function ontem(){
    //um dia atrás
    var old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return old.toISOString().slice(0,10);
}
function hoje(){
    var datetime = new Date();
    return datetime.toISOString().slice(0,10);
}
