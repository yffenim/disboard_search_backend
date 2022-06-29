import sys
import cloudscraper
import discord
from bs4 import BeautifulSoup


tag = "buffy"
pages = 2

# Constants
HEADERS = {'User-Agent': 'Mozilla/5.0'}

# Variables
servers = []
unique_servers = []

# Iterate over each page for a tag
for page in range(1, pages + 1):
    url = f"https://disboard.org/servers/tag/{tag}/{page}?sort=-member_count"
    scraper = cloudscraper.create_scraper()
    # resource = scraper.get(url).text
    resp = scraper.get(url).response
    print(resp)
   
