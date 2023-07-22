import json

with open('/static/data_with_files.json', 'r') as file:
    data = json.load(file)

for key in data:
    messages = data[key]

    for message in messages:
        if 'storage_path' in message:
            message['has_attachment'] = True
        else:
            message['storage_path'] = ''
            message['has_attachment'] = False

with open('/static/data_with_files_v2.json', 'w') as file:
    json.dump(data, file, indent=4)

print('Done!')