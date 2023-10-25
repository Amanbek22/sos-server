const express = require("express");
const findNearestUser = require("./utils");
const firebaseApp = require("./config");
const {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} = require("firebase/firestore");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3333;
const db = getFirestore(firebaseApp);

app.get("/", function (req, res) {
  res.send("Hello Sos.kg!!!");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

server.listen(port, function () {
  console.log("Example app listening on port 3333!");
});

const getPolice = async () => {
  try {
    const arr = [];
    const ref = collection(db, "police");
    const q = query(ref, where("isOnline", "==", true));
    const res = await getDocs(q);
    res.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return arr;
  } catch (error) {
    throw Error("There is issue with Police data", error);
  }
};

app.get("/find-police", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat && !lng) {
    res
      .status(404)
      .send(
        "Sorry, we cannot find police without lng and lat! Please provide them."
      );
  }
  const myLocation = {
    lat: Number(lat),
    lng: Number(lng),
  };
  try {
    const users = await getPolice();
    const nearestUser = await findNearestUser(myLocation, users, 5);
    res.send(JSON.stringify(nearestUser));
  } catch (error) {
    res.send("Something went wrong. Please try again");
  }
});
