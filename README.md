# An archiver tool for your webuntis messenger chats before the servers get taken down

# DOWNLOADER IS SOMEHOW BROKEN, MESSAGES GET DOUBLED

Current format: v2

To archive chats, run main.py
If you also want to archive any files, run download_files.py after running main.py

Run migrate format if you've done your file downloading with v1

## TODO
- [x] Loop over every chat
- [x] Download files and add references to json
- [x] Save data as JSON object (each chat --> messages, message --> (Time, author, profile pic, [file], [msg])); added TODOs everywhere data is to be saved
- [x] Read username and password from file
- [ ] Add some kind of interface to view archived chats
