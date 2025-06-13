
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=username,
        password=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'})

@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@auth.route('/api/user', methods=['GET'])
@login_required
def get_user():
    return jsonify({'username': current_user.username})
    from flask import Blueprint
from backend.models import User, db
from werkzeug.security import generate_password_hash

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    # Your registration logic here
    pass