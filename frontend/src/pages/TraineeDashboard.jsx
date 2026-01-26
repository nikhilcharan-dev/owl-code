import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';

function TraineeDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/trainee/dashboard');
            setDashboardData(response.data);
            if (response.data.batches?.length > 0) {
                const firstBatchId = response.data.batches[0]._id;
                setSelectedBatchId(firstBatchId);
                fetchSchedule(firstBatchId);
            }
        } catch (err) {
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchSchedule = async (batchId) => {
        setLoadingSchedule(true);
        try {
            const response = await api.get(`/trainee/batch/${batchId}/schedule`);
            setSchedule(response.data);
        } catch (err) {
            console.error('Failed to load schedule');
        } finally {
            setLoadingSchedule(false);
        }
    };

    const handleBatchChange = (batchId) => {
        setSelectedBatchId(batchId);
        fetchSchedule(batchId);
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            await api.post('/trainee/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess('Resume uploaded successfully!');
            setResumeFile(null);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to upload resume');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="page flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Trainee Dashboard</h1>
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="grid grid-2">
                    <div className="card">
                        <h3>📚 My Courses & Batches</h3>
                        {dashboardData?.batches?.length > 0 ? (
                            <div className="mt-2 flex flex-col gap-2">
                                {dashboardData.batches.map(b => (
                                    <div
                                        key={b._id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedBatchId === b._id ? 'border-primary bg-primary-subtle' : 'border-transparent hover:bg-white-10'}`}
                                        onClick={() => handleBatchChange(b._id)}
                                    >
                                        <p className="font-bold">{b.course?.title}</p>
                                        <p className="text-muted text-sm">{b.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted mt-2">You are not assigned to any batch yet.</p>
                        )}
                    </div>

                    {/* Resume Upload */}
                    <div className="card">
                        <h3>📄 Resume</h3>
                        <form onSubmit={handleResumeUpload} className="mt-2">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                className="form-input mb-2"
                            />
                            <Button variant="primary" type="submit" disabled={!resumeFile}>
                                Upload Resume
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Schedule */}
                <div className="card mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <h3>📅 Batch Schedule</h3>
                        {loadingSchedule && <div className="spinner-sm"></div>}
                    </div>
                    {schedule?.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Date</th>
                                    <th>Assignments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item) => (
                                    <tr key={item._id}>
                                        <td>Day {item.dayNumber}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>{item.assignments?.join(', ') || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted">No schedule available for the selected batch.</p>
                    )}
                </div>

                {/* Progress */}
                <div className="card mt-2">
                    <h3>📊 My Progress</h3>
                    {dashboardData?.progress?.length > 0 ? (
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Completed Assignments</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.progress.map((item) => (
                                    <tr key={item._id}>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>{item.completedAssignments?.join(', ') || '-'}</td>
                                        <td className="text-muted">{item.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted mt-2">No progress recorded yet.</p>
                    )}
                </div>
            </div>
        </div >
    );
}

export default TraineeDashboard;
