window.onload = () => {
    const fileElement = document.querySelector('#file-upload');
    //const fileForm = document.querySelector('#file-selection-form');
    const algBtn1 = document.querySelector('#algorithm-btn1');
    const algBtn2 = document.querySelector('#algorithm-btn2');
    const algBtn3 = document.querySelector('#algorithm-btn3');
    const algBtn4 = document.querySelector('#algorithm-btn4');
    const modelSaveBtn = document.querySelector('#save-model-btn');
    const mfContainer = document.querySelector('.model-form-container');
    const btnCloseForm = document.querySelector('#close-form-btn');

    const cols = [];

    // Presenta el nombre del archivo al lado y muestra tabla
    const readNameFile = () => {
        
        while(cols.length > 0){
            cols.pop();
        }

        let csvFile = fileElement.files[0];

        document.querySelector("#filename-text").innerHTML = `<i class="fa-solid fa-file-csv"></i> ${csvFile.name}`;
        document.querySelector("#filename-text").style.padding = "0 10px";
        
        loadPD(csvFile);
        

        /*
        const formData = new FormData();
        formData.append('file-upload', csvFile)
        console.log("Cargando...")
        fetch('/prueba', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Se subio el archivo \"${data['filename']}\"`);
            showData(csvFile);
        });
        */
    }

    const showForm = (elem) => {
        let algKey = elem.value;
        document.querySelector('#algorithm-title').innerText = elem.innerText;
        let html = `<div class="alg-form-section">
                    <label>Seleccione columnas:</label>
                    <div class="cols-input-container">`;
        
        console.log(cols);
        for(let col of cols){
            html += `<label><input type="checkbox" name="data-cols" id="${col}"> ${col}</label>`;
        }

        html += `</div></div>
                <div class="alg-form-section">
                <label for="clase-cols-select">Seleccione la columna Clase:  </label>
                <select id="clase-cols-select">`;
        
        for(let col of cols){
            html += `<option name="data-clase-cols" value="${col}" id="${col}">${col}</option>`;
        }
        
        html += `</select></div>`;
        document.querySelector('#body-alg-form').innerHTML = html;

        switch(algKey){
            case 'knn': {
                renderKNNForm();
                break;
            }
            
            case 'kmeans': {
                renderKMeansForm();
                break;
            }

            default: {
                console.log("Accion no encontrada")
            }
        }
    }

    const renderKNNForm = () => {
        document.querySelector('#body-alg-form').innerHTML += `<div class="alg-form-section">
        <label for="k-neighbors-input">Numero de vecinos: </label>
        <input type="number" id="k-neighbors-input" name="k-neighbors-input" value="1" min="1" style="width: 75px; padding: 0 5px">
      </div>
      <div class="alg-form-section">
        <p>Ubicación del centro:</p>
        <label class="ubicacion-ejes-label">Eje X:  <input type="number" id="k-centerx-input" name="k-centerx-input" value="0" min="0" style="width: 75px; padding: 0 5px"></label>
        <label class="ubicacion-ejes-label">Eje Y:  <input type="number" id="k-centery-input" name="k-centery-input" value="0" min="0" style="width: 75px; padding: 0 5px"></label>
      </div>`;
    }

    const renderKMeansForm = () => {
        document.querySelector('#body-alg-form').innerHTML += `<div class="alg-form-section">
        <label for="k-clusters-input">Numero de clusters: </label>
        <input type="number" id="k-clusters-input" name="k-clusters-input" value="1" min="1" style="width: 75px; padding: 0 5px">
      </div>`;
    }

    const openForm = (event) => {
        mfContainer.style.display = "flex";
        setTimeout(()=>{
            showForm(event.srcElement);
            mfContainer.classList.add('mf-container-open');
        }, 100);
    }

    // Muestra el contenido del archivo formateado en tabla
    const  previewData = (csvFile) => {
        return new Promise((resolve) => {
            if (csvFile) {
                const reader = new FileReader();
        
                reader.onload = function(event) {
                    const csv = event.target.result;
                    const data = Papa.parse(csv, { header: true }); // Utilizamos la biblioteca PapaParse para parsear el CSV
        
                    const table = document.getElementById("tabla");
                    table.innerHTML = "";
        
                    if (data.data.length > 0) {
                        const headers = data.meta.fields;
                        headers.map((x) => cols.push(x));
                        const headerRow = table.insertRow(0);
        
                        headers.forEach(function(header) {
                            const th = document.createElement("th");
                            th.textContent = header;
                            headerRow.appendChild(th);
                        });
        
                        data.data.forEach(function(row, index) {
                            const newRow = table.insertRow(index + 1);
        
                            headers.forEach(function(header) {
                                const cell = newRow.insertCell(-1);
                                cell.textContent = row[header];
                            });
                        });
                    }
                };
                reader.onloadend = e => resolve();
                reader.readAsText(csvFile);
            }
            
        })
    }

    async function loadPD(csvFile){
        let loadingTable = document.querySelector('#loading-table');
        loadingTable.classList.add('lt-open');
        const result = await previewData(csvFile);
        loadingTable.classList.remove('lt-open');
    }

    
    fileElement.addEventListener('change', readNameFile);
    algBtn1.addEventListener('click', openForm);
    algBtn2.addEventListener('click', openForm);
    algBtn3.addEventListener('click', openForm);
    algBtn4.addEventListener('click', openForm);

    btnCloseForm.addEventListener('click', () => {
        mfContainer.style.display = 'none';
        mfContainer.classList.remove('mf-container-open');
        document.querySelector('#body-alg-form').innerHTML = "";
    });
}   