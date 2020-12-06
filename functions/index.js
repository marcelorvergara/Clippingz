const functions = require('firebase-functions');
const admin = require("firebase-admin");

//buscar notícias na API e guardar no banco
exports.getNews = functions.https.onRequest(async(request,res) => {
    const {PubSub} = require(`@google-cloud/pubsub`);
    const pubsub = new PubSub();
    const req = require('request');

    res.set('Access-Control-Allow-Origin', '*');

    const data0 = hoje();
    const data1 = ontem();
    //pegando os parâmtros passados no get URL
    const kw = request.query.pc;
    const od = request.query.od;
    const id = request.query.id;
    const mp = request.query.np;
    const mpNum = parseInt(mp);
    // passando o uid para restringir no banco
    const user = request.query.user

    var linkApi = (`http://newsapi.org/v2/everything?`+`${od}`+`="`+`${kw}`+`"&language=`+`${id}`+`&from=`+`${data1}`+`&to=`+`${data0}`+`&pageSize=`+ `${mpNum}` +`&apiKey=`);
    if (request.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        const messageId = await reqFunc()
        res.send( `id da mensagem: ` + messageId)
    }

    async function reqFunc (){
        return new Promise(await function (resolve,reject){
            req.get(linkApi, (err,res,body) => {
                if (err){
                    console.log("Erro na requisição a API: ", err)
                    reject(err)
                }
                if (res.statusCode === 200) {
                    let res = callPubSub(body);
                    return res.then(resul => {
                        console.log('resul: ', resul)
                        resolve(resul)
                    })

                }
            })
        })
    }
    async function callPubSub (body){
        console.log('ok 200')
        const buffer = Buffer.from(JSON.stringify({
            user: user, mpNum: mpNum, body: body
        }));
        return await pubsub.topic('database')
            .publish(buffer)
            .then(messageId => {
                console.log(`Mensagem ${messageId} enviada`);
                return messageId
            })
            .catch(err => {
                console.error('ERROR:', err);
            })
    }
})

exports.dbNewsTemp = functions.pubsub.topic('database').onPublish(async (message) => {
    const serviceAccount = require('./clippingz.json')
    if (!admin.apps.length){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://clippingz.firebaseio.com"
        });
    }
    const { v4: uuidv4 } = require('uuid');
    console.log('ínicio pubsub')
    var user = null;
    var mpNum = null;
    var body = null;
    try {
        user = message.json.user;
        mpNum = message.json.mpNum;
        body = message.json.body
    } catch (e) {
        console.error('PubSub: ', e);
    }

    var totRestults;
    //listar o que temos de news no rep temporário de notícias
    let db = admin.firestore();
    return await db.collection(user)
        .get()
        .then((querySnapshot)  => {
            //deletar o que temos no banco relativo ao user
            //para limpar (TempDB). Esse banco mostra os resultados
            //de pesquisa
            querySnapshot.forEach((doc) => {
                let docId = doc.data().id
                limpaDB(docId)
            })

        })
        .catch(function(error) {
            console.warn("Error getting documents: ", error);
        })
        .then( () => {
            //gravar no banco os resultados da pesquisa de notícias
            inserirNews()
        })
    async function inserirNews(){
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
                await  inserirMat(jsonData.articles[i],user,uuid)
                console.log('Matéria inserida')
            }
        }
    }
    async function limpaDB(docId){
            await db.collection(user).doc(docId).delete()
                .then(() => {
                    console.log("Deletando tempDB!");
                })
                .catch(function(error) {
                    console.error("Error removing document: ", error);
                })
    }
    async function inserirMat(mat,user,uuid){
        let db = admin.firestore();
        return await db.collection(user).doc(uuid).set(mat);
    }
})

// funções auxiliares
function ontem(){
    //um dia atrás
    var old = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return old.toISOString().slice(0,10);
}
function hoje(){
    var datetime = new Date();
    return datetime.toISOString().slice(0,10);
}
