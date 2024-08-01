function linkedin() {
  const locationOptions = ["Hybrid", "On-site", "Remote"];

  let jobText = document.body.querySelector(
    ".jobs-search__job-details--wrapper"
  );

  if (!jobText) {
    jobText = document.body.querySelector("[role='main']");
  }

  const infoRaw = jobText.querySelectorAll(
    ".job-details-jobs-unified-top-card__job-insight.job-details-jobs-unified-top-card__job-insight--highlight span:not(:has(*))"
  );
  info = Array.from(infoRaw).map((i) => i.innerText);

  const title = jobText.querySelector("a.ember-view")?.innerText;
  let company = jobText.querySelector(
    ".job-details-jobs-unified-top-card__company-name > a"
  )?.innerText;

  if (!company) {
    company = jobText.querySelector(
      ".job-details-jobs-unified-top-card__company-name"
    )?.innerText;
  }
  const salary = info.find((item) => item.includes("$")) || "Unknown";
  const location =
    info.find((item) => locationOptions.includes(item)) || "Unknown";
  const description = jobText.querySelector(
    ".jobs-description-content__text"
  ).innerText;

  const buttonText = document.querySelector(
    ".jobs-apply-button--top-card"
  )?.innerText;

  const jobId = new URL(document.location).searchParams.get("currentJobId");
  let jobURL = "";

  let applicationType = "";
  if (buttonText === "Easy Apply") {
    applicationType = "LinkedIn Easy Apply";
    jobURL = `https://www.linkedin.com/jobs/view/${jobId}`;
  }

  return {
    title,
    company,
    salary,
    location,
    description,
    applicationType,
    jobId,
    jobURL,
  };
}

function builtin() {
  const locationOptions = ["Hybrid", "On-site", "Remote"];

  let jobText = document.body.querySelector(".l-content.right");

  const infoRaw =
    jobText.querySelector(".job-info") ||
    jobText.querySelector(".company-options");
  const salary = titleCase(
    infoRaw.querySelector(".provided-salary")?.innerText
  );
  const company = titleCase(infoRaw.querySelector("a")?.innerText);

  info = Array.from(infoRaw.querySelectorAll("span")).map((i) => i.innerText);

  const location = locationOptions.find((loc) =>
    info.includes(loc.toUpperCase())
  );

  const title = jobText.querySelector(
    ".node-title > .field--name-title"
  )?.innerText;
  const description = jobText.querySelector(".job-description").innerText;

  const applicationType = "";
  const jobId = "";
  const jobURL = "";

  return {
    title,
    company,
    salary,
    location,
    description,
    applicationType,
    jobId,
    jobURL,
  };

  function titleCase(str) {
    if (!str) {
      return "";
    }
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.replace(word[0], word[0]?.toUpperCase());
      })
      .join(" ");
  }
}

function jobot() {
  const title = document.querySelector(".header-title").innerText;
  const company = "";
  const salary = document.querySelector("[data-info='compensation']").innerText;
  const location = titleCase(
    document.querySelector("[data-info='remote']").innerText
  );
  const description = document.querySelector(".JobDescription").innerText;
  const jobURL = document.URL;
  const applicationType = "Jobot";

  function titleCase(str) {
    if (!str) {
      return "";
    }
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.replace(word[0], word[0]?.toUpperCase());
      })
      .join(" ");
  }

  return {
    title,
    company,
    salary,
    location,
    description,
    applicationType,
    jobURL,
  };
}

function indeed() {
  const jobPost = document.querySelector(".fastviewjob");

  const title = jobPost
    .querySelector(".jobsearch-JobInfoHeader-title")
    ?.innerText?.split("\n")[0];
  const company = jobPost.querySelector(
    "[data-company-name] > span > a"
  )?.innerText;
  const salary = jobPost.querySelector(
    "#salaryInfoAndJobType > span"
  ).innerText;
  const location = jobPost.querySelector(
    '[aria-label="Work setting"] li'
  )?.innerText;
  const description = jobPost.querySelector("#jobDescriptionText").innerText;

  const applicationType = "Indeed";

  return {
    title,
    company,
    salary,
    location,
    description,
    applicationType,
  };
}

export { linkedin, builtin, jobot, indeed };
