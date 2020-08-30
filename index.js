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

fetch(
  "https://api.github.com/repos/the3dsandwich/the3dsandwich.github.io/git/trees/master?recursive=1"
).then((res) => {
  res.json().then(({ tree }) => {
    const postList = tree.filter(({ path }) =>
      path.match("contents/[0-9a-zA-z]*.md")
    );
    console.log(postList);
    for (const post of postList) {
      const postNode = document.createElement("li");
      const postTitle = post.path.replace("contents/", "").replace(".md", "");
      const postLink = document.createElement("a");
      postLink.setAttribute("href", `?articlename=${postTitle}`);
      postLink.innerHTML = postTitle;
      postNode.appendChild(postLink);
      document.getElementById("posts").appendChild(postNode);
    }
  });
});
