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
        "Rona": "https://www.rona.ca/en/outdoor/snow-and-ice-removal/snow-shovels"},
    "Ice Melters": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/ice-melters-DC0001701.html",
        "Lowe's": "https://www.lowes.ca/dept/ice-melt-snow-winter-essentials-outdoor-a827?display=100&sort=ordernumber_i%3Adesc",
        "Rona": "https://www.rona.ca/en/outdoor/snow-and-ice-removal/ice-melters-and-salt"},
    "Heaters": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/home-pets/heating-cooling-air-quality/heaters-DC0000829.html",
        "Lowe's": "https://www.lowes.ca/dept/portable-space-heaters-heaters-heating-cooling-a1100?display=24&sort=ordernumber_i%3Adesc&query=*%3A*",
        "Rona": "https://www.rona.ca/en/heating-cooling-and-ventilation/heating/portable-heaters"},
    "Snow Brushes & Ice Scrapers": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/outdoor-living/snow-removal-equipment-tools/snow-brushes-ice-scrapers-DC0001698.html",
        "Lowe's": "https://www.lowes.ca/dept/ice-scrapers-snow-winter-essentials-outdoor-a828?display=24&sort=ordernumber_i%3Adesc&query=*%3A*"},
    "Gloves & Hand Warmers": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/toys-sports-recreation/clothing-shoes-accessories/hats-gloves-accessories/gloves-mittens-hand-warmers-DC0002229.html?page=1",
        "SportChek": "https://www.sportchek.ca/categories/men/accessories/winter/gloves-mitts.html?preselectedBrandsNumber=0;preselectedCategoriesNumber=4;q1=men%3A%3Aaccessories%3A%3Awinter-accessories%3A%3Agloves-mittens;x1=ast-id-level-4;page=1"},
    "Tire Chains": {
        "Canadian Tire": "https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tire-wheel-accessories/tire-chains-DC0000425.html"}
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
            "image_url": "[class='product-tile__image']"}
        },
    "SportChek": {
        "parent": "[class='product-grid__list-item-content']",
        "child_selectors": {
            "name": "[class='product-title-text']",
            "price": "[class='product-price-text ']",
            "rating": "[class='rating__value']",
            "product_url": "[class='product-grid__link']",
            "image_url": "img"}
        },
    "Amazon": {
        "parent": "[class='a-section']",
        "child_selectors": {
            "name": "a[class='a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal'] > span']",
            "price": "[class='a-price-whole']",
            "rating": "[class='a-size-base']",
            "product_url": "[class='a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal']",
            "image_url": "[class='s-image']"
        }
    }
}


# Initializing the chrome web browser to load web pages with selenium
#service = FirefoxService(executable_path=GeckoDriverManager().install())
driver = webdriver.Firefox(options=options)


def scrape_sportcheck(store, product_type, url):
    driver.get(url)
    data = []
    css_selectors = selectors["SportChek"]
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
            print(f"Element Error, Store: SportChek")
            del product_element
        else:
             result = {"product_name": product_name, "product_type": product_type, "store": store, "price": product_price, "rating": product_rating,
                    "product_url": product_url, "image_url": image_url}
             data.append(result)
    return data
            


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
    # instructing the web browser to load the url, then wait 15 seconds for page to fully load
    driver.get(url)
    time.sleep(15)
    # grabbing a list of product elements on the page that match the parent css selector. The parent css selector is the
    # class name associated with each individual product card on the website. Each selected element contains the html
    # code for a product card element and all of its child elements which contain the data we need
    all_product_elements = driver.find_elements(By.CSS_SELECTOR, parent_selector)
    # looping through the list of product elements. For each product, we find the html elements in the product card
    # that have the class names of interest (listed in child_selectors dictionary) and extract their text or href values
    for product_element in all_product_elements:
        try:
            product_name = product_element.find_element(By.CSS_SELECTOR, child_selectors['name']).text
            product_price = product_element.find_element(By.CSS_SELECTOR, child_selectors['price']).text
            if store == "Rona":
                decimal_price = product_element.find_element(By.CSS_SELECTOR, "[class='price-box__price__amount__decimal']").text
                product_price += f".{decimal_price}"
            product_rating = product_element.find_element(By.CSS_SELECTOR, child_selectors['rating']).text
            product_url = product_element.find_element(By.CSS_SELECTOR, child_selectors['product_url']).get_attribute("href")
            if store == "Canadian Tire":
                image_url = product_element.find_element(By.CSS_SELECTOR, child_selectors['image_url']).get_attribute("data-src")
            else:
                image_url = product_element.find_element(By.CSS_SELECTOR, child_selectors['image_url']).get_attribute("src")
        except exceptions.NoSuchElementException:
            print(f"Element Error, Store: {store} Category: {product_type}")
            del product_element
        else:
            result = {"product_name": product_name, "product_type": product_type, "store": store, "price": product_price, "rating": product_rating,
                    "product_url": product_url, "image_url": image_url}
            scraped_data.append(result)

    return scraped_data


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


def clean_data(product_data):
    """
    Run all data cleaning functions on dataset.
    """
    can_tire_image_fix(product_data)
    remove_dollar_sign(product_data)


def webscraper():
    db = firestore.Client()
    batch = db.batch()
    all_data = []
    
    for product_category in urls:
        for web_store in urls[product_category]:
            data = scrape_url(web_store, product_category, urls[product_category][web_store])
            all_data += data

    for prod in all_data:
        try:
            clean_data(prod)
        except Exception as e:
            print(e)
            print(f"Data cleaning issue: {prod}")
    
    for doc_data in all_data:
        doc_ref = db.collection("products").document()
        batch.set(doc_ref, doc_data)
    
    batch.commit()


def main():
    webscraper()
    

if __name__ == "__main__":
    main()