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
    parent_selector = selectors[store]["parent"]
    child_selectors = selectors[store]["child_selectors"]
    scraped_data = []

    driver.get(url)
    time.sleep(10)
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, parent_selector)
    for product_element in all_product_elements:
        product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors['name']).text
        product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors['price']).text
        result = {"name": product_name, "product type": product_type, "store": store, "price": product_price}
        scraped_data.append(result)

    return scraped_data


all_data = []

for product_type in urls:
    for store in urls[product_type]:
        data = scrape_url(store, product_type, urls[product_type][store])
        all_data += data

df = pd.DataFrame(all_data)
print(df)