const express = require("express");
const youtubedl = require("youtube-dl");

const app = express();
const port = 5000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.get("/", async (req, res) => {

    if (!req.query.url || req.query.url.length===0) {
        res.status(400).send({
            ok: false,
            error: "No URL"
        });
        return;
    }

    const download = new Promise(function (resolve, reject) {
        console.log(__dirname);
        console.log(process.cwd());

        youtubedl.exec(req.query.url, ["--format=bestvideo[height<=1080]+bestaudio/best[height<=1080]","--output=~/Desktop/%(title)s.%(ext)s"], { cwd: __dirname },
            (err, output) => {
                if (err) reject(err);
                resolve(output);
            })
    });

    try {
        console.log(__dirname);

        const output = await download;
        // var fileLocation = path.join('./uploads',file);
        // res.download(fileLocation, file);

        res.status(200).send({
            ok: true,
            result: output
        });


    } catch (error) {


        res.status(500).send({
            ok: false,
            error: err.message
        });

    }

});

app.listen(port);
