// app.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const admin = require('firebase-admin');
const serviceAccount = require('');


const PORT = process.env.PORT || 3000
const TIME_TO_STAY_IN_SEC = process.env.TIME_TO_STAY_IN_SEC || 20
const TIME_TO_CHANGE_IN_SEC = process.env.TIME_TO_CHANGE_IN_SEC || 30
const DATABASE_URL = process.env.DATABASE_URL

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL, // Replace with your Firebase project URL
});

const db = admin.firestore();

async function getRandomQuote() {
  try {
    const querySnapshot = await db.collection('Quotes').get();

    const quotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    return randomQuote;
  } catch (error) {
    console.error("Error getting random quote: ", error);
    throw error;
  }
}

app.set('view engine', 'ejs');

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    },
}));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    const interval = setInterval(async () => {
        const randomQuote = await getRandomQuote();
        let data = {
          randomQuote: randomQuote.text,
          quoteImage: randomQuote.image,
          timeToWait: TIME_TO_STAY_IN_SEC
        }
        socket.emit('message', data);
    }, TIME_TO_CHANGE_IN_SEC * 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});