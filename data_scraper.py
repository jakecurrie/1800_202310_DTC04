from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
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
    "shovel": {
    "canadian tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/snow-shovels-rakes-DC0001703.html"}}

# Creating a dictionary to store class names used to identify and extract data for each website
selectors = {
    "canadian tire": {
    "parent": "[class='nl-product__content']", 
    "child_selectors": {"name": "[class='shiitake-children']", "price": "[class='nl-price--total']"}}}

# Initializing the web browser to load web pages
driver = webdriver.Chrome(options=options)

def scrape_url(store, product_type, url):
    parent_selector = selectors[store]["parent"]
    child_selectors = selectors[store]["child_selectors"]
    scraped_data = []

    driver.get(url)
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
        all_data.append(data)

df = pd.DataFrame(all_data[0])
print(df)