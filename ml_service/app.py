from flask import Flask, request, jsonify
from flask_cors import CORS
from models.recommender import MovieRecommender
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize recommender
recommender = MovieRecommender()

@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'ML Service is running!'
    })

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'userId is required'
            }), 400
            
        # Get hybrid recommendations
        recommendations = recommender.get_hybrid_recommendations(user_id)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/users/test', methods=['GET'])
def get_test_user():
    try:
        user = recommender.db.users.find_one()
        if user:
            return jsonify({
                'success': True,
                'userId': str(user['_id'])
            })
        return jsonify({
            'success': False,
            'error': 'No users found'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    port = int(os.getenv('ML_SERVICE_PORT', 5001))
    app.run(port=port, debug=True)