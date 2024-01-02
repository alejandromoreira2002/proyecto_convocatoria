import secrets
import string

def getSecretKey(longitud=24):
    caracteres = string.ascii_letters + string.digits
    clave_sesion = ''.join(secrets.choice(caracteres) for _ in range(longitud))
    return clave_sesion