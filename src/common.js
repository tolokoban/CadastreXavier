window.Tlk = (function() {
  var timer = null;

  function tag(name, css) {
    if (typeof css === 'undefined') css = {};
    var e = document.createElement(name);
    for (var key in css) {
      e.style[key] = css[key];
    }
    return e;
  }
  function div(css) {
    return tag("div", css);
  }
  function later(delay, arg) {
    console.log("later(" + delay + ")");
    return new Promise(
      function(resolve, reject) {
        console.log("choubichoubi");
        window.setTimeout(
          function() {
            console.log("---------..---------");
            resolve(arg);
          },
          delay
        );
      }
    );
  }
  function whenDefined(obj, slot) {
    if (window[obj]) {
      slot(window[obj]);
    } else {
      window.setTimeout(
        function() {
          console.log("wait on window." + obj);
          whenDefined(obj, slot);
        },
        100
      );
    }
  }

  return {
    on: function(ids) {
      return new Promise(
        function(resolve, reject) {
          if (!Array.isArray(ids)) {
            ids = [ids];
          }
          timer = window.setInterval(
            function() {
              console.log("wait...");
              var found = false;
              var elems = [];
              ids.forEach(
                function(id) {
                  var elem = document.body.querySelector(id);
                  elems.push(elem);
                  if (elem) {
                    found = true;
                    console.log("   " + id + ": YES!");
                  } else {
                    console.log("   " + id + ": no");
                  }
                }
              );
              if (found) {
                window.clearInterval(timer);
                timer = null;
                window.setTimeout(
                  function() {
                    console.log(">>> resolve: " + JSON.stringify(ids));
                    console.log(elems);
                    resolve(elems);
                    console.log("<<< resolve");
                  },
                  50
                );
              }
            },
            50
          );
        }
      );
    },
    step1: function(code) {
      var url = 'http://www.cadastre.gouv.fr/scpc/afficherRechercherPlanCad.do';
      //var code = prompt("section-parcelle Commune :", "AB-2116 collonges-au-mont-d'or");
      //var code = "AB-2116 collonges-au-mont-d'or";
      var rx = /^[ \t]*([^ ,;-]+)[ ,-]+([^ ,;\t]+)[ ,;\t]+(.+)/;
      var matches = rx.exec(code);
      var section = matches[1];
      var parcelle = matches[2];
      var ville = matches[3].trim();
      location.href = url + "?ville=" + encodeURIComponent(ville)
        + "&sectionLibelle=" + encodeURIComponent(section)
        + "&numeroParcelle=" + encodeURIComponent(parcelle);
    },
    step2: function() {
      Tlk.on("#rech").then(
        function(elems) {
          var form = elems[0];
          form.submit();
        }
      );
    },
    step3: function() {
      Tlk.on(["#codeCommune", "#onglet table.resonglet"]).then(
        function(elems) {
          var select = elems[0];
          if (select) {
            var options = select.querySelectorAll("option");
            var screen = div(
              {
                "z-index": 999999,
                position: "fixed",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,.8)",
                overflow: "auto"
              }
            );
            var container = div(
              {
                position: "relative",
                left: "50%",
                top: "50%",
                width: "320px",
                height: "240px",
                overflow: "auto",
                padding: "16px",
                margin: "-120px -160px",
                color: "#eef"
              }
            );
            screen.appendChild(container);
            document.body.appendChild(screen);

            function newA(code, text) {
              a = tag(
                "a",
                {
                  display: "block",
                  "line-height": "24px",
                  color: "#dfd",
                  "font-size": "15px"
                }
              );
              a.textContent = text;
              a.setAttribute(
                "href", "#" + code + ""
              );
              a.addEventListener(
                "click",
                function(evt) {
                  evt.preventDefault();
                  document.getElementById("codeCommune").value = code;
                  document.getElementById("rech").submit();
                },
                false
              );
              return a;
            }

            var k, option, a, code;
            for (k = 0 ; k < options.length ; k++) {
              option = options[k];
              code = option.getAttribute("value");
              if (code == '') continue;
              container.appendChild(newA(code, option.textContent));
            }
          } else {
            var tableResult = elems[1];
            var links = tableResult.querySelectorAll("a[onclick]");
            var link;
            for (k = 0 ; k < links.length ; k++) {
              link = links[k].getAttribute("onclick");
              if (link.substr(0, 6) == 'popup(') {
                link = link.substr(7);
                link = link.substr(0, link.length - 8);
                location.href = link;
                break;
              }
            }
          }
        }
      );
    },
    step4: function() {
      Tlk.on(["#title_simples_impression"]).then(
        function(elems) {
          console.log("first click");
          console.log(elems);
          var h3 = elems[0];
          return later(1000, h3);
        }
      ).then(
        function(h3) {
          h3.dispatchEvent(new Event("click"));
          return Tlk.on("a[onclick='myMenu.avance();myMenu.impression();']");
        }
      ).then(
        function(elems) {
          console.log("second click");
          console.log(elems);
          console.log("A");
          console.log(elems[0].outerHTML);
          console.log("B");
          elems[0].dispatchEvent(new Event("click"));
          return Tlk.on("a[onclick='dgebId(\\'tool_avances_impressions_extrait\\').onclick();']");
        }
      ).then(
        function(elems) {
          console.log("third click");
          elems[0].dispatchEvent(new Event("click"));
          return Tlk.on("#tool_avances_impression_scale");
        }
      ).then(
        function(elems) {
          elems[0].value = "1000";
          return Tlk.on("a[onclick='carte.getWorker().validate();']");
        }
      ).then(
        function(elems) {
          elems[0].dispatchEvent(new Event("click"));
        }
      );
    }
  };
})();
