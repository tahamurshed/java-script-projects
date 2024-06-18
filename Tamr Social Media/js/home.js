let lastPage = 1;
let currentPage = 1;
const page = document.body.dataset.page;
let postIdForUpdateAndDelete;
let profileImageAndName=``
function currentUserID(){
    if(currentUser()){
        return currentUser().id
    }
    else{
        return null
    }
}
let userId=currentUser().id
if(page!="profile-page"&&page!="post-Details-page"){
    getPosts()
    pagination()
    setUi()
}

function pagination(){window.addEventListener("scroll",debounce(handleScroll,100));}
function handleScroll() {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  if (endOfPage && currentPage < lastPage) {
     currentPage++;
    getPosts(false, currentPage);
    console.log(endOfPage)
  }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
function currentUser(){
let user=JSON.parse(localStorage.getItem("user"))
if(user)
    return user
     return null   
}

function getPosts(reload=true,page=1){
if(reload)
   document.getElementById('posts').innerHTML=""
loader(true)
axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=15&&page=${page}`).then(response=>{
   loader(false)
const posts=response.data.data;
lastPage=response.data.meta.last_page
for(let post of posts){
    let user=currentUser()
    let author=post.author
    let title=""
    if(post.title!=null){
      title=post.title
    }
    let editBtn=``
    let deleteBtn=``
    let curr= user!=null&&user.id==author.id
    if( curr){
        
     editBtn=`<button style="   border-radius: 8px;float: right;height: 50px;width: 80px;font-weight: bold; " class=" btn btn-outline-success mx-3"  data-bs-target="#edit-post-modal" data-bs-toggle="modal" id="edit-btn" onclick="updatePostClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
     deleteBtn=`<button style="   border-radius: 8px;float: right;height: 50px;width: 80px;font-weight: bold; " class=" btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#delete-modal" onclick="showDeleteModal(${post.id})" id="delete-btn" ">Delete</button>`
    }
    
    let content=`
    <div class="container">
        <div class="card mt-5">
            <h5 class="card-header">
               ${deleteBtn} ${editBtn} 
               <img class="rounded-circle" src="${author.profile_image}" alt="user photo" style="width: 40px; height:40px ;cursor:pointer" onclick="showProfilePage(${author.id})">
                <span>${author.username}</span>
            </h5>
            <div class="card-body">
                <img class="w-100" src="${post.image}" alt="">
                <h6 style="color: rgb(146, 152, 157);" class="mt-3">${post.created_at}</h6>
                <h5>${title}</h5>
                <p style="cursor: pointer;" onclick="postDetailClicked(${post.id})">${post.body}</p>
                <hr>
            </div>
                <div class="footer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                      <span>(${post.comments_count})comments</span>
                        <button class="btn btn-sm rounded-5" style="background-color:grey" id="tags-${post.id}"></button>       
                </div>
      </div>
    </div>
        `
        tagId=`tags-${post.id}`
        document.getElementById('posts').innerHTML+=content;
 
       
        document.getElementById(tagId).innerHTML=""
        let tags=post.tags
        for(let tag of tags){
            document.getElementById(tagId).innerHTML+=tag.name
        }
      
       

        
}
})
}
function loginClicked(){

    let userName=document.getElementById('user-name').value
    let pass=document.getElementById('password').value
    let body={
          "username" : userName,
          "password" : pass

    }
   loader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login",body).then(respones=>{
        
        console.log(respones)
        let token=respones.data.token
        let user=respones.data.user
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user) )
   
        let modal=document.getElementById('login-modal')
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("logg in successfully")
        console.log(user.username)


setUi()
    }).catch(error=>{
        let message=error.response.data.message
        showAlert(message,"danger")


    }).finally(()=>{
        loader(false)
    })
}
function registerClicked(){
    loader(true)
    let userName=document.getElementById('register-user-name').value
    let pass=document.getElementById('register-password').value
    let name=document.getElementById('register-name').value
    let profile_image=document.getElementById('profile_image').files[0]
    let formData=new FormData()
    formData.append("name",name)
    formData.append("username",userName)
    formData.append("password",pass)
    formData.append("image",profile_image)

    let headers={
        "Content-Type":"application/multipart/form-data"
    }
  
    axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
        headers:headers
    }).then(respones=>{
        console.log(respones)
        let token=respones.data.token
        let user=respones.data.user
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user))

        let modal=document.getElementById('register-modal')
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("created new user successfully")
        setUi()
        

    }).catch(error=>{
        let message=error.response.data.message
        showAlert(message,"danger")
    }).finally(()=>{
        loader(false)
    })
}

