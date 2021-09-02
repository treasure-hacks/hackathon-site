function goToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
setInterval(function () {
  var x = document.getElementById("black-square");
  if (window.scrollY < 200) {
    x.style.display = "none";
  }
  else {
    x.style.display = "none";
  }
}, 1);

function home() {
  window.location.replace('index.html');
}


var countDownDate = new Date("Sep 4, 2021 8:00:00").getTime();
if (window.location.pathname == '/dates.html') {
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("countdown").innerHTML = "EXPIRED";
    }
  }, 1000);
}
var countDownDate2 = new Date("Oct 9, 2021 8:00:00").getTime();
if (window.location.pathname == '/dates.html') {
  var y = setInterval(function () {
    var now2 = new Date().getTime();
    var distance2 = countDownDate2 - now2;
    var days2 = Math.floor(distance2 / (1000 * 60 * 60 * 24));
    var hours2 = Math.floor((distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes2 = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
    var seconds2 = Math.floor((distance2 % (1000 * 60)) / 1000);
    document.getElementById("countdown2").innerHTML = days2 + "d " + hours2 + "h "
      + minutes2 + "m " + seconds2 + "s ";
    if (distance2 < 0) {
      clearInterval(y);
      document.getElementById("countdown2").innerHTML = "EXPIRED";
    }
  }, 1000);
}


var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}




let toggle = document.getElementById("hamburger");

toggle.addEventListener("click", function () {
  if (toggle.className === "fa fa-bars hamburger fa-lg"){
    toggle.className = "fa fa-times hamburger fa-lg";
    var smenu = document.createElement("nav");
    smenu.id = "menu-on-small";
    document.body.appendChild(smenu);
    document.getElementById("navigation").style.boxShadow = "none";
    var x;
	
	smenu.style.height = "0px";
	
    x = smenu.appendChild(document.createElement("a"));
    x.href = "/dates.html";
    x.innerHTML = "Dates";
    x.className = "menu-item"

    x = smenu.appendChild(document.createElement("a"));
    x.href = "/team.html";
    x.innerHTML = "Team";
    x.className = "menu-item"

    x = smenu.appendChild(document.createElement("a"));
    x.href = "/sponsorship-information.pdf";
    x.innerHTML = "Sponsor Us";
    x.className = "menu-item"

    x = smenu.appendChild(document.createElement("a"));
    x.href = "https://docs.google.com/forms/d/1C-KtST6-cQaMofAhXzPbXKvx80VH8ZhEvDJncBpmrHg";
    x.innerHTML = "Register";
    x.className = "menu-item"

    x = smenu.appendChild(document.createElement("a"));
    x.href = "https://bank.hackclub.com/donations/start/treasure-hacks";
    x.innerHTML = "Donate";
    x.className = "menu-item"
	
	
	
  }
  else{
    document.getElementById("menu-on-small").remove();
    toggle.className = "fa fa-bars hamburger fa-lg";
    document.getElementById("navigation").style.boxShadow = "0px 0px 8px 0px rgb(0 0 0)";
  }
});
