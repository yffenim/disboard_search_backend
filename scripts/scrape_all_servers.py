# Starting with a given tag in an arr

# Scrape servers with first arr tag 
# move first arr tag to done arr 
# add servers into db if unique 
# Repeat until no tags left in arr

import os
import sys
import pymongo
import certifi
import discord
import cloudscraper
from bs4 import BeautifulSoup    
from dotenv import load_dotenv

# load credentials
load_dotenv()
ca = certifi.where()
password=os.getenv("PASSWORD")
URI = (f'mongodb+srv://theadmin:{password}@theclustername.diczg.mongodb.net/?retryWrites=true&w=majority')

# make the connection to DB
client = pymongo.MongoClient(URI, tlsCAFile=ca)
db = client.discord
collection = db.test_servers

# Header for scraper
HEADERS = {'User-Agent': 'Mozilla/5.0'}
PAGES = 50

# Variables
servers = []
unique_servers = []
tags_to_do = ["demonslayer", "cooking"]
tags_done = []
 
# recursively get tags from sraping all the tags
def scrape_tags(tags):
    for tag in tags:
        print(f"************scraping tag: {tag}************")
        done = tags.pop(0)
        tags_done.append(done)
        scraper(tag)
        return tags if len(tags_to_do) == 0 else scrape_tags(tags)

# scraper the tag
def scraper(tag):
    # Iterate over each page for a tag
    for page in range(1, PAGES + 1):
        url = f"https://disboard.org/servers/tag/{tag}/50?sort=-member_count"
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
                tag,
                server_name_safe,
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


    # make keys for creathing server dicts
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

    # make return server dict objects
    for values in unique_servers:
        s = dict(zip(keys, values))

        # only add to collection if server is unique
        invite_link = s['Invite Link']
        exists = bool(collection.find_one({'Invite Link': invite_link}))
        if not(exists):
            print(f"********ADDING {invite_link} to collection********")
            collection.insert_one(s)
        else:
            print(f"********server for {invite_link} already exists********")

        # only add tags to tags_to_do if tag is unique 
        for i in [1, 2, 3, 4, 5]:
            tag_n = f'Tag {i}'
            # print(tag_n)
            server_tag = s[tag_n]
            # print(f"server_tag is: {server_tag}")
            if server_tag not in tags_done and server_tag not in tags_to_do:
                tags_to_do.append(server_tag)
            # print(f"tags_to_do is now: {tags_to_do}")

scrape_tags(tags_to_do)
