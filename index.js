const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://vanshgoryanmec23_db_user:Vansh123@cluster0.yxse5im.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Database Connected");
    app.listen(5000, () => {
      console.log("Server is running on PORT 5000");
    });
}).catch((error)=>{
    console.log("Error in connection with mongoDB due to : " , error);
})

app.use(require("./Routes/getProduct"));
app.use(require("./Routes/uploadProduct"));