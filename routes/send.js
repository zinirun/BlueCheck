var firebase = require("firebase/app");
var admin = require("firebase-admin");

var serviceAccount = require("../fir-storage-sdk.json");
const firebaseConfig = {
  apiKey: "AIzaSyAdi8giIoP1bZ7pVxwUpELCswJfdXACc-w",
  authDomain: "bluecheck-37ecc.firebaseapp.com",
  databaseURL: "https://bluecheck-37ecc.firebaseio.com",
  projectId: "bluecheck-37ecc",
  storageBucket: "bluecheck-37ecc.appspot.com",
  messagingSenderId: "1068061515989",
  appId: "1:1068061515989:web:568363552787193de3825c",
  measurementId: "G-Z6HDR9ZSC9"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.requestPermission()
.then(function(){
    console.log('have permission');
})
.catch(function(err){
    console.log('err');
});

//var send = function(req,res){
//    if('serviceWorker' in navigator){
//        navigator.serviceWorker
//            .register('sw.js')
//            .then((reg)=>{
//                console.log('Hello!',reg);
//            
//        })
//    }
//}

module.exports = admin;