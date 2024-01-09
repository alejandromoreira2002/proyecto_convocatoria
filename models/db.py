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
    
    def insertarDatos(self, sql, data):
        cursor = self.mysql.get_db().cursor()
        op = cursor.execute(sql, data)
        self.mysql.get_db().commit()
        cursor.close()
        if(op):
            return 1
        else:
            return 0