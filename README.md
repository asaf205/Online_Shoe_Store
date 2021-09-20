# Online Shoe Store

Store name:  
Walkies

What are you selling?  
Shoes

Additional pages? How to operate it?  
Page (1):  
Order history operate it: After the customer makes an order (checkout), the order details will appear on this page.  
Page (2):  
Wishlist operate it: The customer can add a product he likes, this product will appear after pressing the heart-shaped button.
This button is in disabled mode as long as the appropriate shoe size is not selected
Page (3):  
Admin product management operate it: On this page the admin can perform actions like delete a product / update a product, create a new product.  
Page (4):  
Admin new product /edit product operate it: On these pages the admin can perform the action of adding or updating a product. So by filling out the product form and submitting, the product will appear in the store.  

## Specify all the different routes your app supports:
http://localhost:3000/signup -   signup page.  
http://localhost:3000/login  -   login page.  
http://localhost:3000/logout  -  logout route, leads to login page after logout.  
http://localhost:3000/store  -   main store page , only if logged in, can send products to wishlist and cart.    
http://localhost:3000/cart   -   cart page, shows the user cart. can remove products from cart and can move to checkout page from here.  
http://localhost:3000/wish_list   -   wishlist page, shows the user wishlist.  
http://localhost:3000/checkout   -   can see the cart , and there is a button to perform checkout that empties the cart and moves the order to order history.  
http://localhost:3000/admin   -   only if logged in as admin, see all events on the site. also, there is a button for product management page.  
http://localhost:3000/admin/productManagement   -   only if logged in as admin, see all products on the site. can search and delete products from this page and move to relevant edit page or new product page.  
http://localhost:3000/admin/productManagement/edit/:id   -   only if logged in as admin, edit the product. the form has prefilled data from the product.  
http://localhost:3000/admin/productManagement/new   -   only if logged in as admin, create a new product.  
