import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';  // Import axios for making API requests

function App() {
    const [habitPlans, setHabitPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch habit plans when the component loads
    useEffect(() => {
        fetchHabitPlans();
    }, []);

    // Fetch data from the API
    async function fetchHabitPlans() {
        try {
            const response = await axios.get('https://localhost:5001/api/habitplans'); // Replace with your API endpoint
            setHabitPlans(response.data); // Set the fetched habit plans
            setLoading(false); // Set loading to false after data is fetched
        } catch (err) {
            setError('Error fetching habit plans'); // Handle any errors
            setLoading(false); // Set loading to false even if there's an error
        }
    }

    // Display different contents based on the loading state or error
    const contents = loading
        ? <p><em>Loading... Please ensure the ASP.NET backend is running.</em></p>
        : error
            ? <p>{error}</p>
            : <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {habitPlans.map(habit => (
                        <tr key={habit.id}>
                            <td>{habit.id}</td>
                            <td>{habit.title}</td>
                            <td>{habit.description}</td>
                            <td>{new Date(habit.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>;

    return (
        <div>
            <h1 id="tableLabel">Habit Plans</h1>
            <p>This component demonstrates fetching data from the server (Habit Plans).</p>
            {contents}
        </div>
    );
}

export default App;
