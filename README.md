# An archiver tool for our Webuntis messenger chats before the servers get taken down

To archive chats, install the requirements by running 'pip install -r requirements.txt', then run main.py.  
If you also want to archive files, run download_files.py after running main.py.

**Downloader files have been crippled to prevent it from destroying existing archive files, whilst trying to download non-existing messages from dead servers :)**

The viewer only works if you also download files.  
Sometimes messages can be duplicated and inserted at a later time, the first instance of a message is always the original.

If it somehow does not work, try restarting it a couple of times, and if that does not work either, change the DATE and TEXT to 'c01360' and 'c01362' respectively


If you want it to function for your school, edit line 143 in main.py to point to your Webuntis login page

## TODO
- [x] Loop over every chat
- [x] Download files and add references to JSON
- [x] Save data as JSON object (each chat --> messages, message --> (Time, author, profile pic, [file], [msg])); added TODOs everywhere data is to be saved
- [x] Read username and password from file
- [x] Add some interface to view archived chats
    - [x] Add previews for images
- [ ] Edit mode for deleting (duplicate) messages

