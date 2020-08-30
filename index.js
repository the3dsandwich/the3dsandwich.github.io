const converter = new showdown.Converter();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const articleName = urlParams.get("articlename");

function fetchExternalMDAndDisplay(linkToFile) {
  fetch(linkToFile).then(replaceFetchResult);
}

function fetchMDAndDisplay(filename) {
  fetch(`./contents/${filename}`).then(replaceFetchResult);
}

function replaceFetchResult(res) {
  if (res.ok) {
    res.text().then((text) => {
      const html = converter.makeHtml(text);
      document.getElementById("content").innerHTML = html;
    });
  } else {
    fetchMDAndDisplay("404.md");
  }
}

if (articleName !== null) {
  fetchMDAndDisplay(`${articleName}.md`);
} else {
  fetchExternalMDAndDisplay(
    "https://raw.githubusercontent.com/the3dsandwich/the3dsandwich/master/README.md"
  );
}
