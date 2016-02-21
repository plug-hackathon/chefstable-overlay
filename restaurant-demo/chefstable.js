(function () {
  var iframe = null;

  window.ChefsTable = {
    setup: function () {
      iframe = document.createElement("iframe");
      iframe.src = "http://localhost:8000";
      iframe.style.display = "none";
      iframe.style.height = "100%";
      iframe.style.width = "100%";
      iframe.style.position = "absolute";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.allowTransparency = true;
      document.querySelector("body").appendChild(iframe);
      addEventListener("message", function (message) {
        var data = JSON.parse(message.data);
        if (data.open === false) {
          iframe.style.display = "none";
        }
      });
    },

    show: function () {
      iframe.style.display = "block";
      iframe.contentWindow.postMessage(JSON.stringify({open: true}), "http://localhost:8000");
    }
  };
}());
