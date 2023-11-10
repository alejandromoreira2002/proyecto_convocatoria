window.onload = () => {
    const fileElement = document.querySelector('#file-upload');
    //const fileForm = document.querySelector('#file-selection-form');
    const algBtn1 = document.querySelector('#algorithm-btn1');
    const algBtn2 = document.querySelector('#algorithm-btn2');
    const algBtn3 = document.querySelector('#algorithm-btn3');
    const algBtn4 = document.querySelector('#algorithm-btn4');
    const modelSaveBtn = document.querySelector('#save-model-btn');
    const mfContainer = document.querySelector('.model-form-container');
    const btnPrueba = document.querySelector('#close-form-btn');

    const readNameFile = () => {
        let csvFile = fileElement.files[0];

        document.querySelector("#filename-text").innerHTML = `<i class="fa-solid fa-file-csv"></i> ${csvFile.name}`;
        document.querySelector("#filename-text").style.padding = "0 10px";
        
        previewData(csvFile);
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

    const algorithmBtn1 = (event) => {
        mfContainer.style.display = "flex";
        setTimeout(()=>{
            mfContainer.classList.add('mf-container-open');
            formatParams(event.srcElement.innerText);
        }, 100);
    }

    const previewData = (csvFile) => {
        if (csvFile) {
            const reader = new FileReader();
    
            reader.onload = function(event) {
                const csv = event.target.result;
                const data = Papa.parse(csv, { header: true }); // Utilizamos la biblioteca PapaParse para parsear el CSV
    
                const table = document.getElementById("tabla");
                table.innerHTML = "";
    
                if (data.data.length > 0) {
                    const headers = data.meta.fields;
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
    
            reader.readAsText(csvFile);
        }
    }



    
    fileElement.addEventListener('change', readNameFile);
    algBtn1.addEventListener('click', algorithmBtn1);

    btnPrueba.addEventListener('click', () => {
        mfContainer.style.display = 'none';
        mfContainer.classList.remove('mf-container-open');
    });
}   