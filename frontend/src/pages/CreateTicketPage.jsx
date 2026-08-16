import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "../features/tickets/ticketsSlice";
import { useNavigate } from "react-router-dom";

export default function CreateTicketPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            title: "",
            description: "",
            priority: "medium",
        }
    );
    const [formError, setFormError] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.length < 3) {
            setFormError("Title lenght must be greater than 3");
            return;
        }
        setFormError("");
        dispatch(createTicket(formData));
        navigate("/");
    }
    return (
        <div>
            <h2>Create new ticket</h2>
            <form onSubmit={handleSubmit}>
                {formError && <p style={{ color: 'red' }}>{formError}</p>}

                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button type="submit">Create Ticket</button>
            </form>
        </div>
    )
}
