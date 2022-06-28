# scrapes Disboard for servers matching input tag
# input options: tag, number of pages to scrape, return destination
# max # of pages is 50 
# three return destinations: server, json, db


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

# Set up array for returning as json
list_for_db = []

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

# return list for parsing by server
if return_dest == 'server':
    print(unique_servers)

# return JSON with dateTime removed?
if return_dest == 'mongodb':
    import certifi
    import pymongo

    ca = certifi.where()
    URI = ("mongodb+srv://theadmin:wXnRCZh9S0wCfHtd@cluster0.diczg.mongodb.net/?retryWrites=true&w=majority")

    client = pymongo.MongoClient(URI, tlsCAFile=ca)
    db = client.discord
    collection = db.test_servers

    # make keys
    keys = [
        'Search Tag',
        'Server Name',
        'Members Online',
        'Creation Date',
        "Invite Link",
        'Tag 1',
        'Tag 2',
        'Tag 3',
        'Tag 4',
        'Tag 5'
    ]

    # make values
    # servers_json = json.dumps(unique_servers, 
    #                           indent=4, 
    #                           sort_keys=True, 
    #                           default=str)

    # make return object
    for values in unique_servers:
        s = dict(zip(keys, values))

        # connect to MongoDb and insert servers as documents
        # ca = certifi.where()
        # URI = ("mongodb+srv://theadmin:wXnRCZh9S0wCfHtd@cluster0.diczg.mongodb.net/?retryWrites=true&w=majority")

        # client = pymongo.MongoClient(URI, tlsCAFile=ca)
        # db = client.discord
        # collection = db.test_servers
        # collection.insert_one(s)

        # note that insert_many is not working
        # collection.insert_many([list_for_db])
        
    # to print out the servers as a list of dict, comment out next two lines
        list_for_db.append(s)
    print(list_for_db)
