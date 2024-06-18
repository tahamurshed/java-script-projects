
function postId(){
    let param= new URLSearchParams(window.location.search) 
    let postId=param.get('postid')
    return postId
}
function getPostById(){
  loader(true)
    document.getElementById('post').innerHTML=""
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId()}`).then(response=>{
        loader(false)
        let post=response.data.data
        let author=response.data.data.author
        let comments=response.data.data.comments
        let title=""
         if(post.title!=null){
            title=post.title
         }
    console.log(post)

    let content=`
    <div class="container">
        <div class="card mt-5">
            <h5 class="card-header">
                <img class="rounded-circle" src="${author.profile_image}" alt="user photo" style="width: 40px; height:40px ; cursor:pointer;" onclick="showProfilePage(${author.id})">
                <span>${author.username}</span>
            </h5>
            <div class="card-body">
                <img class="w-100" src="${post.image}" alt="">
                <h6 style="color: rgb(146, 152, 157);" class="mt-3">${post.created_at}</h6>
                <h5>${title}</h5>
                <p style="cursor: pointer;" onclick="postDetailClicked(${post.id})">${post.body}</p>
                <hr>
                <div class="footer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                      <span>(${post.comments_count})comments</span>
                      
                        <button class="btn btn-sm rounded-5" style="background-color:grey" id="tags-${post.id}">
                        
                        </button>
                        <div  id='card-comments' class="card-comments w-100 "  >
                        
                        </div>

                </div>

      </div>
    </div>

        `



       let tagId=`tags-${post.id}`
        document.getElementById('post').innerHTML=content;
        document.getElementById(tagId).innerHTML=""
        let tags=post.tags
        for(let tag of tags){
            document.getElementById(tagId).innerHTML+=tag.name
        }
        for(let comment of comments ){

            let commentContent=` <h5 class="card-header">
                        <img class="rounded-circle" src="${comment.author.profile_image}" alt="user photo" style="width: 40px; height:40px">
                        <span>${comment.author.username}</span>
                    </h5>

                    <div class="card-body">
        
                        <p   >${comment.body}</p>
                        `
                        document.getElementById('card-comments').innerHTML+=commentContent
        
        }
        // let addComment=`  <div id="add-comment" class="form-group ">
                         
        //                  <input type="text" name="" id="comment-input" class="" placeholder="add your comment here" style="width:90%; height:90px" >
        //                  <button class="btn  btn-outline-primary d-inline" type="button" onclick="addCommentClicked()">send</button>
        //                </div>`

        //  document.getElementById('card-comments').innerHTML+=addComment
         
})

}
getPostById()    

function addCommentClicked(){
    let token=localStorage.getItem("token")
    commentBody=document.getElementById('comment-input').value 
    let params={
        "body":commentBody
    }
    let headers={
        "Authorization":`Bearer ${token}`,
        'Accept':"application/json"
    }
axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId()}/comments`,params,{
    headers:headers
}).then(respones=>{
console.log(respones)
commentBody=document.getElementById('comment-input').value=""
getPostById()
})

   }

setUi()


function setUi(){


    let user=JSON.parse(localStorage.getItem("user" )) 

    let token=localStorage.getItem("token")
    let loginDiv=document.getElementById('loggingDiv')
    let logOutDiv=document.getElementById('logOutDiv')
    let createPostBtn=document.getElementById('add-post-btn')
    let addComment=document.getElementById("add-comment")
  if(token==null){
    loginDiv.style.setProperty("display","flex","important")
    logOutDiv.style.setProperty("display","none","important")
    createPostBtn.style.setProperty("display","none","important")
   if(addComment!=null)
    addComment.style.setProperty("display","none","important")
    
  }
  else{
    loginDiv.style.setProperty("display","none","important")
    logOutDiv.style.setProperty("display","flex","important")
    createPostBtn.style.setProperty("display","flex","important")
    if(addComment!=null)
        addComment.style.setProperty("display","flex","important")
  
 let content=` <img src="${user.profile_image}" alt="user image" height="40px" width="40px" class="rounded-circle d-inline-block">
<b class="mx-1" id="user-name-b">${user.username}</b>
<button type="button" class="btn btn-outline-danger " id="logOut" onclick="logOut()">LogOut</button>`
logOutDiv.innerHTML=content
   

  }


}
function loader(load=true){
    let loading= document.getElementById("loader")
    if(load){
     loading.style.visibility="visible"
    }
    else{
     loading.style.visibility="hidden"
    }
 }


  