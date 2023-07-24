import os
import requests
import random
import string
import json


with open('data.json', 'r') as file:
    data = json.load(file)

for key in data:
    messages = data[key]

    for message in messages:
        link = message['attached_file']
        if link != '':
            try:
                save_path = 'File.File'
                message['storage_path'] = save_path
                message['has_attachment'] = True
                print(f'Saved file at {save_path}')
            except:
                save_path = ''
                message['storage_path'] = save_path
                message['has_attachment'] = False

        else:
            save_path = ''
            message['storage_path'] = save_path
            message['has_attachment'] = False

with open('static/data_with_files_v2.json', 'w') as file:
    json.dump(data, file, indent=4)

print('Done!')