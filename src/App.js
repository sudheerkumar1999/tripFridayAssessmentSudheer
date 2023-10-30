import './App.css';
import UserDetails from './Components/userDetails/UserDetails';
import Users from './Components/Users/Users';
import UserPostsSection from "./Components/userposts/UserPosts"
import Home from './Components/Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Users />} />
        {/* <Route path='/users' element={<Users />} /> */}
        <Route path='/Userdetails' element = {<UserDetails/>} />
      </Routes>
      {/* <UserPostsSection /> */}
      
    </div>
  );
}

export default App;
