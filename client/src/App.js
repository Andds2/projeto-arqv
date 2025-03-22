import './App.css';

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/files")
            .then(res => setFiles(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        window.location.reload();
    };

    return (
        <div className='App'>
            <h1>Upload de Arquivos</h1>
            <form onSubmit={handleUpload}>
                <label for='file-upload' id='label-fileup'>Selecione um arquivo</label>
                <input type="file" onChange={e => {
                        setFile(e.target.files[0]);
                        document.getElementById('label-fileup').textContent = e.target.files[0].name;
                    }} id='file-upload'/>
                <button type="submit">Enviar</button>
            </form>
            <h2>Arquivos Enviados</h2>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <p>
                            {file.name_file}  
                        </p>
                        <a href={`http://localhost:5000/uploads/${file.name_file}`} target="_blank" rel="noopener noreferrer">
                            Visualizar
                            {console.log(file.name_file)}
                        </a>  
                        <a href={`http://localhost:5000/download/${file.name_file}`} download>
                            <button>Download</button>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
