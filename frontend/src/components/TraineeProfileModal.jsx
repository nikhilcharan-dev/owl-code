import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const TraineeProfileModal = ({ isOpen, onClose, trainee }) => {
    const navigate = useNavigate();

    if (!trainee) return null;

    const handleBatchClick = (batchId) => {
        // Navigate to batch manager
        // Optionally we could pass state to highlight the batch, but for now simple navigation is requested
        navigate('/admin/batches');
        onClose(); // Close modal after navigation
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Trainee Profile"
            size="lg"
        >
            <div className="trainee-profile-premium">
                <div className="profile-summary-card">
                    <div className="profile-avatar-large">
                        {trainee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="profile-name">{trainee.name}</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-secondary profile-email">{trainee.workEmail}</p>
                            {trainee.studentId && <span className="tag-tiny" style={{ fontSize: '0.7rem' }}>{trainee.studentId}</span>}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="tag-tiny role-badge">{trainee.role}</span>
                            <span className="tag-tiny status-badge">Active Account</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-2 gap-6">
                    <section>
                        <h4 className="section-title" style={{ color: 'var(--accent-primary)' }}>
                            <span>👤</span> ACCOUNT INFORMATION
                        </h4>
                        <div className="flex flex-col gap-4">
                            <div className="info-card">
                                <p className="info-label">Student ID</p>
                                <p className="info-value">{trainee.studentId || 'Not set'}</p>
                            </div>
                            <div className="info-card">
                                <p className="info-label">Joined Date</p>
                                <p>{new Date(trainee.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                            </div>
                            {trainee.collegeEmail && (
                                <div className="info-card">
                                    <p className="info-label">College Email</p>
                                    <p>{trainee.collegeEmail}</p>
                                </div>
                            )}
                            <div className="info-card">
                                <p className="info-label">Resume Status</p>
                                {trainee.resume ? (
                                    <div className="flex flex-col gap-3 mt-2">
                                        <p className="text-success text-sm flex items-center gap-2">
                                            <span>✅</span> Document uploaded
                                        </p>
                                        <a
                                            href={trainee.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm flex items-center justify-center gap-2 resume-btn"
                                        >
                                            <span>👁️</span> View Document
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-muted italic text-sm py-2">No resume uploaded by student</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="section-title" style={{ color: 'var(--accent-secondary)' }}>
                            <span>🚀</span> BATCH ENROLLMENTS
                        </h4>
                        <div className="flex flex-col gap-3">
                            {trainee.assignedBatches?.length > 0 ? (
                                trainee.assignedBatches.map(b => (
                                    <div
                                        key={b._id}
                                        className="info-card batch-card group"
                                        onClick={() => handleBatchClick(b._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <p className="font-bold text-lg">{b.name}</p>
                                            <p className="text-muted text-xs">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Batch →</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center rounded-xl border border-dashed border-white-10 text-muted">
                                    Not assigned to any batches yet
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>
                        Done
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TraineeProfileModal;
