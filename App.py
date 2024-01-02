
################[ AUN NO SE TRABAJARA EN EL BACKEND HASTA TERMINAR EL FRONTEND ]################

from flask import Flask, render_template, url_for, redirect, request, session, jsonify
from models.db import db
from models.kmeans_model import KMeansModel
from models.knn_model import KNNModel
from modules.secret_key import getSecretKey
import pandas as pd
import json

app = Flask(__name__)

# Configuración de la base de datos
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 3306
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'convocatoria'

# Inicia la sesión
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Inicializa la extensión MySQL
dbModel = db(app)

with app.test_request_context():
    url_for('static', filename='/css/principal.css')
    url_for('static', filename='/scripts/principal.js')

@app.route('/')
def Index():
    return redirect(url_for('show_main'))

@app.get('/principal')
def show_main():
    if not 'secret' in session: session['secret'] = getSecretKey()

    # USAR CLAVE SECRETA PARA CONSULTAR DATAFRAMES DE BASE DE DATOS
    clave_sesion = session['secret']
    ################################

    return render_template('principal.html')

@app.get('/bd/prueba')
def pruebaBD():
    data = dbModel.consultarDatos("SELECT * FROM df_usuarios")
    return jsonify({'data': data})

@app.post('/file/upload')
def uploadFile():
    df = pd.read_csv(request.files['dataFile'])

    return df.to_json(orient='records')

@app.post('/knn/preview')
def prevKNN():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    k = int(request.form['k'])
    centro = tuple([int(x) for x in request.form['centro'].split(',')])
    knnmodel = KNNModel(dataCSV, columnas, colClase, k, centro)
    
    dfmodel = knnmodel.previewData()
    return dfmodel.to_json(orient='records') 

@app.post('/kmeans/preview')
def prevKMeans():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    n = int(request.form['n'])
    
    kmeansmodel = KMeansModel(dataCSV, columnas, colClase, n)
    
    dfmodel = kmeansmodel.previewData()
    return dfmodel.to_json(orient='records') 

#======================================================================================
@app.post('/prueba')
def prueba():
    f = request.files['file-upload']
    f.save('./uploads/temp_file.csv')
    
    return {'filename': f.filename}
#======================================================================================


if __name__ == '__main__':
    app.run(port=3000, debug=True)