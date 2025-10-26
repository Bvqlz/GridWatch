from flask import Flask, jsonify
from flask_cors import CORS
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

OUTPUT_DIR = Path(__file__).parent / 'drone-optimizer' / 'output'

@app.route('/')
def home():
    return "Drone Optimizer API - Available endpoints: /mission-paths, /asset-points, /photo-points, /polygon-boundary, /mission-data"

@app.route('/mission-paths')
def get_mission_paths():
    with open(OUTPUT_DIR / 'mission_paths.json', 'r') as file:
        return jsonify(json.load(file))

@app.route('/asset-points')
def get_asset_points():
    with open(OUTPUT_DIR / 'asset_points.json', 'r') as file:
        return jsonify(json.load(file))

@app.route('/photo-points')
def get_photo_points():
    with open(OUTPUT_DIR / 'photo_points.json', 'r') as file:
        return jsonify(json.load(file))

@app.route('/polygon-boundary')
def get_polygon_boundary():
    with open(OUTPUT_DIR / 'polygon_boundary.json', 'r') as file:
        return jsonify(json.load(file))

# Keep a combined endpoint if needed
@app.route('/mission-data')
def get_all_mission_data():
    """Returns all data in separate keys to avoid merge conflicts"""
    with open(OUTPUT_DIR / 'mission_paths.json', 'r') as file:
        mission_paths = json.load(file)
    with open(OUTPUT_DIR / 'asset_points.json', 'r') as file:
        asset_points = json.load(file)
    with open(OUTPUT_DIR / 'photo_points.json', 'r') as file:
        photo_points = json.load(file)
    with open(OUTPUT_DIR / 'polygon_boundary.json', 'r') as file:
        polygon_boundary = json.load(file)
    
    return jsonify({
        'missionPaths': mission_paths,
        'assetPoints': asset_points,
        'photoPoints': photo_points,
        'polygonBoundary': polygon_boundary
    })

if __name__ == '__main__':
    app.run(debug=True)