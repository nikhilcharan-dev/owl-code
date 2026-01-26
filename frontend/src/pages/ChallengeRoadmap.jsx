import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { showToast } from '../components/Notification';
import '../styles/Calendar.css';

function ChallengeRoadmap() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const ITEMS_PER_PAGE = 28; // 4 weeks

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    const fetchChallenge = async () => {
        try {
            const response = await api.get(`/challenges/${id}`);
            setChallenge(response.data);
        } catch (err) {
            // Handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleDayClick = (dayNum) => {
        setSelectedDay(dayNum);
        const existing = challenge.dailyAssignments && challenge.dailyAssignments[dayNum.toString()];
        setAssignments(Array.isArray(existing) ? existing : []);
        setShowModal(true);
    };

    const handleAddAssignment = () => {
        setAssignments([...assignments, {
            name: '',
            link: '',
            platform: 'leetcode',
            category: 'dsa',
            level: 'medium',
            tags: [],
            description: ''
        }]);
    };

    const handleRemoveAssignment = (index) => {
        setAssignments(assignments.filter((_, i) => i !== index));
    };

    const handleAssignmentChange = (index, field, value) => {
        const updated = [...assignments];
        if (field === 'tags') {
            updated[index][field] = value.split(',').map(t => t.trim()).filter(t => t !== '');
        } else {
            updated[index][field] = value;
        }
        setAssignments(updated);
    };

    const handleSaveAssignments = async (e) => {
        e.preventDefault();

        // Validation
        if (assignments.length > 0) {
            for (let i = 0; i < assignments.length; i++) {
                const asgn = assignments[i];
                if (!asgn.name?.trim()) {
                    showToast(`Task name is required for Task ${i + 1}`, 'error');
                    return;
                }
                if (!asgn.link?.trim() || !asgn.link.startsWith('http')) {
                    showToast(`Valid URL link is required for Task ${i + 1}`, 'error');
                    return;
                }
            }
        }

        try {
            await api.put(`/challenges/${id}/assignments`, {
                dayNumber: selectedDay,
                assignments: assignments
            });
            showToast(`Day ${selectedDay} roadmap saved!`, 'success');
            setShowModal(false);
            fetchChallenge();
        } catch (err) {
            // Handled by interceptor
        }
    };

    if (loading) return <div className="page flex items-center justify-center"><div className="spinner"></div></div>;
    if (!challenge) return <div className="page container"><h2>Challenge not found</h2></div>;

    return (
        <div className="page">
            <div className="container">
                <nav className="nav">
                    <Link to="/admin/challenges" className="nav-link">← Challenges</Link>
                    <span className="nav-link active">{challenge.title} - Roadmap</span>
                </nav>

                <div className="page-header">
                    <div>
                        <h1>{challenge.title}</h1>
                        <p className="text-secondary">{challenge.duration} Day Curriculum Plan</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for a Day (e.g. '50')"
                        className="form-input"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                    <div className="text-secondary text-sm">
                        Showing {ITEMS_PER_PAGE} days per page
                    </div>
                </div>

                <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {Array.from({ length: challenge.duration }, (_, i) => ({ dayNum: i + 1 }))
                        .filter(day => day.dayNum.toString().includes(searchTerm.replace(/\D/g, '')))
                        .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                        .map((day) => {
                            const { dayNum } = day;
                            const dayAssignments = challenge.dailyAssignments?.[dayNum.toString()] || [];
                            return (
                                <div
                                    key={dayNum}
                                    className={`card clickable-card ${dayAssignments.length > 0 ? 'border-primary' : 'border-dashed'}`}
                                    onClick={() => handleDayClick(dayNum)}
                                    style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-primary">Day {dayNum}</span>
                                        {dayAssignments.length > 0 && <span className="tag-tiny tag-success">{dayAssignments.length} Tasks</span>}
                                    </div>
                                    {dayAssignments.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {dayAssignments.slice(0, 2).map((a, idx) => (
                                                <div key={idx} className="text-xs text-muted truncate">• {a.name}</div>
                                            ))}
                                            {dayAssignments.length > 2 && <div className="text-xs text-secondary italic">+ {dayAssignments.length - 2} more</div>}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-muted italic">Click to add tasks</div>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* Pagination Controls */}
                {challenge.duration > ITEMS_PER_PAGE && (
                    <div className="flex justify-center items-center gap-4 mt-6 mb-8">
                        <Button
                            variant="secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </Button>
                        <span className="text-muted">
                            Page {currentPage} of {Math.ceil(
                                Array.from({ length: challenge.duration }, (_, i) => i + 1)
                                    .filter(d => d.toString().includes(searchTerm.replace(/\D/g, '')))
                                    .length / ITEMS_PER_PAGE
                            ) || 1}
                        </span>
                        <Button
                            variant="secondary"
                            disabled={currentPage * ITEMS_PER_PAGE >= Array.from({ length: challenge.duration }, (_, i) => i + 1).filter(d => d.toString().includes(searchTerm.replace(/\D/g, ''))).length}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Day ${selectedDay}: Assignment Planning`} size="lg">
                    <form onSubmit={handleSaveAssignments}>
                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1.5rem' }}>
                            {assignments.map((asgn, index) => (
                                <div key={index} className="assignment-form-card">
                                    <button type="button" className="remove-btn" onClick={() => handleRemoveAssignment(index)}>×</button>

                                    <div className="form-group full-width">
                                        <label className="form-label">Task Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={asgn.name}
                                            onChange={e => handleAssignmentChange(index, 'name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Platform</label>
                                        <select
                                            className="form-input"
                                            value={asgn.platform}
                                            onChange={e => handleAssignmentChange(index, 'platform', e.target.value)}
                                        >
                                            <option value="leetcode">LeetCode</option>
                                            <option value="codeforces">Codeforces</option>
                                            <option value="codechef">CodeChef</option>
                                            <option value="atcoder">AtCoder</option>
                                            <option value="hackerrank">HackerRank</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-input"
                                            value={asgn.category}
                                            onChange={e => handleAssignmentChange(index, 'category', e.target.value)}
                                        >
                                            <option value="dsa">DSA</option>
                                            <option value="sql">SQL</option>
                                            <option value="system-design">System Design</option>
                                            <option value="development">Development</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Level</label>
                                        <select
                                            className="form-input"
                                            value={asgn.level}
                                            onChange={e => handleAssignmentChange(index, 'level', e.target.value)}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label className="form-label">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={asgn.tags?.join(', ')}
                                            onChange={e => handleAssignmentChange(index, 'tags', e.target.value)}
                                            placeholder="Array, BFS, Dynamic Programming"
                                        />
                                    </div>

                                    <div className="form-group full-width" style={{ marginTop: '-0.5rem' }}>
                                        <label className="form-label">Link</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            value={asgn.link}
                                            onChange={e => handleAssignmentChange(index, 'link', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={handleAddAssignment}
                                className="btn-dashed"
                                style={{ marginTop: '0.5rem' }}
                            >
                                + Add Assignment Task
                            </Button>
                        </div>

                        <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit">Save Roadmap</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div >
    );
}

export default ChallengeRoadmap;
