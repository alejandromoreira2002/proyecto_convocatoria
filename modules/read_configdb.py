def readConfigFile(route):
    #route = '../db/dbconfig.txt'
    lines = {}
    with open(route, 'r') as file:
        # Itera sobre cada línea del archivo
        for line in file:
            l = line.strip().split('=')
            if l[0] == 'port':
                lines[l[0]] = int(l[1])
            else:
                lines[l[0]] = l[1]
    return lines
            
#lines = readConfigFile('../db/dbconfig.txt')
#print(lines)
