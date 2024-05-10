const path = require('path');
const express = require('express')
const http = require('http')
const moment = require('moment');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const app = express();
const server = http.createServer(app);

const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public')));
const { Sequelize } = require('sequelize');
const e = require('express');


/**continueButt.addEventListener('click', () => {
    if (nameField.value == '') return;
    fetch('/api/tasks')
  .then(response => response.json())
  .then(data => {
    // Les données sont disponibles dans la variable 'data'
    // Vous pouvez les utiliser selon vos besoins
    data.forEach(participant => {
      console.log('ID:', participant.id);
      console.log('Email:', participant.email);
      if (nameField.value!= participant.email){
        return;
      }else{
        nameField.value=participant.email;
        username = nameField.value;
        overlayContainer.style.visibility = 'hidden';
        document.querySelector("#myname").innerHTML = `${username} (You)`;
        socket.emit("join room", roomid, username);
      }
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des participants:', error);
  });


}) */

//test de connection à la base de données

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('my_class', 'root', '', {
  host: 'localhost',
  dialect:   'mysql'/* | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
try {
   sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

//classe participant
const Participant = sequelize.define('Participant', {
  // Définition des colonnes...
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
}, {
  tableName: 'participant' // Nom de la table dans la base de données
},  {
  timestamps: false // Désactive les champs "createdAt" et "updatedAt"
});






/**SELECT email FROM `participant` WHERE participant.classe_id=classe.id
 * IN(SELECT classe_id FROM classe WHERE classe.id=course.classe_id
 *  IN (SELECT id FROM course WHERE url="jjjd")); */

//get all courses



// A GET all participants
app.get('/api/tasks', async (req, res) => {
  try {
    const participants = await Participant.findAll({
      attributes: ['email', 'id'],
    });

    participants.forEach(participant => {
      console.log('Email:', participant.email);
    });

    res.status(200).json(participants); // Send the data as JSON response
  } catch (error) {
    console.error('Error fetching participants:', error.message);
    res.status(500).json({ error: 'Internal server error' }); // Handle the error gracefully
  }
});



let rooms = {};
let socketroom = {};
let socketname = {};
let micSocket = {};
let videoSocket = {};
let roomBoard = {};

io.on('connect', socket => {

    socket.on("join room", (roomid, username) => {

        socket.join(roomid);
        socketroom[socket.id] = roomid;
        socketname[socket.id] = username;
        micSocket[socket.id] = 'on';
        videoSocket[socket.id] = 'on';

        if (rooms[roomid] && rooms[roomid].length > 0) {
            rooms[roomid].push(socket.id);
            socket.to(roomid).emit('message', `${username} joined the room.`, 'Bot', moment().format(
                "h:mm a"
            ));
            io.to(socket.id).emit('join room', rooms[roomid].filter(pid => pid != socket.id), socketname, micSocket, videoSocket);
        }
        else {
            rooms[roomid] = [socket.id];
            io.to(socket.id).emit('join room', null, null, null, null);
        }

        io.to(roomid).emit('user count', rooms[roomid].length);

    });

    socket.on('action', msg => {
        if (msg == 'mute')
            micSocket[socket.id] = 'off';
        else if (msg == 'unmute')
            micSocket[socket.id] = 'on';
        else if (msg == 'videoon')
            videoSocket[socket.id] = 'on';
        else if (msg == 'videooff')
            videoSocket[socket.id] = 'off';

        socket.to(socketroom[socket.id]).emit('action', msg, socket.id);
    })

    socket.on('video-offer', (offer, sid) => {
        socket.to(sid).emit('video-offer', offer, socket.id, socketname[socket.id], micSocket[socket.id], videoSocket[socket.id]);
    })

    socket.on('video-answer', (answer, sid) => {
        socket.to(sid).emit('video-answer', answer, socket.id);
    })

    socket.on('new icecandidate', (candidate, sid) => {
        socket.to(sid).emit('new icecandidate', candidate, socket.id);
    })

    socket.on('message', (msg, username, roomid) => {
        io.to(roomid).emit('message', msg, username, moment().format(
            "h:mm a"
        ));
    })

    socket.on('getCanvas', () => {
        if (roomBoard[socketroom[socket.id]])
            socket.emit('getCanvas', roomBoard[socketroom[socket.id]]);
    });

    socket.on('draw', (newx, newy, prevx, prevy, color, size) => {
        socket.to(socketroom[socket.id]).emit('draw', newx, newy, prevx, prevy, color, size);
    })

    socket.on('clearBoard', () => {
        socket.to(socketroom[socket.id]).emit('clearBoard');
    });

    socket.on('store canvas', url => {
        roomBoard[socketroom[socket.id]] = url;
    })

    socket.on('disconnect', () => {
        if (!socketroom[socket.id]) return;
        socket.to(socketroom[socket.id]).emit('message', `${socketname[socket.id]} left the chat.`, `Bot`, moment().format(
            "h:mm a"
        ));
        socket.to(socketroom[socket.id]).emit('remove peer', socket.id);
        var index = rooms[socketroom[socket.id]].indexOf(socket.id);
        rooms[socketroom[socket.id]].splice(index, 1);
        io.to(socketroom[socket.id]).emit('user count', rooms[socketroom[socket.id]].length);
        delete socketroom[socket.id];
        console.log('--------------------');
        console.log(rooms[socketroom[socket.id]]);

        //toDo: push socket.id out of rooms
    });
})
//

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
