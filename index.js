var self = require("sdk/self");
var Buttons = require('sdk/ui/button/action');
var Tabs = require("sdk/tabs");

var button = Buttons.ActionButton({
  id: "cadastre-xavier",
  label: "Rechercher rapide dans le Cadastre",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  var tab = Tabs.open("http://www.cadastre.gouv.fr/");
  //var tab = tabs.open("http://www.cadastre.gouv.fr/scpc/afficherRechercherPlanCad.do");
}

Tabs.on('ready', function(tab) {
  var worker;
  if (tab.url == "http://www.cadastre.gouv.fr/") {
    worker = tab.attach({
      contentScriptFile: self.data.url("common.js"),
      contentScript: "Tlk.step1()"
    });
  }
  else if (tab.url.indexOf("/afficherRechercherPlanCad.do") > -1) {
    worker = tab.attach({
      contentScriptFile: self.data.url("common.js"),
      contentScript: "Tlk.step2()"
    });
  }
  else if (tab.url.indexOf("/rechercherParReferenceCadastrale.do") > -1) {
    worker = tab.attach({
      contentScriptFile: self.data.url("common.js"),
      contentScript: "Tlk.step3()"
    });
  }
  else if (tab.url.indexOf("/afficherCarteFeuille.do") > -1) {
    worker = tab.attach({
      contentScriptFile: self.data.url("common.js"),
      contentScript: "Tlk.step4()"
    });
  }


});
