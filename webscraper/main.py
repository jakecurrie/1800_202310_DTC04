from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.common import exceptions
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
import time
import re
from google.cloud import firestore

# Adjusting selenium settings to reduce script runtime and ensure compatability with google cloud run
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("window-size=1024,768")

# Selenium will not work for some websites, for these we will use httpx to send http requests and beautifulsoup to parse through the resulting html code fetched using httpx to extract the relevant data. For this to work, we will use common browser headers which make our web traffic appear as if it is from a human instead of from an automated script. These headers will be passed as an argument while using the get method from the httpx module.
headers = {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0"}

# Creating a dictionary to store urls for each product type at each store
urls = {
    "Shovels": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/snow-shovels-rakes-DC0001703.html",
        "Lowe's": "https://www.lowes.ca/dept/snow-shovels-snow-winter-essentials-outdoor-a1255?display=100&sort=ordernumber_i%3Adesc",
        "Rona": "https://www.rona.ca/en/outdoor/snow-and-ice-removal/snow-shovels",
        "Amazon": "https://www.amazon.ca/s?k=snow+shovel&rh=n%3A6257556011%2Cn%3A6257566011&dc&ds=v1%3AULsMxGplZxB8A7DWeQ6A6cs5WQyRS2%2F%2FgXBVsbWmUy8&crid=1EC4WOVPJ9290&qid=1680487724&rnid=5264023011&sprefix=snow+shovel%2Caps%2C216&ref=sr_nr_n_2"},
    "Ice Melters": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/ice-melters-DC0001701.html",
        "Lowe's": "https://www.lowes.ca/dept/ice-melt-snow-winter-essentials-outdoor-a827?display=100&sort=ordernumber_i%3Adesc",
        "Rona": "https://www.rona.ca/en/outdoor/snow-and-ice-removal/ice-melters-and-salt",
        "Amazon": "https://www.amazon.ca/s?k=ice+melters&rh=n%3A6257557011%2Cn%3A6257560011&dc&ds=v1%3AAQse30LEcvWcjEFRww4bfg0yRekNJ2WJhVkFOpRf8b4&crid=1YKL8JLU3DO49&qid=1680580760&rnid=5264023011&sprefix=ice+melter%2Caps%2C146&ref=sr_nr_n_2"},
    "Heaters": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/home-pets/heating-cooling-air-quality/heaters-DC0000829.html",
        "Lowe's": "https://www.lowes.ca/dept/portable-space-heaters-heaters-heating-cooling-a1100?display=24&sort=ordernumber_i%3Adesc&query=*%3A*",
        "Rona": "https://www.rona.ca/en/heating-cooling-and-ventilation/heating/portable-heaters",
        "Amazon": "https://www.amazon.ca/s?k=space+heaters&rh=n%3A2224065011&dc&ds=v1%3A1FRxsRjbu0OOfYTIEqL8zNqDKdrNHI69MX4K2d85It0&qid=1680580813&rnid=5264023011&ref=sr_nr_n_1"},
    "Snow Brushes & Ice Scrapers": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/snow-brushes-ice-scrapers-DC0001698.html",
        "Lowe's": "https://www.lowes.ca/dept/ice-scrapers-snow-winter-essentials-outdoor-a828?display=24&sort=ordernumber_i%3Adesc&query=*%3A*",
        "Amazon": "https://www.amazon.ca/s?k=ice+scrapers&rh=n%3A6303829011&dc&ds=v1%3AuroBBGbnIuRI%2FdSqRAARCXQhrlhYmx6JGVJSN%2FWCZjA&qid=1680581003&rnid=5264023011&ref=sr_nr_n_1"},
    "Gloves & Hand Warmers": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/toys-sports-recreation/clothing-shoes-accessories/hats-gloves-accessories/gloves-mittens-hand-warmers-DC0002229.html?page=1",
        "Amazon": "https://www.amazon.ca/s?k=winter+gloves&crid=2WI57N09YVOCT&sprefix=winter+gloves%2Caps%2C228&ref=nb_sb_noss_1"},
    "Tire Chains": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tire-wheel-accessories/tire-chains-DC0000425.html",
        "Amazon": "https://www.amazon.ca/s?k=tire+chains&rh=n%3A7420868011&dc&ds=v1%3AMKMX5ULMx1Jc62h83%2FmiAWj0WkE0hd4BpMFbglYvBiE&crid=19XO7D7MFOB4H&qid=1680584281&rnid=5264023011&sprefix=tire+chains%2Caps%2C250&ref=sr_nr_n_1"}
    }

