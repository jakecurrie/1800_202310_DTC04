# Use Python 3.8 image
FROM python:3.8-buster

# Install Firefox and GeckoDriver
RUN apt-get update \
    && apt-get install -y firefox-esr \
    && wget -q https://github.com/mozilla/geckodriver/releases/download/v0.30.0/geckodriver-v0.30.0-linux64.tar.gz \
    && tar -xzf geckodriver-v0.30.0-linux64.tar.gz \
    && mv geckodriver /usr/local/bin \
    && rm geckodriver-v0.30.0-linux64.tar.gz

# Set environment variable for running headless
ENV DISPLAY=:99

# Copy the requirements file
COPY requirements.txt /webscraper/requirements.txt

# Install Python dependencies
WORKDIR /webscraper
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to container image
COPY . /webscraper

# Expose ports for the web server
EXPOSE ${PORT}

# Set the entrypoint to run the web server on container startup
CMD ["python", "main.py"]
