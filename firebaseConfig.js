const firebaseConfig = {
    apiKey: "AIzaSyAz1blrYMAQMkpf2PdJcvQhGKv21XYckAE",
    authDomain: "test-offline-viewing.firebaseapp.com",
    projectId: "test-offline-viewing",
    storageBucket: "test-offline-viewing.appspot.com",
    messagingSenderId: "943885592597",
    appId: "1:943885592597:web:2f25d0bda43384dce6461c"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();