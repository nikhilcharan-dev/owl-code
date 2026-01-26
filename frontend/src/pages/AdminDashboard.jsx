import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();


    return (
        <div className="page">
            <div className="container dashboard-container">
                <div className="page-header dashboard-header">
                    <h1>Admin Dashboard</h1>
                </div>

                {/* Navbar removed - moved to Sidebar */}

                <div className="dashboard-grid">
                    <Link to="/admin/courses" className="dashboard-link">
                        <div className="card dashboard-card">
                            <h3 className="dashboard-card-title">📚 Course Management</h3>
                            <p className="dashboard-card-desc">Create, edit, and manage training courses</p>
                        </div>
                    </Link>

                    <Link to="/admin/batches" className="dashboard-link">
                        <div className="card dashboard-card">
                            <h3 className="dashboard-card-title">👥 Batch Management</h3>
                            <p className="dashboard-card-desc">Organize batches and assign trainees</p>
                        </div>
                    </Link>

                    <Link to="/admin/trainees" className="dashboard-link">
                        <div className="card dashboard-card">
                            <h3 className="dashboard-card-title">🎓 Trainee Overview</h3>
                            <p className="dashboard-card-desc">Monitor trainee progress and performance</p>
                        </div>
                    </Link>

                    <Link to="/admin/challenges" className="dashboard-link">
                        <div className="card dashboard-card">
                            <h3 className="dashboard-card-title">🏆 Open Challenges</h3>
                            <p className="dashboard-card-desc">Create day-based skill tracks and curriculums</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