function createPostClicked(){
    loader(true)
    let title=document.getElementById('post-title').value
    let body=document.getElementById('post-body').value
    let image=document.getElementById('post-image').files[0]
    // let image=document.getElementById('register-image').files[0]
    let formData=new FormData()
    formData.append("title",title)
    formData.append("body",body)
    formData.append("image",image)
   let token=localStorage.getItem("token")
    let headers={
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/multipart/form-data"
    }
   
    axios.post("https://tarmeezacademy.com/api/v1/posts",formData,{
        headers:headers
    }).then(respones=>{
        console.log(respones)
        let modal=document.getElementById('create-post-modal')
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("created new post successfully")

        

  }).catch(error=>{
    let message=error.response.data.message
    showAlert(message,"danger")
  }).finally(()=>{
    loader(false)
  })
}



function setUi(){


    let user=JSON.parse(localStorage.getItem("user" )) 
    let token=localStorage.getItem("token")
    let loginDiv=document.getElementById('loggingDiv')
    let logOutDiv=document.getElementById('logOutDiv')
    let createPostBtn=document.getElementById('add-post-btn')
    // let addComment=document.getElementById("card-comments")
            
  
  if(token==null){
    loginDiv.style.setProperty("display","flex","important")
    logOutDiv.style.setProperty("display","none","important")
    createPostBtn.style.setProperty("display","none","important")


  }
  else{
    loginDiv.style.setProperty("display","none","important")
    logOutDiv.style.setProperty("display","flex","important")
    createPostBtn.style.setProperty("display","flex","important")

  
    let content=` <img src="${user.profile_image}" alt="user image" height="40px" width="40px;" style="cursor:pointer" class="rounded-circle d-inline-block;" onclick="showProfilePage()">
    <b class="mx-1" id="user-name-b">${user.username}</b>
    <button type="button" class="btn btn-outline-danger " id="logOut" onclick="logOut()" data-bs-toggle="modal" data-bs-target="#logout-modal">LogOut</button>`
    logOutDiv.innerHTML=content
   

  }


}

function logOut(){
    localStorage.clear()
    setUi()
    let modal=document.getElementById('logout-modal')
    let modalInstance=bootstrap.Modal.getInstance(modal)
    modalInstance.hide()

}

function showAlert(message,type='success'){
    const alertPlaceholder = document.getElementById('div-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
    alertPlaceholder.append(wrapper)
    }
        appendAlert(message, type)
    }

function  postDetailClicked(postId){
    window.location=`../postDetails.html?postid=${postId}`
    console.log(postId)
  }

function updatePostClicked(postObj){
    let post=JSON.parse(decodeURIComponent(postObj))
    document.getElementById('edit-post-title').value=post.title
    document.getElementById("edit-post-body").value=post.body
    postIdForUpdateAndDelete=post.id
  }
 

  function updatePost(){
    loader(true)
    let title=document.getElementById('edit-post-title').value
    let body=document.getElementById('edit-post-body').value
    let image=document.getElementById('edit-post-image').files[0]
    // let image=document.getElementById('register-image').files[0]
    let formData=new FormData()
    formData.append("title",title)
    formData.append("body",body)
    formData.append("image",image)
    let token=localStorage.getItem("token")
    let headers={
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/multipart/form-data"
    }
    formData.append("_method","put")
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${postIdForUpdateAndDelete}`,formData,{
        headers:headers
    }).then(respones=>{
        console.log(respones)
        let modal=document.getElementById('edit-post-modal')
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("created new post successfully")
  }).catch(error=>{
    let message=error.response.data.message
    showAlert(message,"danger")
  }).finally(()=>{
    loader(false)
  })
}

function showDeleteModal(id){
   postIdForUpdateAndDelete=id
        }
function deletePostClicked(){
 console.log(postIdForUpdateAndDelete)
    let token=localStorage.getItem("token")
    let headers={
        "Authorization":`Bearer ${token}`,
        "Accept":"application/json"
    }
   axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postIdForUpdateAndDelete}}`,{
   headers:headers
}).then(response=>{
        let modal=document.getElementById('delete-modal')
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("Delete it successfully")
   })

}


function showProfilePage(id=currentUserID()){
   
    if(id){
         window.location=`userProfile.html?id=${id}`
        
    }
    else{
        showAlert("you must login before","danger")
    }
}
setUi()


function loader(load=true){
   let loading= document.getElementById("loader")
   if(load){
    loading.style.visibility="visible"
   }
   else{
    loading.style.visibility="hidden"
   }
}



  

