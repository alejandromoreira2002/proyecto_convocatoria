window.onload = () => {
    if(sessionStorage.getItem('data')){
        let data = JSON.parse(sessionStorage.getItem('data'));
        let filename = sessionStorage.getItem('filename');
        previewData(filename, data, '#tabla');
    }

    const fileElement = document.querySelector('#file-upload');
    const algBtn1 = document.querySelector('#algorithm-btn1');
    const algBtn2 = document.querySelector('#algorithm-btn2');
    const algBtn3 = document.querySelector('#algorithm-btn3');
    const algBtn4 = document.querySelector('#algorithm-btn4');
    const modelSaveBtn = document.querySelector('#save-model-btn');
    const mfContainer = document.querySelector('.model-form-container');
    const btnCloseForm = document.querySelector('#close-form-btn');

    // Presenta el nombre del archivo al lado y muestra tabla
    const readFile = () => {
        const csvFile = fileElement.files[0];
        const filename = csvFile.name;
        
        const loadingTable = document.querySelector('#loading-table');
        
        document.querySelector('#tabla').innerHTML = "";
        loadingTable.classList.add('lt-open');
        
        const formData = new FormData();
        formData.append('dataFile', csvFile);
        formData.append('dataName', filename);
        fetch('/file/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loadingTable.classList.remove('lt-open');
            previewData(filename, data, "#tabla");

            sessionStorage.setItem('data', JSON.stringify(data));
            sessionStorage.setItem('filename', filename);
        });
        
    }

    const openForm = (event) => {
        mfContainer.style.display = "flex";
        setTimeout(()=>{
            showForm(event.srcElement);
            mfContainer.classList.add('mf-container-open');
        }, 100);
    }

    const closeForm = (event) => {
        mfContainer.style.display = 'none';
        document.querySelector('#data-model-preview').style.display = "none";
        mfContainer.classList.remove('mf-container-open');
        document.querySelector('#body-alg-form').innerHTML = "";
    }
    
    fileElement.addEventListener('change', readFile);
    algBtn1.addEventListener('click', openForm);
    algBtn2.addEventListener('click', openForm);
    algBtn3.addEventListener('click', openForm);
    algBtn4.addEventListener('click', openForm);
    btnCloseForm.addEventListener('click', closeForm);

    document.querySelector('#form-btn-preview').addEventListener('click', (e) => {
        document.querySelector('#data-model-preview').style.display = "block";
        document.querySelector('#data-model-preview').style.height = `${document.querySelector('#params-form').clientHeight}px`;

        let data = sessionStorage.getItem('data');
        let filename = sessionStorage.getItem('filename');
        let algType = document.querySelector('#data-model-key').value;
        let colClase = document.querySelector('#clase-cols-select').value;
        let vcols = [];
        
        document.querySelectorAll('.data-cols:checked').forEach((elem) => vcols.push(elem.value));
        
        const loadingTable = document.querySelector('#loading-prev-mtable');
        
        document.querySelector('#prev-tabla').innerHTML = "";
        loadingTable.classList.add('lt-open');

        const formData = new FormData();
        formData.append('data', data);
        formData.append('filename', filename);
        formData.append('colClase', colClase);
        formData.append('columnas', vcols);

        fetch(`/${algType}/preview`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loadingTable.classList.remove('lt-open');
            previewData(null, data, "#prev-tabla");
        });
    });
    
    document.querySelector('#form-btn-process').addEventListener('click', (e) => {
        let data = sessionStorage.getItem('data');
        let filename = sessionStorage.getItem('filename');
        let algType = document.querySelector('#data-model-key').value;
        let colClase = document.querySelector('#clase-cols-select').value;
        let vcols = [];
        
        document.querySelectorAll('.data-cols:checked').forEach((elem) => vcols.push(elem.value));

        const formData = new FormData();
        formData.append('data', data);
        formData.append('filename', filename);
        formData.append('colClase', colClase);
        formData.append('columnas', vcols);

        switch(algType){
            case 'knn': {
                let k = parseInt(document.querySelector('#k-neighbors-input').value);
                let centro = [
                    parseInt(document.querySelector('#k-centerx-input').value),
                    parseInt(document.querySelector('#k-centery-input').value)
                ];

                formData.append('k', k);
                formData.append('centro', centro);
                break;
            }

            case 'kmeans': {
                let n = parseInt(document.querySelector('#k-clusters-input').value);

                formData.append('n', n);
                break;
            }
            
            default: {
                console.log("Accion no encontrada.")
            }
        }
        
        closeForm();
        fetch(`/${algType}/process`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let resHTML = `
                <div class="model-graph">
                <img src="data:image/png;base64,${data['plot']}" width="100%" alt="Plot">
                </div>
            `;
            if(data['algType'] == "knn"){
                resHTML += `
                    <div class="model-result">
                        <p><b>Predicción:</b> ${data['prediction']}</p>
                    </div>
                `;
            }else if(data['algType'] == "kmeans"){
                resHTML += `
                    <div class="model-result">
                        <p><b>Resultado:</b> Algoritmo Kmeans</p>
                    </div>
                `;
            }
            const dataResult = document.querySelector('#data-result-content');
            dataResult.innerHTML = resHTML;
            document.querySelector("#save-model-btn").removeAttribute('disabled');

            document.querySelector('#save-alg-type').innerText = data['algType'];
            previewData(null, JSON.parse(data['cleandata']), "#save-model-data");
            dataDetails = document.querySelector('#data-details');
            dataDetails.innerHTML = `
                <p><b>Tipo de Algoritmo:</b> ${data['algType']}</p>
                <p><b>Nombre de archivo:</b> ${data['filename']}</p>
            `;

            if(data['algType'] == "knn"){
                dataDetails.innerHTML += `
                <p><b>Vecinos:</b> ${data['details']['k']}</p>
                <p><b>Centro:</b> ${data['details']['centro']}</p>
                `
            }else if(data['algType'] == "kmeans"){
                dataDetails.innerHTML += `
                <p><b>Clusters:</b> ${data['details']['n']}</p>
                `
            }
        });
    });

    modelSaveBtn.addEventListener('click', e => {
        document.querySelector('#save-form-container').style.display = 'flex';
    });
}

