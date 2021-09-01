const fetch = require('node-fetch');

let checkGetProducts = (token = "") => {
    return new Promise(async (resolve,reject) => {
        fetch('http://localhost:5000/products',{
            headers:{
                cookie: token
            }
        })
            .then(res => {
                if(res.status === 401){
                    resolve(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve(cookieString);
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let searchProductName = (token = "",search="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/products?search=${search}`,{
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 401){
                    resolve(false)
                }
                let json = await res.json()
                if(json.count != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve({cookieString, productId: json.data[0].product_id});
                }
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let searchProductNameShouldBeEmpty = (token = "",search="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/products?search=${search}`,{
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 401){
                    resolve(false)
                }
                let json = await res.json()
                if(json.count == 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let doRegister = () => {
    return new Promise(async (resolve,reject) => {
        let randomUserName = 'testUser'+ Math.floor(Math.random() * 100000)
        fetch(`http://localhost:5000/user?username=${randomUserName}&password=admin`,{
            method:'post',
        })
            .then(res => {
                if(res.status === 500 || res.status === 400 || res.status === 406){
                    resolve(false)
                }
                resolve(randomUserName);
            })
            .catch(e => {
                console.log(e)
                resolve(false)
            });
    })
}

let doLogin = (username) => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/user?username=${username}&password=admin`,{
            method:'get',
        })
            .then(res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve(cookieString);
            })
            .catch(e => {
                resolve(false)
            });
    })
}



let testNoLoginAccess = () => {
    return new Promise(async (resolve,reject) =>{
        let access = await checkGetProducts()
        if(access == false){
            resolve(true)
        }
        reject(false)
    })

}

let testRegisterAndLogin = () => {
    return new Promise(async (resolve,reject) =>{
        let username = await doRegister()
        let token = await doLogin(username)
        token = await checkGetProducts(token)
        resolve(token)
    })
}

let doAddToCart = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart?product_id=2&quantity=5&product_size=38`,{
            method:'post',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let doRemoveFromCart = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart?product_id=2&product_size=38`,{
            method:'delete',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length == 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let doCheckout = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/checkout`,{
            method:'post',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status == 200){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let doAddToWishlist = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/wishlist?product_id=2&product_size=38`,{
            method:'post',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let doRemoveFromWishlist = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/wishlist?product_id=2&product_size=38`,{
            method:'delete',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length == 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let doAdminAddProduct = (token="") => {
    return new Promise(async (resolve,reject) => {
        let randomProductName = 'test'+ Math.floor(Math.random() * 100000)
        fetch(`http://localhost:5000/admin/product/?product_name=${randomProductName}&product_price=555&product_picture=https://i.ebayimg.com/images/g/84kAAOSwGFNgbqtm/s-l1600.jpg&product_sizes=[42]`,{
            method:'post',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    reject(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve({cookieString: cookieString,randomProductName: randomProductName});
            })
            .catch(e => {
                reject(false)
            });
    })
}

let doAdminEditProduct = (token="",productId) => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/admin/product/?product_name=testAfterEdit${productId}&product_price=350&product_picture=""&product_sizes=[42,43,44]&product_id=${productId}`,{
            method:'patch',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    reject(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve({cookieString: cookieString,productId: productId});
            })
            .catch(e => {
                reject(false)
            });
    })
}

let doAdminDeleteProduct = (token="",productId) => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/admin/product/?product_id=${productId}`,{
            method:'delete',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    reject(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve(cookieString);
            })
            .catch(e => {
                reject(false)
            });
    })
}


let checkGetEvents = (token = "") => {
    return new Promise(async (resolve,reject) => {
        fetch('http://localhost:5000/admin/events',{
            headers:{
                cookie: token
            }
        })
            .then(res => {
                if(res.status === 401){
                    resolve(false)
                }
                let cookieString = res.headers.get('set-cookie')
                resolve(cookieString);
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let getWishlistNotEmpty = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/wishlist`,{
            method:'get',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let getWishlistEmpty = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/wishlist`,{
            method:'get',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length == 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let getCartNotEmpty = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart`,{
            method:'get',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.data.length != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}


let getCartEmpty = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart`,{
            method:'get',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.data.length == 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let getOrderHistoryNotEmpty = (token="") => {
    return new Promise(async (resolve,reject) => {
        fetch(`http://localhost:5000/cart/history?page=1`,{
            method:'get',
            headers:{
                cookie: token
            }
        })
            .then(async res => {
                if(res.status === 500 || res.status === 400){
                    resolve(false)
                }
                let json = await res.json()
                if(json.length != 0){
                    let cookieString = res.headers.get('set-cookie')
                    resolve(cookieString);
                }
                reject(false)
            })
            .catch(e => {
                resolve(false)
            });
    })
}

let testAddToCart = (token="") => {
    return new Promise(async (resolve,reject) =>{
        let newToken = await doAddToCart(token)
        newToken = await getCartNotEmpty(newToken)
        resolve(newToken)
    })
}

let testDeleteFromCart = (token="") => {
    return new Promise(async (resolve,reject) =>{
        let newToken = await doRemoveFromCart(token)
        resolve(newToken)
    })
}


let testCheckout = (token="") => {
    return new Promise(async (resolve,reject) =>{
        token = await doAddToCart(token)
        let newToken = await doCheckout(token)
        newToken = await getCartEmpty(newToken)
        newToken = await getOrderHistoryNotEmpty(newToken)

        resolve(newToken)
    })
}

let testWishlist = (token="") => {
    return new Promise(async (resolve,reject) =>{
        token = await doAddToWishlist(token)
        let newToken = await getWishlistNotEmpty(token)
        newToken = await doRemoveFromWishlist(newToken)
        newToken = await getWishlistEmpty(newToken)

        resolve(newToken)
    })
}

let testAdminAccess = (token="") => {
    return new Promise(async (resolve,reject) =>{
        result = await checkGetEvents()
        if(!result){
            let token = await doLogin('admin')
            token = await checkGetEvents(token)
            resolve(token)

        } else {
            reject(result)
        }
    })
}

let testAdminAddEditAndRemoveProduct = (token="") => {
    return new Promise(async (resolve,reject) =>{
        let result = await doAdminAddProduct(token)
        result = await searchProductName(result.cookieString,result.randomProductName)
        result = await doAdminEditProduct(result.cookieString,result.productId)
        result = await searchProductName(result.cookieString,'testAfterEdit'+result.productId)
        let newToken = await doAdminDeleteProduct(result.cookieString,result.productId)
        result = await searchProductNameShouldBeEmpty(newToken,'testAfterEdit'+result.productId)
        resolve(result)

    })
}

let runTests = async () => {
    try{
        await testNoLoginAccess();
        let token = await testRegisterAndLogin()
        token = await testAddToCart(token)
        token = await testDeleteFromCart(token)
        token = await testCheckout(token)
        token = await testWishlist(token)
        token = await testAdminAccess()
        token = await testAdminAddEditAndRemoveProduct(token)
        if(token != false){
            console.log('all tests passed')
        }

    } catch (e) {
        console.log(e)
    }

}

runTests()




