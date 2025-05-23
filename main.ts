import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import * as fs from 'node:fs';
import { StateManager } from "./StateManager.ts";

async function scrape() { 
  fs.writeFile('data.json', JSON.stringify(null), 'utf8', () => {
    console.log(`data wiped`);
  }) 

  // Fetch HTML from a website
  let pageNumber = 0
  const mainLink = "https://fostercaresystems.wustl.edu/browse-our-data?page="
  let links = new Array

  while (pageNumber < 5) {
    const response = await fetch(`${mainLink}${pageNumber}`);
    const html = await response.text();

    // Parse HTML into a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newLinks = stripPageLinks(doc)
    links = links.concat(newLinks)
    // console.log(links)
    console.log(`links striped ${pageNumber}`)
    pageNumber++
    await delay(1500);
  }

  const stateManager = new StateManager()
  // Parse the JSON data
  const jsonObject = new Array;
  console.log('json ready to go')
  // console.log(`${links.length}`)
  for (const link of links) {
    const newjson = await stripPage(link, stateManager)
    jsonObject.push(newjson)
    console.log('page scraped')
    await delay(1500);
  }

  fs.writeFile('data.json', JSON.stringify(jsonObject, null, 2), 'utf8', () => {
    console.log(`Data written`);
  })

  fs.writeFile('states.json', JSON.stringify(null), 'utf8', () => {
    console.log(`data wiped`);
  }) 

  const states = stateManager.getStatesJSON()

  fs.writeFile('states.json', JSON.stringify(states, null, 2), 'utf8', () => {
    console.log(`Data written`);
  })
}

function stripPageLinks(doc: DOMParser) {
  const atags = doc.querySelectorAll('a.post')
  const linklist = new Array
  for (const link of atags) {
    linklist.push(link.getAttribute('href'))
  }
  return linklist
}

async function stripPage(url: string, stateManager: StateManager) {
  console.log(url)
  const response = await fetch(`https://fostercaresystems.wustl.edu${url}`);
  const html = await response.text();

  // Parse HTML into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rule = doc.querySelector("div.container.reveal");

  const ruleName = rule.querySelector('h1')
  const state = rule.querySelector('div.byline')
  const dates_tags = rule.querySelector('div.date')
  const dates_tags_text = dates_tags.textContent.split('|')
  const years = dates_tags_text[0].split(',').map(year => year.trim());
  const tags = dates_tags_text[1].split(',').map(tag => tag.trim());
  const content = doc.querySelector("div.wysiwyg-editor-text").outerHTML
  const source = doc.querySelector("#quicklinks-nav").querySelector("a").getAttribute("href")
  // console.log(content)

  const newjson = {
    "ruleName": ruleName.textContent,
    "state": state.textContent,
    "source": source,
    "stateNumber": stateManager.retiveStateNumber(state.textContent),
    "years": years,
    "tags": tags,
    "content": content
  }

  return newjson
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

scrape()