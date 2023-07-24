from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import datetime
import json
import sys

DATE = 'c01362'
TEXT = 'c01364'

from typing import List
from selenium.webdriver.remote.webelement import WebElement


def scrollUpChat(driver):
    """A method for scrolling the page."""

    #document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTo({top: -document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollHeight , left: 0})

    # Get scroll height.
    last_height = driver.execute_script("try {return document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollHeight} catch (error) {return 0}")

    while True:

        # Scroll down to the top.
        driver.execute_script("try {document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTo(0, 0)} catch (error) {} ")

        # Wait to load the page.
        time.sleep(1)

        # Calculate new scroll height and compare with last scroll height.
        new_height = driver.execute_script("try {return document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollHeight} catch (error) {return 0}")

        if new_height == last_height:
            break

        last_height = new_height

def scrollDownChatList(driver):
    """A method for scrolling the page."""

    #document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTo({top: -document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollHeight , left: 0})

    # Get scroll height.
    last_height = driver.execute_script("try {return document.getElementsByClassName('c01145')[0].scrollHeight} catch (error) {return 0}")

    while True:

        # Scroll down to the top.
        driver.execute_script("try {document.getElementsByClassName('c01145')[0].scrollTo(0, document.getElementsByClassName('c01145')[0].scrollHeight)} catch (error) {}")
        time.sleep(1)

        driver.execute_script("try {document.getElementsByClassName('c01145')[0].scrollTo(0, 0)} catch (error) {}")

        # Wait to load the page.
        time.sleep(1)

        # Calculate new scroll height and compare with last scroll height.
        new_height = driver.execute_script("try {return document.getElementsByClassName('c01145')[0].scrollHeight} catch (error) {return 0}")

        if new_height == last_height:
            break

        last_height = new_height



def saveMsg(_messageElements: List[WebElement], count, date = "01.01.2000", last_author = "null", last_time = "00:00"):

    messages = []

    for messageElement in _messageElements:
        _time = ""
        author = ""
        link = ""
        _message = ""


        # if "c01362" in messageElement.get_attribute("class"):
        if DATE in messageElement.get_attribute("class"):
            date = messageElement.find_element(By.TAG_NAME, "span").get_attribute('innerHTML').replace('Heute, ', '').replace('Gestern, ', '').replace(' Jan. ', '01.').replace(' Feb. ', '02.').replace(' März ', '03.').replace(' Apr. ', '04.').replace(' Mai ', '05.').replace(' Juni ', '06.').replace(' Juli ', '07.').replace(' Aug. ', '08.').replace(' Sept. ', '09.').replace(' Okt. ', '10.').replace(' Nov. ', '11.').replace(' Dez. ', '12.')

            # print("\n\n" + date + ":\n")

        # elif "c01364" in messageElement.get_attribute("class"):
        elif TEXT in messageElement.get_attribute("class"):

            try:
                author = messageElement.find_element(By.CSS_SELECTOR, "header > span").get_attribute('innerHTML')
                last_author = author
            except:
                author = last_author
            try:
                _time =  messageElement.find_element(By.CSS_SELECTOR, "header > div > span").get_attribute('innerHTML')
                last_time = _time
            except:
                _time = last_time
                
            if (messageElement.find_elements(By.TAG_NAME, "p")):
                _message = messageElement.find_element(By.TAG_NAME, 'p').get_attribute('innerHTML').replace('https://grape-21.webuntis.com/static/app/images/emoji_sheet_64_optimized.png', '/static/emoji_sheet_64_optimized.png')

            # TODO Broken, fix
            if (messageElement.find_elements(By.CSS_SELECTOR, "a.c01417")):
                link = messageElement.find_element(By.CSS_SELECTOR, 'a.c01417').get_attribute('href')


            datestring = date + ' ' + _time

            _date = int(time.mktime(datetime.datetime.strptime(datestring, '%d.%m.%Y %H:%M').timetuple()))
            
            data = {'unix_time': _date, 'date': date, 'time': _time, 'author': author, 'message': _message, 'attached_file': link}


            if data not in messages:
                messages.append(data)
            # TODO Save time, author, message and file for each msg, maybe save profile pics to

            print(f'{date}, {_time} - {author}: {_message}, File: {link} \n')

    return (date, last_author, last_time, messages)

