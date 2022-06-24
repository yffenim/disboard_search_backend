const DynamicMsg = ({ message }) => (
    <div 
        role="region" 
        aria-live="polite" 
        className="visually-hidden"
        style={{marginTop: "20px", color:"#c4b5fd"}}
    >
        Finding... {message}
    </div>
);

export default DynamicMsg

