function userId(){
    let param= new URLSearchParams(window.location.search) 
    let userId=param.get('id')
    return userId
}

function showUserInfo(){
    loader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId()}`).then(response=>{
        loader(false)
        console.log(response)
        let user=response.data.data
        document.getElementById("user-info").innerHTML=""
        email=" "
        if(user.email!=null){
            email=user.email
        }
        let content=`<div id="user-info">
      <div class="container">
          <div class="card mt-5 shadow">
              <h5 class="card-header">
                <div class="row">
                    <div class="col-2">
                      <img src="${user.profile_image}" alt="user photo" style="width: 120px;height:120px; border-radius:200px; cursor:pointer" onclick="showProfilePage(${user.id})">
                    </div> 
                    <div class="col-4  d-flex flex-column justify-content-evenly">
                       <div>${user.username}</div> 
                       <div>${user.name}</div>
                       <div>${email}</div>
                    </div>

                    <div class="col-4  d-flex flex-column justify-content-evenly" id="comment-post-count">
                        <div style="color: rgb(120, 121, 122); font-weight:100px"><span style="color: black; font-size:30px">${user.posts_count}</span> Posts</div>
                        
                        <div style="color: rgb(120, 121, 122); font-weight:100px"><span style="color: black; font-size:30px">${user.comments_count}</span> Comments</div>
                    </div>
                    </div>
              </h5>
            
        </div>
      </div>
  </div>`
          document.getElementById("user-info").innerHTML=content

    })
}


function getUserPosts(){
    let user=JSON.parse(localStorage.getItem("user"))
    document.getElementById('posts').innerHTML=""
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId()}/posts`).then(response=>{
        const posts=response.data.data;
        for(let post of posts){
            let author=post.author
            let title=""
            if(post.title!=null){
              title=post.title
            }
            let editBtn=``
            let deleteBtn=``
            let curr= user!=null&&user.id==author.id
            // let isUserPost=userId()==author.id
            if( curr){

                editBtn=`<button style="   border-radius: 8px;float: right;height: 50px;width: 80px;font-weight: bold; " class=" btn btn-outline-success mx-3"  data-bs-target="#edit-post-modal" data-bs-toggle="modal" id="edit-btn" onclick="updatePostClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
                deleteBtn=`<button style="   border-radius: 8px;float: right;height: 50px;width: 80px;font-weight: bold; " class=" btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#delete-modal" onclick="showDeleteModal(${post.id})" id="delete-btn" ">Delete</button>`
                     }
           
                let content=`
                <div class="container">
                    <div class="card mt-5">
                        <h5 class="card-header">
                             ${editBtn}${deleteBtn}
                           <img class="rounded-circle" src="${author.profile_image}" alt="user photo" style="width: 40px; height:40px ;cursor:pointer" onclick="showProfilePage(${author.id})">
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

function loader(load=true){
    let loading= document.getElementById("loader")
    if(load){
     loading.style.visibility="visible"
    }
    else{
     loading.style.visibility="hidden"
    }
 }
showUserInfo()
getUserPosts()