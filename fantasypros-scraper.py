#!/usr/bin/python
from bs4 import BeautifulSoup
from urllib2 import urlopen
import re
import json

soup = BeautifulSoup(urlopen("https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php"))

file = open('fantasypros-output.json','w')

playerList = []

table = soup.find_all('tbody')[0]

for tag in table.find_all('tr'):
    player = {}
    data = tag.find_all('td')
    # team = tag.find_all('small')

    if data[0]:
        player['rank'] = data[0].text if len(data) > 1 else None
    if len(data) > 2:
        player['name'] = data[2].find_all('span')[0].text if len(data[2].find_all('span')) > 1 else None
    if len(data) > 3:
        player['pos'] = data[3].text
    if len(data) > 2:
        if data[2].find_all('small'):
            player['team'] = data[2].find_all('small')[0].text
    if len(data) > 3:
        player['bye'] = data[4].text


    playerList.append(player)

jsonStr = json.dumps(playerList)
print jsonStr
file.write(jsonStr)
