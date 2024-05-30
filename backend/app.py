from flask import Flask

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return {'Hello': 'World', 'Version': 1}


if __name__ == '__main__':
    app.run(debug=True)