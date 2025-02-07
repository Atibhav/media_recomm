from flask import Flask, jsonify, request
from flask_cors import CORS
from models.recommender import MovieRecommender
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

recommender = MovieRecommender()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ml-service'})

@app.route('/api/recommendations/hybrid/<user_id>', methods=['GET'])
def get_hybrid_recommendations(user_id):
    try:
        limit = int(request.args.get('limit', 10))
        recommendations = recommender.get_hybrid_recommendations(user_id, limit)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        print(f"Error getting hybrid recommendations: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/recommendations/collaborative/<user_id>', methods=['GET'])
def get_collaborative_recommendations(user_id):
    try:
        limit = int(request.args.get('limit', 10))
        recommendations = recommender.get_collaborative_recommendations(user_id, limit)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/recommendations/content/<user_id>', methods=['GET'])
def get_content_recommendations(user_id):
    try:
        limit = int(request.args.get('limit', 10))
        recommendations = recommender.get_content_based_recommendations(user_id, limit)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', os.getenv('ML_SERVICE_PORT', 5001)))
    print(f"Starting ML service on port {port}") #logging to know which port
    app.run(host='0.0.0.0', port=port)
