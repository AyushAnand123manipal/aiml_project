import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import AuthContext from '../context/AuthContext';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/history', { 
                    withCredentials: true 
                });
                setHistory(res.data);
            } catch (err) {
                console.error('Error fetching history:', err);
            }
        };
        
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const analyzeText = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/analyze', 
                { text }, 
                { withCredentials: true }
            );
            setResult(res.data);
            setHistory(prev => [...prev, { text, ...res.data }]);
        } catch (err) {
            console.error('Analysis failed:', err);
        }
    };

    const chartData = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [{
            data: [
                history.filter(h => h.sentiment === 'positive').length,
                history.filter(h => h.sentiment === 'negative').length,
                history.filter(h => h.sentiment === 'neutral').length
            ],
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
        }]
    };

    return (
        <div className="container mt-4">
            <h1>Welcome, {user?.username}</h1>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title">Sentiment Analysis</h2>
                            <textarea 
                                className="form-control mb-3" 
                                rows="5" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text to analyze..."
                            />
                            <button className="btn btn-primary" onClick={analyzeText}>
                                Analyze
                            </button>
                            
                            {result && (
                                <div className="mt-3">
                                    <h4>Result:</h4>
                                    <p>Sentiment: 
                                        <strong className={`text-${
                                            result.sentiment === 'positive' ? 'success' : 
                                            result.sentiment === 'negative' ? 'danger' : 'warning'
                                        }`}>
                                            {result.sentiment}
                                        </strong>
                                    </p>
                                    <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title">Sentiment Distribution</h2>
                            <div style={{ height: '300px' }}>
                                <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Analysis History</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Text</th>
                                    <th>Sentiment</th>
                                    <th>Confidence</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.text.substring(0, 50)}...</td>
                                        <td>
                                            <span className={`badge bg-${
                                                item.sentiment === 'positive' ? 'success' : 
                                                item.sentiment === 'negative' ? 'danger' : 'warning'
                                            }`}>
                                                {item.sentiment}
                                            </span>
                                        </td>
                                        <td>{(item.confidence * 100).toFixed(2)}%</td>
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <button className="btn btn-danger mt-3" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;