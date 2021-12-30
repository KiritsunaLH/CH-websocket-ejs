let user = null
let socket = null;
let input = document.geteById('inputtext')
let paragraph = document.geteById('textContainer')
let button = document.geteById('sendmsg')
let formDataUser = document.geteById('dataUser')
let userList = document.geteById("userList");
let chatContainer = document.geteById('chatContainer')


    formDataUser.addEventListener('submit', e=>{
        e.preventDefault();
        user={
            name:e.target[0].value,
            email:e.target[1].value,
        }
        if(user.name == '' || user.email ==''){
            window.location.reload()
        } else
        socket = io();
        socket.emit('addUser', user)
        chatContainer.classList = 'active'
        readSockets()
    })
    function readSockets(){
            loadChat()
            
            socket.on('listenserver', data =>{
                console.log('Recieving... ',data);
                let inner = ''
                data.forEach(e => {
                    inner += `<div><b>${e.name}:</b> ${e.msg}</div> </br>`
                });
                paragraph.innerHTML = inner;
            })
            
    }
    function loadChat(){
        socket.on('init', data =>{
            let inner = ''
            data.forEach(e => {
            inner += `<div><b>${e.name}:</b> ${e.msg}</div> </br>`
            });
            paragraph.innerHTML = inner;
        })

        socket.on('loadUsers', data =>{
            console.log('New user');
            let inner = ``;
            data.forEach(e => {
                let status = e.active ? "(connected)" : "(disconnected)";
                inner += `<li><b>${e.name}:</b> ${status}</li>`;
            });
            userList.innerHTML = inner;
        })

        socket.on('initProd', data =>{
            let inner = ''
            data.forEach(e => {
                inner += `
                    <thead>
                        <th scope="row">${e.id}</th>
                        <td> ${e.name}</td>
                        <td>$${e.price}</td>
                        <td><img src="${e.image}" class="img-thumbnail" style="width:50px, height:50px;" alt="Photo"></td>
                    </thead>`
            });
            prodList.innerHTML = inner;
        })
    }

    button.addEventListener('click', e =>{
        let sendMessage = {
            ...user,
            msg: input.value
        }
        socket.emit('message', sendMessage)
        input.value = ''
    })
//Add Products
    let prodData = document.geteById('dataProds')
    let prodList = document.geteById('prodList')

    prodData.addEventListener('submit', e=>{
        e.preventDefault();
        product={
            name:e.target[0].value,
            price:e.target[1].value,
            image: e.target[2]
        }
        if(product.name == '' || product.price =='' || product.image ==''){
            window.location.reload()
        } else
        socket.emit('addProduct', product)
        loadProds()
    })

    function loadProds(){
        socket.on('loadprod', data =>{
            console.log('Product... ',data);
            let inner = ''
            data.forEach(e => {
                inner += `
                    <thead>
                        <th scope="row">${e.id}</th>
                        <td> ${e.name}</td>
                        <td>$${e.price}</td>
                        <td><img src="${e.image}" class="img-thumbnail" style="width:50px, height:50px;" alt="Photo"></td>
                    <thead>`             
            });
            console.log(inner);
            prodList.innerHTML = inner;
            inner=''
        })
    }