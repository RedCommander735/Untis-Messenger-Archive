import data from '../data_with_files.json'

let app: HTMLElement

function init() {
    app = document.getElementById('app')!
    return data
}

function main() {

}

document.addEventListener('DOMContentLoaded', init)