import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        msg: "hi",
        app: "natours",
    });
});

app.post("/", (req, res) => {
    res.send("post test");
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
