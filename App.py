
################[ AUN NO SE TRABAJARA EN EL BACKEND HASTA TERMINAR EL FRONTEND ]################

from flask import Flask, render_template, url_for, redirect, request, session, jsonify
from models.db import db
from models.kmeans_model import KMeansModel
from models.knn_model import KNNModel
from modules.secret_key import getSecretKey
from io import BytesIO
import matplotlib.pyplot as plt
import pandas as pd
import json
import base64

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

#=======================[ PREVIEW MODELS SECTION ]=======================#
@app.post('/knn/preview')
def prevKNN():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    
    knnmodel = KNNModel(dataCSV, columnas, colClase)
    dfmodel = knnmodel.previewData()
    return dfmodel.to_json(orient='records') 

@app.post('/kmeans/preview')
def prevKMeans():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    
    kmeansmodel = KMeansModel(dataCSV, columnas, colClase)
    dfmodel = kmeansmodel.previewData()
    return dfmodel.to_json(orient='records') 
#========================================================================#
#
#
#
#
#=======================[ PROCESS MODELS SECTION ]=======================#
@app.post('/knn/process')
def processKNN():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    k = int(request.form['k'])
    centro = tuple([int(x) for x in request.form['centro'].split(',')])
    
    knnmodel = KNNModel(dataCSV, columnas, colClase)
    fig = knnmodel.resolve(k, centro)

    img_data = BytesIO()
    fig.savefig(img_data, format='png')
    img_data.seek(0)
    fig.close()

    encoded_img = base64.b64encode(img_data.read()).decode('utf-8')
    prediction = knnmodel.prediction

    return jsonify({"algType": "knn", "prediction": prediction, "plot": encoded_img}) 

@app.post('/kmeans/process')
def processKMeans():
    json_data = request.form.get('data')
    dataCSV = pd.DataFrame(json.loads(json_data))

    filename = request.form['filename']
    colClase = request.form['colClase']
    columnas = request.form['columnas'].split(',')
    n = int(request.form['n'])
    
    kmeansmodel = KMeansModel(dataCSV, columnas, colClase)
    fig = kmeansmodel.resolve(n)

    img_data = BytesIO()
    fig.savefig(img_data, format='png')
    img_data.seek(0)
    fig.close()

    encoded_img = base64.b64encode(img_data.read()).decode('utf-8')
    
    return jsonify({"algType": "kmeans", "plot": encoded_img}) 
#========================================================================#



@app.post('/prueba')
def prueba():
    f = request.files['file-upload']
    f.save('./uploads/temp_file.csv')
    
    return {'filename': f.filename}



if __name__ == '__main__':
    app.run(port=3000, debug=True)