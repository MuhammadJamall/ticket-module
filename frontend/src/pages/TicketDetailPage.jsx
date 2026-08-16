import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketById, updateTicket, deleteTicket, clearSingleTicket } from "../features/tickets/ticketsSlice";
import { selectCurrentUser } from "../features/auth/authSlice";

export default function TicketDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { singleTicket, ticketStatus } = useSelector((state) => state.tickets);
    const currentUser = useSelector(selectCurrentUser);

    const [selectedStatus, setSelectedStatus] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: "", description: "", priority: "" });

    useEffect(() => {
        dispatch(getTicketById(id));
    }, [id]);

    useEffect(() => {
        return () => dispatch(clearSingleTicket());
    }, []);

    useEffect(() => {
        if (singleTicket) {
            setSelectedStatus(singleTicket.status);
            setEditData({
                title: singleTicket.title,
                description: singleTicket.description,
                priority: singleTicket.priority,
            });
        }
    }, [singleTicket]);

    const canEdit = currentUser?.role === "admin" || currentUser?.role === "manager";
    const canDelete = currentUser?.role === "admin";

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleStatusUpdate = () => {
        dispatch(updateTicket({
            id: singleTicket.id,
            ticketData: {
                title: editData.title,
                description: editData.description,
                status: selectedStatus,
                priority: editData.priority,
                assigned_to: singleTicket.assigned_to,
            }
        }));
        setIsEditing(false);
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this ticket?");
        if (confirmed) {
            dispatch(deleteTicket(singleTicket.id));
            navigate("/");
        }
    };

    if (ticketStatus === "loading") {
        return <p>Loading...</p>;
    }

    if (ticketStatus === "failed") {
        return <p>Failed to load ticket.</p>;
    }

    return (
        <div>
            {singleTicket && (
                <div>
                    <button onClick={() => navigate(-1)}>Back</button>

                    {!isEditing ? (
                        <>
                            <h1>{singleTicket.title}</h1>
                            <p>{singleTicket.description}</p>
                            <h3>Status: {singleTicket.status}</h3>
                            <h3>Priority: {singleTicket.priority}</h3>
                        </>
                    ) : (
                        <div>
                            <div>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editData.title}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Priority:</label>
                                <select
                                    name="priority"
                                    value={editData.priority}
                                    onChange={handleEditChange}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label>Status:</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        {canEdit && !isEditing && (
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                        )}

                        {canEdit && isEditing && (
                            <>
                                <button onClick={handleStatusUpdate}>Save</button>
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </>
                        )}

                        {canDelete && (
                            <button onClick={handleDelete}>Delete</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}