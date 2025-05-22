import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import * as fs from 'node:fs';

async function scrape() { 
  // Fetch HTML from a website
  var pageNumber = 0
  const mainLink = "https://fostercaresystems.wustl.edu/browse-our-data?page="
  const links = []

  while (pageNumber < 407) {
    const response = await fetch(`${mainLink}${pageNumber}`);
    const html = await response.text();

    // Parse HTML into a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newLinks = stripPageLinks(doc)
    links.concat(newLinks)
  }

  for (const link in links) {
    stripPage(link)
  }
}

function stripPageLinks(doc: DOMParser) {
  var linklist = []
  return linklist
}

async function stripPage(url: string) {
  const response = await fetch("https://fostercaresystems.wustl.edu/foster/ut-r512-health-and-human-services-child-and-family-services-r512-500-kinship-services");
  const html = await response.text();

  // Parse HTML into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rule = doc.querySelector("div.container.reveal");

  const ruleName = rule.querySelector('h1')
  const state = rule.querySelector('div.byline')
  const dates_tags = rule.querySelector('div.date')
  const dates_tags_text = dates_tags.textContent.split('|')
  const years = dates_tags_text[0].split(',')
  const tags = dates_tags_text[1].split(',')

  const newjson = JSON.stringify({
    "ruleName": ruleName.textContent,
    "state": state.textContent,
    "years": years,
    "tags": tags
  })

  fs.writeFile('data.json', JSON.stringify(null), 'utf8', () => {
    console.log(`data wiped`);
  }) 

  fs.writeFile('data.json', newjson, 'utf8', () => {
    console.log(`Data written`);
  })
}

scrape()