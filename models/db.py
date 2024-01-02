from flaskext.mysql import MySQL
import json
class db():
    def __init__(self, app):
        self.mysql = MySQL()
        self.mysql.init_app(app)
    
    def consultarDatos(self, sql):
        cursor = self.mysql.get_db().cursor()
        cursor.execute(sql)
        data = cursor.fetchall()
        if(len(data) > 0):
            return data
        else:
            return None