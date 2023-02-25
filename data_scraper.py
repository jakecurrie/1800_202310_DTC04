from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd

# Adjusting selenium settings to reduce script runtime
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("enable-automation")
options.add_argument("--disable-infobars")
options.add_argument("--disable-dev-shm-usage")

# Creating a dictionary to store urls for each product type at each store
urls = {
    "Shovels": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/snow-shovels-rakes-DC0001703.html",
        "Lowe's": "https://www.lowes.ca/dept/snow-shovels-snow-winter-essentials-outdoor-a1255?display=100&sort=ordernumber_i%3Adesc"},
    "Ice Melters": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/ice-melters-DC0001701.html",
        "Lowe's": "https://www.lowes.ca/dept/ice-melt-snow-winter-essentials-outdoor-a827?display=100&sort=ordernumber_i%3Adesc"}
    }

# Creating a dictionary to store class names used to identify and extract data for each website
selectors = {
    "Canadian Tire": {
        "parent": "[class='nl-product__content']", 
        "child_selectors": {
            "name": "[class='shiitake-children']", "price": "[class='nl-price--total']"}},
    "Lowe's": {
        "parent": "[class='plp-card-wrapper']",
        "child_selectors": {
            "name": "[class='styles__ProductTitle-RC__sc-od4z67-9 kTOEzK card-text']", "price": "[class='price-actual']"}}
    }

# Initializing the web browser to load web pages
driver = webdriver.Chrome(options=options)


def scrape_url(store, product_type, url):
    """
    Get data for all products on a webpage.

    :param store: name of the online store, as string
    :param product_type: category of product listed at url, as string
    :param url: address of webpage to scrape, as string
    :precondition: store must exactly match a store name in the urls and selectors dictionaries
    :precondition: product_type must exactly match a product type listed in the urls dictionary
    :precondition: url must exist in the urls dictionary
    :postcondition: scrapes website for data on all products listed at the url
    :return: list of dictionaries containing data for each product found
    """
    # getting the relevant css selectors from the selectors dictionary for the desired url
    parent_selector = selectors[store]["parent"]
    child_selectors = selectors[store]["child_selectors"]
    # creating an empty list to store all product data in
    scraped_data = []
    # instructing the web browser to load the url, then wait 10 seconds for page to fully load
    driver.get(url)
    time.sleep(10)
    # grabbing a list of product elements on the page that match the parent css selector. The parent css selector is the
    # class name associated with each individual product card on the website. Each selected element contains the html
    # code for a product card element and all of its child elements which contain the data we need
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, parent_selector)
    # looping through the list of product elements. For each product, we find the html elements in the product card
    # that have the class names of interest (listed in child_selectors dictionary) and extract their text or href values
    for product_element in all_product_elements:
        product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors['name']).text
        product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors['price']).text
        result = {"name": product_name, "product type": product_type, "store": store, "price": product_price}
        scraped_data.append(result)

    return scraped_data


all_data = []

for product_category in urls:
    for web_store in urls[product_category]:
        data = scrape_url(web_store, product_category, urls[product_category][web_store])
        all_data += data

df = pd.DataFrame(all_data)
print(df)