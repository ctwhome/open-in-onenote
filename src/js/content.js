var storage = chrome.storage.local;
var loc = document.location;
var tabUrl = loc.href;
// Reserved sections of the OneNote website
var reservedList = ["signup", "login", "careers", "pricing", "customers", "guides", "enterprise", 
                    "mobile", "desktop", "web-clipper", "product", "wikis", "projects", "notes",
                    "teams", "remote", "personal", "startups", "students", "educators", "evernote",
                    "confluence", "api-beta", "about", "tools-and-craft", "unsubscribe", "help",
                    "templates"];

// Get extension options
storage.get(["OINStatus", "OINCloseTab", "OINCloseTime", "OINWorkspaces"], function (data) {
  let statusExt = data.OINStatus;
  let linkTab = data.OINCloseTab;
  let time = data.OINCloseTime;
  let workspaces = data.OINWorkspaces;
  
  // Collect a list of reserved words
  let reservedRegex = reservedList.join("|");

  // Collect a list of user's workspaces
  let workspacesList = (workspaces || '').trim().split(/[ ,]+/);
  let workspacesRegex = "(" + workspacesList.join("|") + ")";
  
  // Accumulated expression
  let reservedExpression = "(https:\/\/www\.onenote\.so\/)(?!" + reservedRegex + ").+";
  let expression = "((https:\/\/www\.onenote\.so\/)(native\/)?" + workspacesRegex + ").+";
  
  var onenoteReservedRegex = new RegExp(reservedExpression);
  let reservedMatch = onenoteReservedRegex.exec(tabUrl);

  var onenoteRegex = new RegExp(expression);
  let match = onenoteRegex.exec(tabUrl);
  
  // Get extension status
    if ((statusExt || statusExt == undefined) && reservedMatch != null) {
      if (match != null) {
        if (tabUrl.indexOf("/native/") == -1) {
          loc.replace(tabUrl.replace(/^https?\:\/\//i, 'onenote://https://'));
        }
        if (linkTab) {
          setTimeout(() => {
            closeTab();
          }, time * 1000);
        }
      }
    }
});

// Send a message to the background script
function closeTab() {
  chrome.runtime.sendMessage("closeTab");
}
