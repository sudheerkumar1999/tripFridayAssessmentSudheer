import React, {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import UserDetails from '../userDetails/UserDetails';
import LoaderComp from '../Loader/Loader';
import './Users.css';

export default function Users() {
    const [usersData, setUsersData] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const userList = async() => {
        setShowLoader(true);
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        // console.log(data);
        setUsersData(data);
        setShowLoader(false);

    }
   
    useEffect(()=>{
        userList()
    }, []);

    const navigate = useNavigate();

    const handleUserDetails = (id) => {
        const userData = usersData.find((user)=>user.id==id)
        // console.log(userData);
        const { name, email, phone} = userData;
        
        navigate("/Userdetails", {state:{userData: {id:userData.id, name:name, email:email, phone:phone}}});
    }

  return (
    <div style={{ textAlign: 'center'}}>
        <h3>Users List</h3>
        {showLoader ? <LoaderComp /> :
        <>
        {
            usersData.map((eachUser) => {
                const {id, name, email} = eachUser;
                const hoveringText = `Name : ${name},\nEmail : ${email}`
                return (
                    <div key={id} 
                         className='user-list-item'
                       >
                        <div 
                        //  className='user-name'
                        title = {hoveringText}
                        onClick={()=>handleUserDetails(id)}
                        >{name}</div>
                    </div>
                )
            })
        }
        </> }
    </div>
  )
}
