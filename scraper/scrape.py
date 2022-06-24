import sys
# from io import StringIO
import json
import cloudscraper
import discord
from bs4 import BeautifulSoup


# Get user input 
input_list = sys.argv

# Set up url 
tag = input_list[1]
i = int(input_list[2])
pages = i 
# Note: max amount of pages allowed is 50

# print(pages)
# print(f'The type is: {type(pages)}')

# Constants
HEADERS = {'User-Agent': 'Mozilla/5.0'}

# Variables
servers = []
unique_servers = []

# Iterate over each page for a tag
for page in range(1, pages + 1):
    url = f"https://disboard.org/servers/tag/{tag}/{page}?sort=-member_count"
    scraper = cloudscraper.create_scraper()
    resource = scraper.get(url).text
    soup = BeautifulSoup(resource, 'html.parser')

    # Iterate over each server
    for server_info in soup.find_all(class_='server-info'):
        server_name = server_info.find(class_="server-name")
        server_name_link = server_name.find('a')

        server_id = server_name_link['href'].split('/')[2]
        server_created_at = discord.utils.snowflake_time(int(server_id))

        server_online = server_info.find(class_="server-online")

        parent = server_info.parent.parent
        tags = []
        for tag_ in parent.find_all(class_="tag"):
            tag_name = tag_.find(class_="name")
            tags.append(tag_name.contents[0].strip())

        # Check servers without online counts
        if hasattr(server_online, 'contents'):
            members_online_count = server_online.contents[0].strip()
        else:
            members_online_count = "N/A"

        # Create a server
        server = [
            server_name_link.contents[0].strip(),
            members_online_count,
            server_created_at,
            f"https://disboard.org{server_name_link['href']}"
        ]
        server.extend(tags)
        
        # Add each server found
        servers.append(server)

# Remove duplicates 
for i in servers:
    if i not in unique_servers:
        unique_servers.append(i)

# Convertto json and print to return to server 
j = json.dumps(unique_servers, indent=4, sort_keys=True, default=str)
print(j)



