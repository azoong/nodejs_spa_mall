const express = require("express");
const connect = require("./schemas/index") //.schemas로 가능 /index는 생략가능
const app = express();
const port = 3000;


connect();

const goodsRouter = require("./routes/goods") //goods 라우터파일을 불러오는거 .은 현재 디렉토리
const requestMiddleware = (req, res, next) =>{
    console.log("Request URL:", req.originalUrl, " - ", new Date())
    next();
}


app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware)

app.use("/api", [goodsRouter])

app.get("/", (req, res) => {
    res.send("Hello World@@@@@@@@");
})


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});

