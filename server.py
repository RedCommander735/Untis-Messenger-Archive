from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
def read_root():
    with open('index.html', 'r') as html:
        return html.read()


@app.get("/dev", response_class=HTMLResponse)
def read_dev():
    os.system('tsc')
    with open('index.html', 'r') as html:
        return html.read()
