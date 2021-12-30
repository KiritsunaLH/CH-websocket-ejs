let {Server: SocketIO} = require("socket.io")
class Socket {
    static instance;
    constructor(http){
        if(Socket.instance){
            console.log(Socket.instance + 'Welcome');
            return Socket.instance;
        }
        Socket.instance = this;
        this.io = new SocketIO(http)
        this.msg = [];
        this.users = [];
        this.products =[];
    }
    init() {
        try {
            this.io.on('connection', socket =>{
                console.log('User Connected')
                socket.emit('init',this.msg)
                socket.emit('initProd',this.products)

                socket.on('message',data => {
                    this.msg.push(data)
                    this.io.sockets.emit('listenserver',this.msg)
                })
                socket.on('addUser',data => {
                    if (this.users.length > 0){
                        let verificationUser = false
                        this.users = this.users.map(user =>{
                            if(user.email == data.email){
                                verificationUser = true;
                                return{
                                    id: socket.id,
                                    ...data,
                                    active:true
                                }
                            }else{
                                return user;
                            }
                        })
                        if (!verificationUser){
                            this.users.push({
                                id: socket.id,
                                ...data,
                                active:true
                            })
                        }
                    } else{
                        this.users.push({
                            id: socket.id,
                            ...data,
                            active:true
                        })
                    }
                    this.io.sockets.emit('loadUsers',this.users)
                })
                socket.on("addProduct", data =>{
                    let same = false
                    console.log(data);
                    console.log(this.products);
                    if(this.products.length > 0) {         
                        this.products.push(
                        { id: this.products.length+1,
                                    ...data})
                    } else {
                        console.log('Less than 0 lentgth');
                        
                        this.products.push(
                        { id: this.products.length+1,
                                    ...data})
                        } 
                    this.io.sockets.emit("loadprod", this.products);
                })

                socket.on('disconnect',data => {
                    this.users = this.users.map(user =>{
                        if(user.id == socket.id){
                            delete user.active;
                            return {
                                ...user,
                                active: false
                            };
                        }else{
                            return user;
                        }
                    });
                    console.log("Disconencted", socket.id);
                    this.io.sockets.emit('loadUsers', this.users);
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = Socket