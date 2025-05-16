import React from 'react'
import './postCard.css'
import commentIcon from '../../assets/icons/comentario.png'


interface PostData{
  userName: string;
  text: string;
  /*imgPost: string ;*/
}

const PostCard: React.FC<PostData> = ({userName , text}) => {
  

  return (
    <div className='post-container'>
        <div className='post-header'>
          <span className="user-name">{userName} </span>
        </div>
        <div className='post-content'>
          <span className='text-content'>
            {text}
          </span>
          <img alt='imagen post' src= '' />
        </div>
        <div className='post-footer'>        
        <img src={commentIcon} height={30} width={30}/>
        <input className='comment' type="text" name="comment" id="comment" placeholder="Comenta"  />
        </div>
    </div>
  )
}

export default PostCard