/* PRESENTA LOS DATOS EN FORMATO DE TABLA */
const previewData = (fname=null, data, tableId) => {

    /* FORMATEO DEL NOMBRE DE ARCHIVO EN LA CABECERA DE LA TABLA */
    if(fname && tableId=="#tabla"){
        document.querySelector("#filename-text").innerHTML = `<i class="fa-solid fa-file-csv"></i> ${fname}`;
        document.querySelector("#filename-text").style.padding = "0 10px";
        document.querySelectorAll('.btn-ia-model.allowed').forEach(el => {
            el.removeAttribute('disabled');
        })
    }

    /* FORMATEO DE LOS DATOS EN UNA TABLA */
    // Crear las cabeceras de la tabla
    let headers = Object.keys(data[0]);
    let headerRow = '<tr>';
    headers.forEach(function(header) {
        headerRow += '<th>' + header + '</th>';
    });
    headerRow += '</tr>';

    // Llenar el cuerpo de la tabla
    let bodyRows = '';
    data.forEach(function(row) {
        bodyRows += '<tr>';
        headers.forEach(function(header) {
            bodyRows += '<td>' + row[header] + '</td>';
        });
        bodyRows += '</tr>';
    });
    let tableHtml = `<thead>${headerRow}</thead><tbody>${bodyRows}</tbody>`;
    document.querySelector(tableId).innerHTML = tableHtml;
}

/*************************************************************************************/

/* FORMATEA Y RENDERIZA EL FORMULARIO DE LOS ALGORITMOS */
const showForm = (elem) => {
    let algKey = elem.value;
    document.querySelector('#algorithm-title').innerText = elem.innerText;
    document.querySelector('#data-model-key').value = algKey;
    let html = `<div class="alg-form-section">
                <label>Seleccione columnas:</label>
                <div class="cols-input-container">`;
    
    let cols = [];

    document.querySelectorAll('#tabla thead tr th').forEach((el) => {
        cols.push(el.innerText);
    })
    
    for(let col of cols){
        html += `<label><input type="checkbox" class="data-cols" name="data-cols" id="${col}" value="${col}"> ${col}</label>`;
    }

    html += `</div></div>
            <div class="alg-form-section">
            <label for="clase-cols-select">Seleccione la columna Clase:  </label>
            <select id="clase-cols-select">
            <option name="data-clase-cols" value="none" selected disabled>-- Seleccione</option>`;
    
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

    document.querySelector('#clase-cols-select').addEventListener('change', (e) => {
        document.querySelector('#form-btn-preview').removeAttribute('disabled')
        document.querySelector('#form-btn-process').removeAttribute('disabled')

        document.querySelectorAll('.data-cols:disabled').forEach((elem) => {
            elem.removeAttribute('disabled');
            elem.removeAttribute('checked');
        });
        
        let opcion = e.target.value;
        document.querySelector(`#${opcion}`).setAttribute('checked', true);
        document.querySelector(`#${opcion}`).setAttribute('disabled', true);
    })
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

/*****************************************************/