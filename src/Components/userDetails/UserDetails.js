import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import LoaderComp from '../Loader/Loader';

import './UserDetails.css';

const UserDetails = () => {

    const location = useLocation();
    
    const [userPosts, setUserPosts] = useState([]);
    const [showPostSection, setShowPostSection] = useState(false);
    const [showAlbumSection, setShowAlbumSection] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [query, setQuery] = useState('');
    const [editingPostId, setEditingPostId] = useState('');


    const [showPost, setShowPost] = useState(true);
    const [collapsePostId, setCollapsePostId] = useState('');
    const [comments, setComments] = useState([]);
    const [postLoader, setPostLoader] = useState(false);
    const [commentsLoader, setCommentsLoader] = useState(false);
    const [photosLoader, setPhotosLoader] = useState(false);


    const [userAlbums, setUserAlbums] = useState([]);
    const [collapseAlbumId, setCollapseAlbumId] = useState('');
    const [photos, setPhotos] = useState([]);
    const [showAlbum, setShowAlbum] = useState(true);


    const fetchComments = async (id) =>{
      setCommentsLoader(true);
      const commentsbyPostIdUrl = 'https://jsonplaceholder.typicode.com/comments?postId=';
      const url = commentsbyPostIdUrl+id;
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data);
      setComments(data);
      setCommentsLoader(false);
    }

    const fetchPhotos = async (id) =>{
      setPhotosLoader(true);

      const photosUrl = 'https://jsonplaceholder.typicode.com/photos?albumId=';
      const url = photosUrl+id;
      const response = await fetch(url);
      const data = await response.json();
      setPhotos(data);
      setPhotosLoader(false);

    }


    const getUserPosts = async() => {
        setPostLoader(true);
        const url = 'https://jsonplaceholder.typicode.com/posts?userId='+location.state.userData.id;
        const response = await fetch(url);
        const posts = await response.json();
        // console.log(data);
        setUserPosts(posts);
        setFilteredData(posts);
        setPostLoader(false);
    }

    const fetchUserAlbums = async() => {
      const url = 'https://jsonplaceholder.typicode.com/albums?userId='+location.state.userData.id;
      const response = await fetch(url);
      const data = await response.json();
      console.log("setUserAlbums => ",data);
      setUserAlbums(data);
  }
   
    useEffect(()=>{
      getUserPosts();
      fetchUserAlbums();
    }, []);
    
    // const post = userPosts.filter((eachPost) => eachPost.userId == location.state.userData.id);
    
    const handleCollapse = (post) => {
        console.log("post=>  ",post);
        if(collapsePostId !== post.id){
            setCollapsePostId(post.id);
            setShowPost(true);
            setComments([])
            fetchComments(post.id);        

        } else {
            setShowPost(!showPost);
            setCollapsePostId(post.id);
        }
    }

    const handleUserAlbum = (alb) =>{
      if(collapseAlbumId !== alb.id){
        setCollapseAlbumId(alb.id);
        setShowAlbum(true);
        setPhotos([])
        fetchPhotos(alb.id);        

      } else {
          setShowAlbum(!showAlbum);
          setCollapseAlbumId(alb.id);
      }
    }

    console.log("showPost =>",showPost,'collapsePostId  =>', collapsePostId );
    console.log("comments =>",comments );

    const handleSearch =(e)=> {
      const searchString = e.target.value

      if (searchString.length > 0){
        const searchData = userPosts.filter((eachTitle)=>eachTitle.title.toLowerCase().includes(searchString));
        setUserPosts(searchData);
      }
      else{
        setUserPosts(filteredData)
      }
      setQuery(searchString);
    }

    const handleDelete =(id)=>{
      const data =  userPosts.filter((eachPost) =>{
        return eachPost.id !== id
      });
      // console.log(data);
      setUserPosts(data);
    }

    const handleEdit = (id) => {
      setEditingPostId(id);
    }

    const handleUpdate = (e) => {
      e.preventDefault();
      setEditingPostId('');
    }

    const Edit = ({eachPost, userPosts, setUserPosts}) => {
      const handleInput = (e) => {
        const newUserPost = userPosts.map((list) => {
          return(list.id === eachPost.id ? {...list, name : e.target.value} : list)
        })
        setUserPosts(newUserPost)
      }
      const handleInputBody = (e) => {
        const newUserPost = userPosts.map((listObj) => {
          if(listObj.id === eachPost.id) {
            return {...listObj, body : e.target.value};
          }
          return listObj;
         // return(listObj.id === eachPost.id ? {...listObj, body : e.target.value} : listObj)
        })
        setUserPosts(newUserPost)
      }
      return(
        <div>
          <div>
           Title: <input type="text" name="name" 
            value={eachPost.title} 
            onChange={handleInput}/>
          </div>
          <div>
           Body:<textarea id="body" 
                name="body" 
                rows="4" 
                cols="100" 
                value={eachPost.body} 
                onChange={(e)=>handleInputBody(e)} 
                />
            {/* <textarea name="name" 
            style={{width: '50%' }} 
            value={eachPost.body} 
            
            onChange={handleInput}/> */}
          </div>
          <button type="submit">Update</button>
        </div>
      )
    }

  return (
    <div>
      <h2 className='header-title'>User Details</h2> <br />
      <ul>
      <li>Name: {location.state.userData.name}</li>
      <li>Email: {location.state.userData.email}</li>
      <li>Phone: {location.state.userData.phone}</li>
      
      </ul>
      <div className='header-section' 
           onClick={()=> setShowPostSection(!showPostSection) }>
         <div className='header-title'>User Posts</div>
         { showPostSection ?
         <div className='header-collapse-symbol'>-</div> :
         <div className='header-collapse-symbol'>+</div>
          }

      </div>

      {showPostSection ? 

      <div className='post-body'> 

      {postLoader ? <LoaderComp /> :
      <>
      <div className='search-post'>
        <input type="text" 
        // name="search" 
                value={query} 
                placeholder='search post here'
                onChange={handleSearch} />
      </div>
        
      <form onSubmit={handleUpdate}>
        {
          userPosts.length > 0 && userPosts.map((eachPost) => {

            return (
              <div>
                
                {editingPostId === eachPost.id ? <Edit eachPost = {eachPost} userPosts={userPosts} setUserPosts = {setUserPosts} /> :
                    <div 
                        key={eachPost.id} 
                        className='user-post'
                      //  style={{marginBottom:20, padding: 5 , cursor: 'pointer',backgroundColor: '#b3ffff'}} 
                        onClick={()=> handleCollapse(eachPost) }
                        >
                       <div>
                          <div className='post-title'>{eachPost.title} </div>
                          <div 
                            //style={{display: (showPost && collapsePostId === eachPost.id)? 'block' : 'none',  }}
                          >
                          <div>{eachPost.body}</div>
                          </div>
                        </div>

                        <div className='buttons-container'>
                            <div>
                              <button onClick={() => handleDelete(eachPost.id)}>Delete</button>
                            </div>
                            <div>
                              <button onClick={() => handleEdit(eachPost.id)}>Edit</button>
                            </div>
                        </div>
                        
                        </div>
                       }

                        <div 
                           className='post-comments-body'
                           style={{display: (showPost && collapsePostId === eachPost.id)? 'block' : 'none',  }}
                           >
                            {commentsLoader ? <LoaderComp /> :
                             <>
                          {
                            comments.length > 0 && comments.map((s) => {
                              return (
                                <div key={s.id}                        
                                     className='post-comment'
                                >
                                  <h5>{s.email}</h5>
                                    <div style={{ fontSize: 18}}>{s.name}</div>
                                    <div>{s.body}</div>
                                  </div>
                             )})
                          }
                          </>
                         }

                        </div>
                        
                    </div>
                
            )
           }) 
        }
       </form>
        </>
        }

        </div> : null 
        }

      <div>
      {/* <h2 className='header-title'>User Albums</h2> <br /> */}

      <div className='header-section' 
           onClick={()=> setShowAlbumSection(!showAlbumSection) }>
         <div className='header-title'>User Albums</div>
         { showAlbumSection ?
         <div className='header-collapse-symbol'>-</div> :
         <div className='header-collapse-symbol'>+</div>
          }

      </div>
      {showAlbumSection ? 

      <div className='post-body'> 

        {
          userAlbums.length > 0 && userAlbums.map((alb) => {
            return (
                    <div 
                        key={alb.id} 
                        className='user-post'
                      //  style={{marginBottom:20, padding: 5 , cursor: 'pointer',backgroundColor: '#b3ffff'}} 
                        onClick={()=> handleUserAlbum(alb) }>
                        <div className='post-title'>{alb.title} </div>
                        
                      {  (showAlbum && collapseAlbumId === alb.id) ?

                        <div 
                           className='photos-container'
                          // style={{display: 'grid'}}
                          //  style={{display: (showAlbum && collapseAlbumId === alb.id)? 'grid' : 'none',  }}
                           >
                         {photosLoader ? <LoaderComp /> :
                             <>
                              { photos.length > 0 && photos.map((s) => {
                                  return (
                                    <div key={s.id}                        
                                        className='post-comment'
                                    >
                                      <img
                                          alt="photo"
                                          src={s.thumbnailUrl}
                                        />
                                        <div style={{ fontSize: 18}}>{s.title}</div>
                                        <div>{s.body}</div>
                                      </div>
                                )})
                              }
                           </>
                         }

                        </div> : null }
                        
                    </div>
                
            )
           }) 
        }

        </div>: null 
        }


      </div>

      
    </div>
  )
}

export default UserDetails;