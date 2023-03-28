# Use Python 3.8 image
FROM python:3.8

# Install system dependencies
RUN apt-get update \
    && apt-get install -y wget gnupg2 unzip

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# Set up Chrome driver
RUN LATEST=$(wget -q -O - https://chromedriver.storage.googleapis.com/LATEST_RELEASE) \
    && wget -q https://chromedriver.storage.googleapis.com/$LATEST/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip \
    && mv chromedriver /usr/local/bin/ \
    && rm chromedriver_linux64.zip

# Copy the requirements file
COPY requirements.txt /webscraper/requirements.txt

# Install Python dependencies
WORKDIR /webscraper
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to container image
COPY . /webscraper

# Expose port 8080 for the web server
EXPOSE 8080

# Set the entrypoint to run the web server on container startup
CMD ["python", "main.py"]

