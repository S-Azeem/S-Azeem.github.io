// Builds the site header on every page. Add a page here and it appears everywhere.
const PAGES = [
  ["index.html", "Home"],
  ["failure-model.html", "Failure model"],
  ["clocking.html", "Clocking detection"],
  ["marques.html", "Marques"],
  ["data.html", "Data"],
  ["sql.html", "Lamborghini database"],
];

const here = location.pathname.split("/").pop() || "index.html";

const links = PAGES.map(([href, label]) =>
  `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`
).join("");

document.querySelector("header").innerHTML = `
  <a class="site" href="index.html">Roadworthy</a>
  <nav aria-label="Main">${links}</nav>
`;