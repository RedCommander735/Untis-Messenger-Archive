import os
import requests
import random
import string
import json
import shutil

def download_file(url, download_dir="."):

    file_dir = os.path.join(download_dir.replace('/', '\\'), ''.join(random.choices(string.ascii_letters + string.digits, k=16)))

    try:
        # Create the download directory if it doesn't exist
        os.makedirs(file_dir, exist_ok=True)

        response = requests.head(url)
        response.raise_for_status()  # Check for valid response

        # Check if the URL has a filename in the Content-Disposition header
        content_disposition = response.headers.get('Content-Disposition')
        if content_disposition and 'filename=' in content_disposition:
            filename = content_disposition.split('filename=')[1].strip('";')
        else:
            # If the filename is not available in the header, generate a random filename
            random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            filename = f"file_{random_chars}"

        # Get the file extension from the URL (if available)
        url_path = response.request.path_url
        file_extension = os.path.splitext(url_path)[1]
        if file_extension:
            filename += file_extension

        # Full path for saving the file
        full_path = os.path.join(file_dir, filename)

        # Download the file and save it
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(full_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        # Get the MIME type of the downloaded file
        mime_type = response.headers.get('Content-Type')

        if 'text/html' not in mime_type:
            return full_path, mime_type
        else:
            raise FileNotFoundError
    except requests.exceptions.RequestException as e:
        print(f"Error downloading the file: {e}")
        raise FileNotFoundError
    
if os.path.exists("static/downloads"):
  shutil.rmtree("static/downloads")


with open('data.json', 'r') as file:
    data = json.load(file)

for key in data:
    messages = data[key]

    for message in messages:
        link = message['attached_file']
        if link != '':
            try:
                save_path, mime_type = download_file(link, 'static/downloads')
                message['storage_path'] = save_path
                message['has_attachment'] = True
                message['mime_type'] = mime_type
                print(f'Saved file at {save_path}')
            except:
                save_path = ''
                message['storage_path'] = save_path
                message['has_attachment'] = False
                message['mime_type'] = ''

        else:
            save_path = ''
            message['storage_path'] = save_path
            message['has_attachment'] = False
            message['mime_type'] = ''

with open('static/data_with_files_v2.json', 'w') as file:
    json.dump(data, file, indent=4)

print('Done!')