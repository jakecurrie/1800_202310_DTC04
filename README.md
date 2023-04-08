# SnowScraper

## 1. Project Description
  
This browser based web application is a web-scraping price aggreagator that allows users to find the best prices on winter essentials.
Link: https://snowscraper-7b189.web.app/

## 2. Names of Contributors

- Hello I am SeungJae
- Joanne 
- Hey my name is Jake and I'm here to change the world

## 3. Technologies and Resources Used

- HTML, CSS, JavaScript (jQuery 3.5.1)
- Bootstrap 5.0 (Frontend library)
- Firebase 8.0 (BAAS - Backend as a Service)
- Firestore
- Font Awesome 4.7 (icons)
- Google Material Icons (icons)
- Python 3.11.1
- Selenium 4.8.2
- Google Cloud Run

## 4. Complete setup/installion/usage

Visit us at: https://snowscraper-7b189.web.app/ to get started using our web app!

## 5. Known Bugs and Limitations

Here are some known bugs:

- When a user deselects a store filter, the combined results of the review filters do not update accordingly, even though some of the results are no longer relevant based on the deselected store filter. This bug also applies review filters. 

## 6. Features for Future

What we'd like to build in the future:

- a sorting functionality that allows users to browse products from low to high price
- add additional stores

## 7. Contents of Folder

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # sign up or log in page
├── products .html           # page for browsing products 
├── wishlist.html            # page where users view their saved products 
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /blah.jpg                # 
|
├── webscraper               # Folder containing webscraping script
    /Dockerfile              # dockerfile for building docker image of the webscraper
    /main.py                 # python script to scrape web pages
    /requirement.txt         # dependencies of the python script
|
├── scripts                  # Folder for scripts
    /get_products_type.js    # read/write product data from/to database 
    /home-page.js            # index.html functions 
    /login.js                # user login and authetication
    /products.js             # products page functions 
    /wishlist.js             # wishlist functions (pulling user's bookmarked items)
|
├── styles                   # Folder for styles
    /home-page.css           # stylesheet for index.html (originally named home-page.html)
    /login.css               # stylesheet for login.html
    /product.css             # stylesheet for products.html
    /wishlist.css            # stylesheet for wishlist.html



```
