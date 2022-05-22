var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTermEl = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("div", "#language-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("please enter a GitHub username");
    }

    console.log(event);

}



var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
                
        } else {
            alert("error: GitHub User Not Found");
        }
    });
}



var displayRepos = function(repos, searchTerm) {

    // check if the api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "no repos found";
        return;
    }
    
    
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTermEl.textContent = searchTerm;

    console.log(repos);
    console.log(searchTerm);

    // loop over repos

    for (var i=0; i < repos.length; i++) {
        // format repo name

        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // <div>                repoEl
        //      <span>          titleEl



        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repo namme
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}



var getUserRepos = function(user) {
    
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user) });
         } else {
            alert("Error: GitHub User Not Found");
        }
    

    })

    .catch(function(error) {
        // "catch" getting chained to the end of the "then" statement
        alert("unale to connect to GitHub");
    });
    
    console.log("outside");   

}



var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);
        // clear old content
        repoContainerEl.textContent = "";
    }
    console.log(language);

}





userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);

