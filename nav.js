// Builds the site header and footer on every page.
// Add a page to PAGES and it appears in the nav everywhere.
const PAGES = [
  ["index.html", "Home"],
  ["check.html", "Check your car"],
  ["failure-model.html", "Failure model"],
  ["data-challenges.html", "Data challenges"],
  ["clocking.html", "Clocking detection"],
  ["sql.html", "Lamborghini database"],
  ["blog.html", "Blog"]
];

const here = location.pathname.split("/").pop() || "index.html";

// ---- Header ----------------------------------------------------------------
const links = PAGES.map(([href, label]) =>
  `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`
).join("");

document.querySelector("header").innerHTML = `
  <div class="brand">
    <div class="plate" aria-label="Roadworthy">
      <span class="band" aria-hidden="true">UK</span>
      <span class="word">ROADWORTHY</span>
    </div>
  </div>
  <nav aria-label="Main">${links}</nav>
`;

// ---- Footer ----------------------------------------------------------------
// Replaces whatever is in a page's <footer>, or adds one if the page has none.
const footer = document.querySelector("footer") || document.body.appendChild(document.createElement("footer"));
footer.innerHTML = `
  <p>
    Contains public sector information licensed under the
    <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
       rel="license noopener" target="_blank">Open Government Licence v3.0</a>.
    MOT data from the Driver and Vehicle Standards Agency (DVSA).
  </p>
  <p>
    Roadworthy is an independent project and is not affiliated with or endorsed by the DVSA.
    Estimates are for interest only and are not a substitute for an inspection by a mechanic.
  </p>
`;

// ---- Cloudflare Web Analytics: loaded here so every page gets it ----------
const cfBeacon = document.createElement("script");
cfBeacon.defer = true;
cfBeacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
cfBeacon.setAttribute("data-cf-beacon", '{"token": "9261635495a241a484ac6a87c4408f0d"}');
document.body.appendChild(cfBeacon);