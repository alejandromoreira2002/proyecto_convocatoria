import matplotlib.pyplot as plt
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from .MLAlgorithms import MLAlgorithms

class KNNModel(MLAlgorithms):
    def __init__(self, dataCSV, columnas, colClase, k, centro=(0,0)):
        super().__init__(dataCSV, columnas, colClase)
        self.k = k
        self.centro = centro

    def resolve(self):
        dataCSV = self.previewData()
        x = dataCSV[self.columnas[0]]
        y = dataCSV[self.columnas[1]]

        classes = dataCSV[self.colClase]

        # Crear un modelo KNN con K=1
        data = list(zip(x, y))
        knn = KNeighborsClassifier(n_neighbors= self.k)
        knn.fit(data, classes)

        # Clasificar un nuevo punto
        new_x, new_y = self.centro
        #new_x = 63
        #new_y = 175
        new_point = [(new_x, new_y)]
        prediction = knn.predict(new_point)
        prediction = self.binaClasses[prediction[0]]

        colors = ["blue", "red", "orange", "purple", "black", "green", "grey"]
        ax = plt.axes()
        for i in range(0, len(self.binaClasses)):
            ax.scatter(dataCSV.loc[dataCSV[self.colClase] == i, self.columnas[0]],
                    dataCSV.loc[dataCSV[self.colClase] == i, self.columnas[1]],
                    c=colors[i],
                    label=self.binaClasses[i])

        ax.scatter(new_x,
                new_y,
                c="yellow",
                s=110,
                marker= "*",
                edgecolors="black")
        plt.text(x=new_x-8.2, y=new_y-4.2, s=f"Centro, predicho: {prediction}", backgroundcolor= "#0000008F", c="white")
        plt.xlabel(self.columnas[0])
        plt.ylabel(self.columnas[1])
        ax.legend()
        plt.show()

        print(prediction)