USERNAME = ''
PASSWORD = ''

try:
    with open('credentials.json', "r") as file:
        content = json.load(file)
        if (content['username'] != 'USERNAME') and (content['password'] != 'PASSWORD'):
            USERNAME = content['username']
            PASSWORD = content['password']

        else:
            sys.exit("Found template credentials, please fill in your credentials.")
except FileNotFoundError:
    # If the file does not exist, create a new one with the template content
    with open('credentials.json', "w") as file:
        json.dump({'username': 'USERNAME', 'password': 'PASSWORD'}, file)
    sys.exit("File 'credentials.json' does not exist. Created a new file with template content, please fill in your credentials.")
    

driver = webdriver.Firefox()
driver.get("https://thalia.webuntis.com/WebUntis/?school=Mons_Tabor")
time.sleep(3)
loginElements = driver.find_elements(By.CSS_SELECTOR, ".un-input-group__input")

userName = loginElements[0]
password = loginElements[1]
loginButton = driver.find_element(By.CSS_SELECTOR, '#app > div > div > div.content-container > div.widget-section > div > div.panel-body > div > div.login-content > div > form > button')

userName.clear()
userName.send_keys(USERNAME)

password.clear()
password.send_keys(PASSWORD)

loginButton.click()

time.sleep(2)

messengerButton = driver.find_element(By.XPATH, '/html/body/div[3]/div/div/div/div[1]/div[2]/div[1]/div/a[4]/div/div')
messengerButton.click()

time.sleep(2)

driver.switch_to.frame(driver.find_elements(By.TAG_NAME, "iframe")[0])
driver.switch_to.frame(driver.find_elements(By.TAG_NAME, "iframe")[0])
scrollDownChatList(driver)

time.sleep(2)

chats = driver.find_elements(By.CLASS_NAME, 'c01156')

count = 0

all_chat_data = {}

# TODO Start loop here

for chat in chats:

    chat_name = chat.find_element(By.CSS_SELECTOR, '.c01160').get_attribute('innerHTML')

    chat.click()
    time.sleep(1)

    scrollUpChat(driver)

    currentScroll = 0

    scrollHeight = driver.execute_script("try {return document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollHeight} catch (error) {return 0}")

    scrollTopOld = driver.execute_script("try {return document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTop} catch (error) {return 0}")

    messageElements = driver.find_elements(By.CSS_SELECTOR, f".{DATE}, .{TEXT}")
        
    date, last_author, last_time, messages = saveMsg(messageElements, count)

    while True:
        if (messageElements):
            last_element = messageElements[-1].find_element(By.XPATH, '..')
            height = last_element.value_of_css_property('height').replace('px', '')
            top = last_element.value_of_css_property('top').replace('px', '')

            currentScroll = float(height) + int(top)
            

            driver.execute_script("try {document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTop = " + str(currentScroll) + "} catch (error) {}")

            scrollTopNew = driver.execute_script("try {return document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0].scrollTop} catch (error) {return 0}")

            if scrollTopOld == scrollTopNew:
                break

            scrollTopOld = scrollTopNew



            messageElements = driver.find_elements(By.CSS_SELECTOR, f".{DATE}, .{TEXT}")
            
            date, last_author, last_time, _messages = saveMsg(messageElements, count, date, last_author, last_time)

            for _m in _messages:
                for m in messages:
                    if (m['message'] != _m['message']) and (m['time'] != _m['time']) and (m['author'] != _m['author']):     
                        if _m not in messages:
                            messages.append(_m)
                    
        else: 
            break

    all_chat_data[chat_name] = messages

    with open('data.json', 'w', encoding='UTF-8') as file:
        json.dump(all_chat_data, file, indent=4)

# End loop

with open('data.json', 'w', encoding='UTF-8') as file:
    json.dump(all_chat_data, file, indent=4)

print("Done!")
time.sleep(2)
driver.close()



