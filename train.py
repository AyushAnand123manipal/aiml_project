import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from .preprocessing import preprocess_text, vectorizer
import joblib

# Load dataset (example - you should use your own dataset)
# Dataset format: text, sentiment (positive/negative/neutral)
data = pd.read_csv('sentiment_dataset.csv')

# Preprocess data
data['cleaned_text'] = data['text'].apply(preprocess_text)

# Fit vectorizer
X = vectorizer.fit_transform(data['cleaned_text'])
y = data['sentiment']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = SVC(probability=True)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")

# Save model
joblib.dump(model, 'model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')