# Creating a dictionary to store class names used to identify and extract data for each website
selectors = {
    "Canadian Tire": {
        "parent": "[class='nl-product__content']", 
        "child_selectors": {
            "name": "[class='shiitake-children']", 
            "price": "[class='nl-price--total']",
            "rating": "[class='bv_text']",
            "product_url": "[class='nl-product-card__no-button']",
            "image_url": "img"}},
    "Lowe's": {
        "parent": "[class='plp-card-wrapper']",
        "child_selectors": {
            "name": "[class='styles__ProductTitle-RC__sc-od4z67-9 kTOEzK card-text']", 
            "price": "[class='price-actual']",
            "rating": "[class='styles__RatingAnchor-RC__sc-xgzn8s-1 CAZhS']",
            "product_url": "[class='styles__Anchor-RC__sc-od4z67-8 iZqswa']",
            "image_url": "[class='styles__Image-RC__sc-od4z67-13 bcOZKh']"}},
    "Rona": {
        "parent": "[class='product-tile js-product-tile']",
        "child_selectors": {
            "name": "[class='product-tile__title productLink']", 
            "price": "[class='price-box__price__amount__integer']",
            "rating": "[class='bv-rating-average']",
            "product_url": "[class='product-tile__title productLink']",
            "image_url": "[class='product-tile__image']"}},
    "Amazon": {
        "parent": "div.s-card-container",
        "child_selectors": {
            "name": "a.a-text-normal",
            "price": "[class='a-price-whole']",
            "rating": "[class='a-size-base']",
            "product_url": "a.a-link-normal",
            "image_url": "[class='s-image']"}}
        }

decimal_price_selectors = {
    "Amazon": "[class='a-price-fraction']",
    "Rona": "[class='price-box__price__amount__decimal']"
}

# Initializing the chrome web browser to load web pages with selenium
#service = FirefoxService(executable_path=GeckoDriverManager().install())
driver = webdriver.Firefox(options=options)


def default_scraper(store, product_type, url):
    driver.get(url)
    time.sleep(10)
    data = []
    css_selectors = selectors[store]
    child_selectors = css_selectors["child_selectors"]
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, css_selectors["parent"])
    for product_element in all_product_elements:
        try:
            product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors["name"]).text
            product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors["price"]).text
            if store in ["Amazon", "Rona"]:
                decimal_price = product_element.find_element(By.CSS_SELECTOR, decimal_price_selectors[store]).text
                product_price += f".{decimal_price}" 
            product_rating = product_element.find_element(By.CSS_SELECTOR, child_selectors["rating"]).text
            product_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["product_url"]).get_attribute('href')
            image_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["image_url"]).get_attribute('src')
        except exceptions.NoSuchElementException:
            print(f"Element Error, Store: {store} Product Type: {product_type}")
            del product_element
        except exceptions.InvalidSelectorException:
            print("Just amazon being amazon")
            del product_element
        else:
             result = {"product_name": product_name, "product_type": product_type, "store": store, "price": product_price, "rating": product_rating,
                    "product_url": product_url, "image_url": image_url}
             data.append(result)
    return data


