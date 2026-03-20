import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", (req, res) => {
    
});

app.listen(process.env.PORT || 3000);