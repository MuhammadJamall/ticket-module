import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTickets } from "../features/tickets/ticketsSlice";

export default function TicketListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState("all");

    const tickets = useSelector((state) => state.tickets.tickets || []);
    const status = useSelector((state) => state.tickets.listStatus);

    useEffect(() => {
        dispatch(getAllTickets());
    }, [dispatch]);

    const filteredTickets = useMemo(() => {
        if (filterStatus == 'all') {
            return tickets;
        }
        return tickets.filter(
            (ticket) => ticket.status == filterStatus
        )
    }, [tickets, filterStatus]);
    return (
        <div>
            {status === 'loading' && <h2>Loading tickets...</h2>}
            <div>
                <label>Filter by Status: </label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="tickets-list">
                {filteredTickets.length === 0 && status !== 'loading' ? (
                    <p>No tickets found.</p>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate(`/tickets/${ticket.id}`);
                                }
                            }}
                            style={{
                                border: '1px solid black',
                                margin: '10px',
                                padding: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <h3>{ticket.title}</h3>
                            <p>Status: {ticket.status}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}