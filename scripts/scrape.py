# scrapes Disboard for servers matching input tag
# input options: tag, number of pages to scrape, return destination
# max # of pages is 50 
# three return destinations: server, json, mongodb
# please see docs for more 

import sys
import json
import cloudscraper
import discord
from bs4 import BeautifulSoup

# Get user input 
input_list = sys.argv

# Set up url for return_type="server"
tag = input_list[1]
i = int(input_list[2])
pages = i # Note: max amount of pages allowed is 50
return_dest = input_list[3]

# Constants
HEADERS = {'User-Agent': 'Mozilla/5.0'}

# Variables
servers = []
unique_servers = []
list_for_db = []

# Iterate over each page for a tag
for page in range(1, pages + 1):
    url = f"https://disboard.org/servers/tag/{tag}/{page}?sort=-member_count"
    scraper = cloudscraper.create_scraper()
    resource = scraper.get(url).text
    soup = BeautifulSoup(resource, 'html.parser')

    # Iterate over each server
    for server_info in soup.find_all(class_='server-info'):
        server_name = server_info.find(class_="server-name")

        # Set up server name with single quotes stripped
        server_name_link = server_name.find('a')
        server_name_stripped = server_name_link.contents[0].strip();
        server_name_safe = server_name_stripped.replace("'"," ");

        server_id = server_name_link['href'].split('/')[2]
        server_created_at = discord.utils.snowflake_time(int(server_id))

        server_online = server_info.find(class_="server-online")

        parent = server_info.parent.parent
        tags = []
        for tag_ in parent.find_all(class_="tag"):
            tag_name = tag_.find(class_="name")
            tags.append(tag_name.contents[0].strip())
        
        if len(tags) < 5:
            missing = 5 - len(tags)
            i=1
            while ( i <= missing ):
                tags.append("null")
                i=i+1

        # Check servers without online counts
        if hasattr(server_online, 'contents'):
            members_online_count = server_online.contents[0].strip()
        else:
            members_online_count = "N/A"

        # Create a server
        server = [
            # SEARCH_TAG,
            tag,
            server_name_safe,
            # server_name_link.contents[0].strip(),
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

# Return options
# Return a stringified list to server
if return_dest == 'server':
    print(unique_servers)

# Print a nice readable format of servers to terminal
if return_dest == 'json':
    servers_json = json.dumps(unique_servers, 
                              indent=4, 
                              sort_keys=True, 
                              default=str)
    print(servers_json)

# Return all servers directly to DB
if return_dest == 'mongodb':
    import certifi
    import pymongo
    import os
    from dotenv import load_dotenv
    load_dotenv()
    ca = certifi.where()
    password=os.getenv("PASSWORD")
    URI = (f'mongodb+srv://theadmin:{password}@theclustername.diczg.mongodb.net/?retryWrites=true&w=majority')

    # make the connection
    client = pymongo.MongoClient(URI, tlsCAFile=ca)
    db = client.discord
    collection = db.test_servers

    # make keys
    keys = [
        'Search Tag',
        'Server Name',
        'Members Online',
        'Creation Date',
        'Invite Link',
        'Tag 1',
        'Tag 2',
        'Tag 3',
        'Tag 4',
        'Tag 5'
    ]

    # make return object
    for values in unique_servers:
        s = dict(zip(keys, values))

        # only add to collection if server is unique
        invite_link = s['Invite Link']
        exists = bool(collection.find_one({'Invite Link': invite_link}))
        
        if not(exists):
            print(f"ADDING {invite_link} to collection")
            collection.insert_one(s)
        else:
            print(f"server for {invite_link} already exists")

    # to print out the servers, uncomment out next 2 lines:
        # list_for_db.append(s)
    # print(list_for_db)


