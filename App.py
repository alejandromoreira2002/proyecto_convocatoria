from flask import Flask, render_template, url_for, redirect, request, session
from models.kmeans_model import KMeans
from models.knn_model import KNN
import pandas as pd
#import time

app = Flask(__name__)
app.secret_key = 'my_secret_key'

with app.test_request_context():
    url_for('static', filename='/css/principal.css')
    url_for('static', filename='/scripts/principal.js')

@app.route('/')
def Index():
    return redirect(url_for('show_main'))

@app.get('/principal')
def show_main():
    return render_template('principal.html')

@app.get('/knn')
def knnRoute():
    df = pd.read_csv('./uploads/500_Person_Gender_Height_Weight_Index.csv')
    knn(df, ["Weight", "Height"], "Gender", 5, (63, 175))
    return redirect(url_for('show_main'))

@app.post('/prueba')
def prueba():
    f = request.files['file-upload']
    f.save('./uploads/temp_file.csv')
    
    return {'filename': f.filename}

if __name__ == '__main__':
    app.run(port=3000, debug=True)