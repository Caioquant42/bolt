from flask import Flask, jsonify, make_response
from flask_restful import Api
import logging
from logging.handlers import RotatingFileHandler
import os
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.errorhandler(404)
    def not_found(error):
        return make_response(jsonify({"error": "Not found"}), 404)

    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/ibov_api.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('IBOV API startup')

    return app