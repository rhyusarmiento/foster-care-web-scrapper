import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import * as fs from 'node:fs';
import { StateManager } from "./StateManager.ts";

async function scrape() { 
  fs.writeFile('data.json', JSON.stringify(null), 'utf8', () => {
    console.log(`data wiped`);
  }) 

  // const stateManager = new StateManager()
  // const newjson = await stripPage("/foster/introduction-child-welfare-manual-policy-updates-align-best-practices-and-comply-joint", stateManager)

  // Fetch HTML from a website
  let pageNumber = 0
  const mainLink = "https://fostercaresystems.wustl.edu/browse-our-data?page="
  let links = new Array

  // 407
  while (pageNumber < 407) {
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
    await delay(200);
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
    await delay(200);
  }

  for (const link of links) {
    console.log("getting content")
    await striptPageContent(link, jsonObject, stateManager)
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

async function striptPageContent(url: string, json: any, stateManager: StateManager) {
  console.log(url)
  const response = await fetch(`https://fostercaresystems.wustl.edu${url}`);
  const html = await response.text();

  // Parse HTML into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const contentDom = doc.querySelector("div.wysiwyg-editor-text")
  const linklist = contentDom == null || contentDom == undefined ? null : contentDom.querySelectorAll('a')
  
  if (linklist != null) {
    for (const link of linklist) {
      // console.log(`inital state ${link.getAttribute('href')}`)
      const obj = json.find(item => item.url == `${link.getAttribute('href')}` ? item : null)
      if (obj != null && obj != undefined) {
        const abbre = stateManager.getStateAbbre(obj.rule.state.stateName)
        const newlink = `https://fostercaresystems.byu.edu/rules/${abbre}/${obj.rule.stateNumber}`
        link.setAttribute('href', `${newlink}`)
        console.log(`check if set ${link.getAttribute('href')}`)
      }
    }
  }
  
  const content = doc.querySelector("div.wysiwyg-editor-text").outerHTML
  const objInput = json.find(item => item.url == `${url}` ? item.rule : null)
  if (objInput != null) {
    objInput.rule.htmlcontent = content == null || content == undefined ? "FIXME" : content
  }
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
  const dates_tags_text = dates_tags == null || dates_tags == undefined ? "FIXME" : dates_tags.textContent.split('|')
  const years = dates_tags_text[0] == null || dates_tags_text[0] == undefined ? ["FIXME"] : dates_tags_text[0].split(',').map(year => year.trim());
  const tags = dates_tags_text[1] == null || dates_tags_text[1] == undefined ? ["FIXME"] : dates_tags_text[1].split(',').map(tag => tag.trim());
  // const content = doc.querySelector("div.wysiwyg-editor-text").outerHTML
  const source = doc.querySelector("#quicklinks-nav")
  const sourceLink = source == null || source == undefined ? "FIXME" : source.querySelector("a")
  const sourceText = sourceLink == null || sourceLink == undefined ? "FIXME" : sourceLink.getAttribute("href")
  
  // console.log(stateText)


  const newjson = {
    "url": `${url}`,
    "rule": {
      "ruleName": ruleName.textContent == null || ruleName.textContent == undefined ? "FIXME" : ruleName.textContent,
      "state": {
        "stateName": state == null || state == undefined ? "FIXME" : state.textContent.trim()
      },
      "source": sourceText == null || sourceText == undefined ? "FIXME" : sourceText,
      "stateNumber": stateManager.retiveStateNumber(state == null || state == undefined ? "FIXME" : state.textContent),
      "years": years,
      "tags": tags,
      "htmlcontent": null
    }
  }

  return newjson
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

scrape()