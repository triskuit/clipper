import { linkedin, builtin, jobot, indeed } from "./scrapers.js";

const linkDiv = document.getElementById("link");
const errorBox = document.getElementById("error");

const scrapers = {
  linkedin,
  builtin,
  builtincolorado: builtin,
  jobot,
  indeed,
};

window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];

    const url = new URL(tab.url);
    const domainRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:[^\/\.]+\.)?([^\/\.]+)\.[^\/\.]+/;
    const domain = url.hostname.match(domainRegex)[1];

    if (!Object.keys(scrapers).includes(domain)) {
      setError(`No scraper for current domain: ${tab.url}`);
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: scrapers[domain],
      },
      async (results) => {
        console.log(results[0].result);
        const data = await makePage(results[0].result);

        const link = document.createElement("a");
        link.setAttribute("href", data.url);
        link.innerText = "link";

        linkDiv.appendChild(link);
        linkDiv.classList.remove("loading");
      }
    );
  });
});

const { token, databaseID } = await chrome.storage.sync.get();

// TODO: add error handling if no token + databaseID is retrieved
// TODO: replace with notion auth integration

const NOTION_TOKEN = token;
const NOTION_DATABASE_ID = databaseID;

async function makePage(properties) {
  const url = `https://api.notion.com/v1/pages`;
  const headers = {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
    "Access-Control-Allow-Origin": "*",
  };

  const body = getBody(properties);
  console.log({ body });
  const bodyJSON = JSON.stringify(body);

  const data = await fetch(url, {
    method: "POST",
    headers: headers,
    body: bodyJSON,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return data;
}

function getBody(properties) {
  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Position: {
        title: [
          {
            text: {
              content: properties.title,
            },
          },
        ],
      },
      "Company Name": {
        rich_text: [
          {
            text: {
              content: properties.company,
            },
          },
        ],
      },
      Salary: {
        rich_text: [
          {
            type: "text",
            text: {
              content: properties.salary,
            },
          },
        ],
      },
      "Job Description": {
        rich_text: [
          {
            type: "text",
            text: {
              content: properties.description?.slice(0, 1999),
            },
          },
        ],
      },
      "Date added": {
        date: {
          start: new Date().toISOString().slice(0, 10),
        },
      },
    },
  };

  if (properties.location) {
    body.properties.Location = {
      select: {
        name: properties.location,
      },
    };
  }

  if (properties.applicationType) {
    body.properties["Application Type"] = {
      select: {
        name: properties.applicationType,
      },
    };
  }

  if (properties.jobURL) {
    body.properties.URL = {
      url: properties.jobURL,
    };
  }

  return body;
}

function setError(msg) {
  errorBox.innerText = msg;
  errorBox.classList.add("error");
  linkDiv.classList.remove("loading");
}
