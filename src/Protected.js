import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected({Component}) {
    
    const navigate = useNavigate();
    useEffect(() =>{
        if(!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') === false){
            navigate('/');            
        }
    },[navigate]);
    return (
    <div>     
        <Component/>
    </div>)
}

export default Protected;