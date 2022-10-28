const http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
const ytMusic = require('node-youtube-music');
const { parse } = require('querystring');


// Termos proibidos de busca
const termos_proibidos = [
    "gemidão do zap"
];

var con = mysql.createConnection({
    host: "mysql.remoto.camargohost.com.br", //Host do mysql
    user: "", //Usuário do mysql
    password: "", //Senha do mysql
    database: "youtube_musicas" //Banco de daods do mysql
});

con.connect(function(err) {
    if (err) throw err;
    console.log("[DataBase] Banco de dados conectado com sucesso!");
});

const requestListener = async function (request, response){ 
    if(request.url == "/ajax/get-musicas"){
        con.query("SELECT * FROM cmr_musicas", function (err, result, fields) {
          if (err) throw err;
          response.writeHead(200, { 'Content-Type': "application/json" });
          response.end(JSON.stringify(result), 'utf-8');
        });
    }else if(request.url == "/ajax/add-musicas" && request.method == "POST"){
        var body = []
        request.on('data', function(data) {
            body.push(data);
        });
        request.on('end', async function() {
            body = parse(Buffer.concat(body).toString());
            const get_dados = await ytMusic.getSuggestions(body.yt);
            if(get_dados[0]){
                await con.query("SELECT * FROM cmr_musicas WHERE url_music = '"+body.yt+"'", async function (err, result, fields) {
                    if (err) throw err;
                    if(result[0]){
                        response.writeHead(200, { 'Content-Type': "application/json" });
                        response.end(JSON.stringify({error: "yes", msg: "Essa musica já foi adicionada!"}), 'utf-8');
                    }else{
                        if(get_dados[0]){
                            var sql = "INSERT INTO `cmr_musicas`(`id`, `nome`, `capa`, `url_music`) VALUES (NULL,'"+get_dados[0].album+" - "+get_dados[0].title+"','"+get_dados[0].thumbnailUrl+"','"+get_dados[0].youtubeId+"')";
                            await con.query(sql, function (err, result) {
                                if (err) throw err;
                            });
                            response.writeHead(200, { 'Content-Type': "application/json" });
                            response.end(JSON.stringify({error: "no", msg: "Musica adicionada com sucesso!"}), 'utf-8');
                        }
                    }
            });    
            }else{
                response.writeHead(200, { 'Content-Type': "application/json" });
                response.end(JSON.stringify({error: "yes", msg: "Não conseguimos adicionar essa musica!"}), 'utf-8');
            }
        });
    }else if(request.url == "/ajax/get-musicas-api" && request.method == 'POST'){
        var body = []
        request.on('data', function(data) {
            body.push(data);
        });
        request.on('end', async function() {
            body = parse(Buffer.concat(body).toString());
            var block = 0;
            if(body.search){
                termos_proibidos.forEach(proibidos => {
                    if(proibidos.indexOf(body.search) !== -1){
                        block = 1;
                        response.writeHead(200, { 'Content-Type': "application/json" });
                        response.end(JSON.stringify({error: "yes", msg: "Esse termo de busca está probido!"}), 'utf-8');
                        return;
                    }
                });

                if(block == 0){
                    const musics = await ytMusic.searchMusics(body.search);
                    if(musics.length <= 0){
                        response.writeHead(200, { 'Content-Type': "application/json" });
                        response.end(JSON.stringify({error: "yes", msg: "Não conseguimos encontrar nada!"}), 'utf-8');
                    }else{
                        response.writeHead(200, { 'Content-Type': "application/json" });
                        response.end(JSON.stringify(musics), 'utf-8');
                    }
                }
            }else{
                response.writeHead(200, { 'Content-Type': "application/json" });
                response.end(JSON.stringify({error: "yes", msg: "Coloque o termo da pesquisa!"}), 'utf-8');
            }
        });
    }else if(request.url == "/ajax/get-atual-musica" && request.method == 'POST'){
        var body = []
        request.on('data', function(data) {
            body.push(data);
        });
        request.on('end', async function() {
            body = parse(Buffer.concat(body).toString());
            if(body.atual){
                if(body.atual == '0'){
                    await con.query("SELECT * FROM cmr_musicas LIMIT 1", async function (err, result, fields) {
                            if (err) throw err;
                            if(result[0]){
                                response.writeHead(200, { 'Content-Type': "application/json" });
                                response.end(JSON.stringify({atual_id: result[0].url_music}), 'utf-8');
                            }else{
                                const suggestions = await ytMusic.getSuggestions("S-12Urnf90c");
                                if(suggestions[1]){
                                    var sql = "INSERT INTO `cmr_musicas`(`id`, `nome`, `capa`, `url_music`) VALUES (NULL,'"+suggestions[1].album+" - "+suggestions[1].title+"','"+suggestions[1].thumbnailUrl+"','"+suggestions[1].youtubeId+"')";
                                    await con.query(sql, function (err, result) {
                                        if (err) throw err;
                                    });
                                    response.writeHead(200, { 'Content-Type': "application/json" });
                                    response.end(JSON.stringify({atual_id: suggestions[1].youtubeId}), 'utf-8');
                                }
                            }
                    });                    
                }else{
                    await con.query("DELETE FROM cmr_musicas WHERE url_music = '"+body.atual+"'", async function (err, result) {if (err) throw err;});
                    
                    await con.query("SELECT * FROM cmr_musicas LIMIT 1", async function (err, result, fields) {
                        if (err) throw err;
                        if(result[0]){
                            response.writeHead(200, { 'Content-Type': "application/json" });
                            response.end(JSON.stringify({atual_id: result[0].url_music}), 'utf-8');
                        }else{
                            const suggestions = await ytMusic.getSuggestions(body.atual);
                            if(suggestions[1]){
                                var sql = "INSERT INTO `cmr_musicas`(`id`, `nome`, `capa`, `url_music`) VALUES (NULL,'"+suggestions[1].album+" - "+suggestions[1].title+"','"+suggestions[1].thumbnailUrl+"','"+suggestions[1].youtubeId+"')";
                                await con.query(sql, function (err, result) {
                                    if (err) throw err;
                                });
                                response.writeHead(200, { 'Content-Type': "application/json" });
                                response.end(JSON.stringify({atual_id: suggestions[1].youtubeId}), 'utf-8');
                            }
                        }
                    });
                }

            }else{
                response.writeHead(200, { 'Content-Type': "application/json" });
                response.end(JSON.stringify({error: "yes", msg: "Tente novamente mais tarde!"}), 'utf-8');
            }
        });
    }else{
        var filePath = './public' + request.url;
        if (filePath == './public/player/')
            filePath = './public/player/index.html';
        
        if (filePath == './public/')
            filePath = './public/index.html';

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;      
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Desculpe, verifique com o administrador do site o erro: '+error.code+' ..\n');
                    response.end(); 
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
}

const server = http.createServer(requestListener);
console.log("[HTTP] Servidor HTTP iniciado sucesso!");
server.listen(555);