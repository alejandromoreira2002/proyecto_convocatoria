from flask import Flask, render_template, url_for, redirect, request, session
from modules.funciones_machine_learning import knn
#import time

app = Flask(__name__)
app.secret_key = 'my_secret_key'

ia_models = {
    "model1": knn
}

with app.test_request_context():
    url_for('static', filename='/css/principal.css')
    url_for('static', filename='/scripts/principal.js')

@app.route('/')
def Index():
    return redirect(url_for('show_main'))

@app.get('/principal')
def show_main():
    return render_template('principal.html')

@app.post('/prueba')
def prueba():
    f = request.files['file-upload']
    f.save('./uploads/temp_file.csv')
    
    return {'filename': f.filename}

if __name__ == '__main__':
    app.run(port=3000, debug=True)