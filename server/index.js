require('dotenv').config();

const express = require('express');
const multer  = require('multer');
const mysql   = require('mysql2');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('Z:/'));

// Configurando o DB
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DTBS,
    port: process.env.DB_PORT
})

// Conectando o DB
db.connect(err => {
    if(err){
        throw err;
    } 
    console.log('DB conectado')
})

// Configuração do MULTER para UPLOADS
const storage = multer.diskStorage({
    destination: 'Z:/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

// Rota para upload de arquivo
app.post('/upload', upload.single('file'), (req, res) => {
    const { filename, path } = req.file;
    db.query('INSERT INTO files (name_file, path_file) VALUES (?, ?)', [filename, path], (err) => {
        if (err) throw err;
        res.json({ message: 'Arquivo salvo!', file: req.file });
    });
});

// Rota para listar arquivos
app.get('/files', (req, res) => {
    db.query('SELECT * FROM files', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para baixar um arquivo
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('Z:/', filename);
    
    res.download(filePath, filename, (err) => {
        if (err) {
            res.status(500).json({ error: "Erro ao baixar o arquivo" });
        }
    });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servido rodando na porta ${PORT}`))