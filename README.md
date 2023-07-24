# An archiver tool for your webuntis messenger chats before the servers get taken down

Current format: v2

## Still broken

To archive chats, run main.py
If it somehow does not work, try restarting it a couple of times, and if that does not work either, change the DATE and TEXT to 'c01360' and 'c01362' respectively
If you also want to archive any files, run download_files.py after running main.py

Run migrate format if you've done your file downloading with v1

## TODO
- [x] Loop over every chat
- [x] Download files and add references to json
- [x] Save data as JSON object (each chat --> messages, message --> (Time, author, profile pic, [file], [msg])); added TODOs everywhere data is to be saved
- [x] Read username and password from file
- [x] Add some kind of interface to view archived chats
    - [ ] Add previews for images

