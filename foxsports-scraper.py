#!/usr/bin/python
import requests
from bs4 import BeautifulSoup
import json

url = "http://www.foxsports.com/fantasy/football/story/top-200-fantasy-football-player-rankings-draft-strategy-051716"

soup = BeautifulSoup(requests.get(url).text)

file = open('fox-output.json','w')

playerList = []

table = soup.find_all('tbody')[0]

playerList = []

for tag in table.find_all('tr'):
    data = tag.find_all('td')
    if data[0]:
        wholePlayer = data[0].text.replace(u'\xa0', u' ')
        newPlayer = wholePlayer.split(' ')

        player = {}

        if len(newPlayer) > 0:
          player['rank'] = newPlayer[0]
        if len(newPlayer) > 2:
          player['name'] = newPlayer[1] + ' ' + newPlayer[2]
        if len(newPlayer) > 3:
          player['team'] = newPlayer[3].replace(u'(', u'')
        if len(newPlayer) > 5:
          player['pos'] = newPlayer[5].replace(u')', u'')

          playerList.append(player)

jsonStr = json.dumps(playerList)
print jsonStr
file.write(jsonStr)
