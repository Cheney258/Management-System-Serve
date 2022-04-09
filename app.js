const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use("/api", require("./routers"));

app.listen(8090, () => {
    console.log("http://127.0.0.1:8090");
})

