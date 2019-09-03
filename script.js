let btn = document.querySelector(".btn");
let inp = document.querySelector("#name");
let displayInfoArea = document.querySelector(".display-info-area");

async function getUserAsync(name) {
    let response = await fetch(`https://api.github.com/users/${name}`);
    let data = await response.json();
    return data;
}

async function getUserRepros(name) {
    let response = await fetch(`https://api.github.com/users/${name}/repos`);
    let data = await response.json();
    return data;
}

function clearResults() {
    while (displayInfoArea.hasChildNodes()) {
        displayInfoArea.removeChild(displayInfoArea.firstChild);
    }
}

function createResults(title, text, hr, link) {
    if (link !== true) {
        let p = document.createElement("P");
        let textNode = document.createTextNode(title + text);
        p.appendChild(textNode);
        displayInfoArea.appendChild(p);
    }
    if (link === true) {
        let p = document.createElement("P");
        let a = document.createElement("a");
        let pTitle = document.createTextNode(title);
        let aTitle = document.createTextNode(text);
        a.href = text;
        a.target = "_blank";
        a.appendChild(aTitle);
        p.appendChild(pTitle);
        p.appendChild(a);
        displayInfoArea.appendChild(p);
    }

    if (hr === true) {
        let hr = document.createElement("hr");
        displayInfoArea.appendChild(hr);
    }
}

function apiGet() {
    clearResults();
    let value = inp.value;
    if (value != "") {
        getUserAsync(value).then(function(result) {
            createResults("Name: ", result.name);
            createResults("Account Type: ", result.type);
            createResults("Public Repos: ", result.public_repos, true);

            if (result.public_repos > 0) {
                getUserRepros(value).then(function(repo) {
                    // console.log(repo);
                    for (let i = 0; i < repo.length; i++) {
                        const e = repo[i];
                        let j = i + 1;
                        createResults("#" + j +" Repo name: ", e.name);
                        if(e.description !== null) {
                            createResults("Description: ", e.description);
                        }
                        else {
                            createResults("Description: ", "-");
                        }
                        if(e.language !== null) {
                            createResults("Language: ", e.language);
                        }
                        else {
                            createResults("Language: ", "-");
                        }
                        
                        createResults("Link: ", e.html_url, true, true);

                    }
                });
            }
        });

    } else {
        console.log("not found");
    }
}

btn.addEventListener("click", apiGet);
inp.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      apiGet();
    }
  });
