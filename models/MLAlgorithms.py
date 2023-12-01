import matplotlib.pyplot as plt
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
from sklearn.cluster import KMeans

class MLAlgorithms:
    def __init__(self, data, columnas):
        self.dataCSV = data
        self.columnas = columnas
        self.cleanData()
    
    def cleanData():
        pass