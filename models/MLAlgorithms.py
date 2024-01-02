import pandas as pd

class MLAlgorithms:
    def __init__(self, data, columnas, colClase):
        self.dataCSV = data
        self.columnas = columnas
        self.colClase = colClase
        self.cleanData()
    
    def cleanData(self):
        pass

    def previewData(self):
        # Datos de ejemplo
        dataCSV = self.dataCSV[self.columnas]
        self.binaClasses = pd.unique(dataCSV[self.colClase])
        for i in range(0, len(self.binaClasses)):
            dataCSV[self.colClase] = dataCSV[self.colClase].replace(self.binaClasses[i], i)
        return dataCSV