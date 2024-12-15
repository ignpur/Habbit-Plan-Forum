const buttonStyles = {
    primary: {
        backgroundColor: '#007bff', // Bootstrap primary blue
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        margin: '0 10px',
        textDecoration: 'none', // Remove link underline
        textAlign: 'center',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'background-color 0.2s ease-in-out'
    },
    danger: {
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 15px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out'
    },
    secondary: {
        backgroundColor: '#6c757d', // Bootstrap secondary gray
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        margin: '0 10px',
        textDecoration: 'none',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'background-color 0.2s ease-in-out'
    },
    hover: {
        backgroundColor: '#0056b3' // Darker blue for hover
    }
};

export default buttonStyles;
