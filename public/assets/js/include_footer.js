function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /* search for elements with a certain attribute: */
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
            /* Execute scripts within the inserted HTML: */
            var scripts = elmnt.getElementsByTagName("script");
            for (var j = 0; j < scripts.length; j++) {
              if (scripts[j].src) {
                /* External script, create a new script element and set its src attribute */
                var newScript = document.createElement("script");
                newScript.src = scripts[j].src;
                /* Use the onload event to ensure the script is executed after it's loaded */
                newScript.onload = function() {
                  // Script loaded and executed
                };
                document.head.appendChild(newScript);
              } else {
                /* Inline script, create a new script element and set its innerHTML */
                var newScript = document.createElement("script");
                newScript.innerHTML = scripts[j].innerHTML;
                document.head.appendChild(newScript);
              }
            }
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
