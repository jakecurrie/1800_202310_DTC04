# Project Title

## 1. Project Description

State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser based web application is a web-scraping price aggreagator that allows users to find the best prices on winter essentials.

## 2. Names of Contributors
List team members and/or short bio's here...

- Hello I am SeungJae and I am excited because I was told to write why I am
- Joanne Ho
- Hey my name is Jake and I'm here to change the world

## 3. Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript (jQuery 3.5.1)
- Bootstrap 5.0 (Frontend library)
- Firebase 8.0 (BAAS - Backend as a Service)
- Font Awesome 4.7 (icons)
- Google Material Icons (icons)
- Python 3.11.1
- Selenium 4.8.2
- Google Cloud Run

## 4. Complete setup/installion/usage

State what a user needs to do when they come to your project. How do others start using your code or application?
Here are the steps ...

- ...
- ...
- ...

## 5. Known Bugs and Limitations

Here are some known bugs:

- When a user deselects a store filter, the combined results of the review filters do not update accordingly, even though some of the results are no longer relevant based on the deselected store filter. This bug also applies review filters. 
- ...
- ...

## 6. Features for Future

What we'd like to build in the future:

- a sorting functionality that allows users to browse products from low to high price
- add additional stores
- ...

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
    /authetication.js        # user login and authetication
    /get_products_type.js    # read/write product data from/to database 
    /products.js             # products page functions 
    /home-page.js            #
    /wishlist.js             #
|
├── styles                   # Folder for styles
    /home-page.css           #
    /login.css               #
    /home-page.css           #
    /product.css             # stylesheet for products.html
    /wishlist.css            #



```