def scrape_can_tire(store, product_type, url):
    driver.get(url)
    time.sleep(10)
    data = []
    css_selectors = selectors[store]
    child_selectors = css_selectors["child_selectors"]
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, css_selectors["parent"])
    for product_element in all_product_elements:
        try:
            product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors["name"]).text
            product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors["price"]).text
            product_rating = product_element.find_element(By.CSS_SELECTOR, child_selectors["rating"]).text
            product_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["product_url"]).get_attribute('href')
            image_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["image_url"]).get_attribute('data-src')
        except exceptions.NoSuchElementException:
            print(f"Element Error, Store: {store} Product Type: {product_type}")
            del product_element
        else:
             result = {"product_name": product_name, "product_type": product_type, "store": store, "price": product_price, "rating": product_rating,
                    "product_url": product_url, "image_url": image_url}
             data.append(result)
    return data


def scrape_sportcheck(store, product_type, url):
    driver.get(url)
    time.sleep(10)
    data = []
    css_selectors = selectors[store]
    child_selectors = css_selectors["child_selectors"]
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, css_selectors["parent"])
    for product_element in all_product_elements:
        try:
            product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors["name"]).text
            product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors["price"]).get_attribute('innerText')
            product_rating = product_element.find_element(By.CSS_SELECTOR, child_selectors["rating"]).get_attribute('style')
            product_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["product_url"]).get_attribute('href')
            image_url = product_element.find_element(By.CSS_SELECTOR, child_selectors["image_url"]).get_attribute('src')
        except exceptions.NoSuchElementException:
            print(f"Element Error, Store: {store} Product Type: {product_type}")
            del product_element
        else:
             result = {"product_name": product_name, "product_type": product_type, "store": store, "price": product_price, "rating": product_rating,
                    "product_url": product_url, "image_url": image_url}
             data.append(result)
    return data


def select_scraper(store, product_type, url):
    function_dict = {
        "Amazon": default_scraper,
        "Rona": default_scraper,
        "Lowe's": default_scraper,
        "Canadian Tire": scrape_can_tire,
        "SportChek": scrape_sportcheck
    }
    scrape_function = function_dict[store]
    return scrape_function(store, product_type, url)
            

def can_tire_image_fix(product_data):
    """
    Remove everything after ".png" in image_urls.
    """
    if product_data["store"] == "Canadian Tire":
        match = re.search(r'^(.*\.png)', product_data['image_url'])
        if match:
            product_data['image_url'] = match.group(1)


def remove_dollar_sign(product_data):
    """
    Strip any dollar signs from price data.
    """
    if "$" in product_data['price']:
        product_data['price'] = product_data['price'].replace("$", "")


def convert_sportchek_review_rating(product_data):
    if product_data["store"] == "SportChek":
        match = re.search(r'(\d+)', product_data['rating'])
        if match:
            product_data['rating'] = match.group(1)


def clean_data(product_data):
    """
    Run all data cleaning functions on dataset.
    """
    can_tire_image_fix(product_data)
    remove_dollar_sign(product_data)
    convert_sportchek_review_rating(product_data)

def webscraper():
    all_data = []
    
    # Collect all data from web stores
    for product_category in urls:
        for web_store in urls[product_category]:
            data = select_scraper(web_store, product_category, urls[product_category][web_store])
            all_data += data

    # Clean the data
    for prod in all_data:
        try:
            clean_data(prod)
        except Exception as e:
            print(e)
            print(f"Data cleaning issue: {prod}")

    return all_data


def update_firestore():
    all_data = webscraper()
    db = firestore.Client()
    batch = db.batch()

    # Update or delete existing documents and add new documents
    for doc_data in all_data:
        # Check if there is an existing document with a matching "field" value
        query = db.collection("products").where("product_url", "==", doc_data["product_url"])
        docs = query.get()

        if len(docs) > 0:
            # Update the existing document
            doc_ref = docs[0].reference
            batch.update(doc_ref, doc_data)
        else:
            # Add a new document
            doc_ref = db.collection("products").document()
            batch.set(doc_ref, doc_data)

        # Delete documents that do not match
        for doc in docs:
            if doc.id != doc_ref.id:
                batch.delete(doc.reference)

    batch.commit()


def main():
    update_firestore()
    

if __name__ == "__main__":
    main()