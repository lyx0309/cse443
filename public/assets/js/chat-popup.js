document.getElementsByTagName("BODY")[0].insertAdjacentHTML("afterBegin", `<a id="chatpopup" href="#" style="position: fixed;bottom: 74px;right: 28px;z-index: 1000;" target="_blank"><img src="assets/img/kaseh-chatbot.png" width="180"></a>`)
document.getElementById("chatpopup").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementsByTagName("BODY")[0].insertAdjacentHTML("afterBegin", `<div id="nubideskChatWindow" style="position:fixed;z-index:1100;bottom:74px;right:28px;top:10%;background-color:#000000aa;max-width:500px;width:90%;overflow:hidden;border-radius:8px;box-shadow: 0px 0px 15px #000000aa;">
    <div style="position:relative;width:100%;height:100%;">
      <a id="closeChatWindow" href="#" style="position:absolute;right:10px;top:10px;z-index:1000;"><img src="assets/img/icon-chat-close.svg" width="25" /></a>
      <iframe style="position:absolute;top:0;left:0;" src="https://vpc-nubidesk.nubitel.io:7000/KtmbBot/Chat/ChatClient.aspx?motive=1&amp;motiveText=KtmbBot&amp;name=Guest&amp;email=guest@gmail.com&amp;question=&amp;country=14" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>`);

  document.getElementById("closeChatWindow").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("nubideskChatWindow").remove();
  });
});