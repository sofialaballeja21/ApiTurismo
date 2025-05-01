import redis
import json
import os
from flask import Flask, request, jsonify
import redis.exceptions
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

redis_host = os.environ.get("REDIS_HOST", "db-apiTurismo")
redis_port = int(os.environ.get('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, db=0)

grupos_interes = {
    "cervecerias": "cervecerias",
    "universidades": "universidades",
    "farmacias": "farmacias",
    "supermercados": "supermercados"
}

def agregar_lugar(nombre_grupo, nombre_lugar, latitud, longitud):
    try:
        r.geoadd(nombre_grupo, (longitud, latitud, nombre_lugar))
        return True
    except Exception as e:
        print(f"Error en agregar_lugar: {e}")
        return False

def agregar_redis():
    agregar_lugar('cervecerias', 'Citra Bar', -58.2334, -32.4834)
    agregar_lugar('cervecerias', 'Kamba Kua', -58.2150, -32.4700)
    agregar_lugar('cervecerias', 'Tractor', -58.2250, -32.4750)
    agregar_lugar('cervecerias', '7 Colinas', -58.2300, -32.4800)
    agregar_lugar('cervecerias', 'Ambar', -58.2100, -32.4650)

    agregar_lugar('universidades', 'UADER FCYT', -58.2300, -32.4800)
    agregar_lugar('universidades', 'UTN', -58.2350, -32.4850)
    agregar_lugar('universidades', 'UNER', -58.2180, -32.4800)
    agregar_lugar('universidades', 'UCU', -58.2180, -32.4680)
    agregar_lugar('universidades', 'UADER FCG', -58.2280, -32.4780)

    agregar_lugar('farmacias', 'Gargano', -58.2120, -32.4620)
    agregar_lugar('farmacias', 'Argentina', -58.2340, -32.4840)
    agregar_lugar('farmacias', 'Vitamina', -58.2290, -32.4790)
    agregar_lugar('farmacias', 'Cientifica', -58.2270, -32.4770)
    agregar_lugar('farmacias', 'Colón', -58.2360, -32.4860)

    agregar_lugar('supermercados', 'DAR Supremo', -58.2350, -32.4850)
    agregar_lugar('supermercados', 'DIA', -58.2260, -32.4760)
    agregar_lugar('supermercados', 'Primavera', -58.2280, -32.4780)
    agregar_lugar('supermercados', 'San Justo', -58.2200, -32.4700)
    agregar_lugar('supermercados', 'Impulso', -58.2330, -32.4830)
    print("Datos cargados en Redis.") 

@app.route('/api/grupos/<nombre_grupo>/lugares', methods=['POST', 'OPTIONS'])  # Importante agregar OPTIONS
def api_agregar_lugares(nombre_grupo):
    if request.method == 'OPTIONS':
        
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    print("Entrando en api_agregar_lugares")
    print(f"Nombre del grupo: {nombre_grupo}")
    try:
        data = request.get_json()
        print(f"Datos recibidos: {data}, Tipo: {type(data)}")

        if nombre_grupo not in grupos_interes:
            return jsonify({'Error': f'El grupo de interes "{nombre_grupo}" no existe'}), 400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

        if not data or "nombre" not in data or "latitud" not in data or "longitud" not in data:
            return jsonify({"Error": "Faltan datos"}), 400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

        nombre_lugar = data['nombre']
        latitud = float(data['latitud'])
        longitud = float(data['longitud'])

        print(f"Nombre lugar: {nombre_lugar}, Tipo: {type(nombre_lugar)}")
        print(f"Latitud: {latitud}, Tipo: {type(latitud)}")
        print(f"Longitud: {longitud}, Tipo: {type(longitud)}")

        if agregar_lugar(nombre_grupo, nombre_lugar, latitud, longitud):
            return jsonify({"mensaje": f"Lugar agregado"}), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        else:
            return jsonify({"Error": "No se pudo agregar"}), 500, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return jsonify({"Error": "Latitud/longitud deben ser numeros"}), 400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        print(f"Error inesperado: {e}, Tipo: {type(e)}")
        return jsonify({"Error": f"Ocurrio un error: {e}"}), 500, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}


@app.route('/api/grupos/<nombre_grupo>/cercanos', methods=['GET'])
def obtener_lugares_cercanos(nombre_grupo):
    print(f"Entrando en obtener_lugares_cercanos con grupo: {nombre_grupo}")
    if nombre_grupo not in grupos_interes:
        print(f"Error: El grupo '{nombre_grupo}' no existe")
        return jsonify({"Error": f"El grupo de interes '{nombre_grupo}' no existe"}), 400, {'Content-Type': 'application/json'}
    try:
        lat_usuario = request.args.get('lat')
        long_usuario = request.args.get('lon')

        print(f"Latitud recibida: {lat_usuario}, Longitud recibida: {long_usuario}")

        if not lat_usuario or not long_usuario:
            print("Error: Faltan latitud o longitud")
            return jsonify({"Error": "Se deben indicar la latitud y longitud del usuario"}), 400, {'Content-Type': 'application/json'}

        try:
            lat_usuario = float(lat_usuario)
            long_usuario = float(long_usuario)
        except ValueError:
            print("Error: Latitud o longitud no son números")
            return jsonify({"Error": "La longitud y latitud deben ser numeros"}), 400, {'Content-Type': 'application/json'}

        radio = 5

        lugares_cercanos = r.georadius(
            nombre_grupo,
            long_usuario,
            lat_usuario,
            radius=radio,
            unit='km',
            withdist=False,
            withcoord=True,
            sort='ASC'
        )

        print(f"Resultado de GEORADIUS: {lugares_cercanos}") 
        resultado = []
        if lugares_cercanos:
            for lugar in lugares_cercanos:
                nombre = lugar[0].decode('utf-8')
                longitud_lugar = lugar[1][0]
                latitud_lugar = lugar[1][1]
                resultado.append({'nombre': nombre, 'latitud': latitud_lugar, 'longitud': longitud_lugar})

        print(f"Respuesta final: {resultado}")
        return jsonify({'lugares_cercanos': resultado}), 200, {'Content-Type': 'application/json'}

    except redis.exceptions.ConnectionError as e:
        print(f"Error al conectar con redis: {e}")
        return jsonify({"error": f"Error al conectar con redis: {e}"}), 500, {'Content-Type': 'application/json'}
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify({'error': f"Ocurrio un error: {e}"}), 500, {'Content-Type': 'application/json'}
    

@app.route('/api/grupos/<nombre_grupo>/listadolugares', methods=['GET'])
def obtener_todos_los_lugares(nombre_grupo):
    print(f"Intentando obtener lugares para el grupo: {nombre_grupo}") # <---- MENSAJE AL ENTRAR EN LA FUNCIÓN
    if nombre_grupo not in grupos_interes:
        return jsonify({"Error": f"El grupo de interes '{nombre_grupo}' no existe"}), 400, {'Content-Type': 'application/json'}
    try:
        lugares_redis = r.georadius(nombre_grupo, 0, 0, radius=float('inf'), unit='km', withcoord=True, withdist=False, sort='ASC')
        print(f"Lugares encontrados en Redis: {lugares_redis}") # <---- MENSAJE CON LOS DATOS DE REDIS
        resultado = []
        for lugar in lugares_redis:
            nombre = lugar[0].decode('utf-8')
            longitud_lugar = lugar[1][0]
            latitud_lugar = lugar[1][1]
            resultado.append({'nombre': nombre, 'latitud': latitud_lugar, 'longitud': longitud_lugar})
        return jsonify({'lugares': resultado}), 200, {'Content-Type': 'application/json'}
    except redis.exceptions.ConnectionError as e:
        return jsonify({"error": f"Error al conectar con redis: {e}"}), 500, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({'error': f"Ocurrio un error: {e}"}), 500, {'Content-Type': 'application/json'}


if __name__ == '__main__':
   # with app.app_context():
    agregar_redis()
    app.run(debug=True, host='0.0.0.0')