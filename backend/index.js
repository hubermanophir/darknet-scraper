const mongoose = require("mongoose");
const app = require("./app");
const server = require("http").createServer(app);
global.io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("keywords", (data) => {
    console.log(data);
  });
});
// io.on("keywords", (data) => {
//   console.log(data);
// });

const PORT = 8080;
const url = "mongodb://mongo:27017/scraperdb";

server.listen(PORT, () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Successfully connected to mongodb");
    })
    .catch(() => {
      console.log("Error connecting to db");
    });

  console.log(`listening on port ${PORT}`);
});

module.exports = { io };
