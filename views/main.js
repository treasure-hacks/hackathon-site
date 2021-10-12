var countDownDate = new Date("Oct 15, 2021 17:00:00").getTime();
if (window.location.pathname == '/schedule.html') {
  var y = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";
    if (distance < 0) {
      clearInterval(y);
      document.getElementById("countdown").innerHTML = "In Progress!";
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
	
	
    x = smenu.appendChild(document.createElement("a"));
    x.href = "/schedule.html";
    x.innerHTML = "Schedule";
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
    x.href = "https://docs.google.com/forms/d/e/1FAIpQLSfd1cNojHTgsXazii8Q-WoecmSdOxn94rCEJb_q_A6R29Ribw/viewform";
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



window.addEventListener('mouseover', function(e) {
    categoryDetails(e.target);
});
window.addEventListener('click', function(e) {
	resetAll()
	categoryDetails(e.target);
});
function categoryDetails(target){
	switch(target.id) {
		case "best-overall": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Best Overall";
			document.getElementById("category-description").innerHTML = "The \"Best Solo Hack\" award will be given to a single hacker with the best solo project in the entire Hackathon.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include 1 $30 Amazon Gift Card For Each Group Member, 1 Cloud Stinger Headsets For Each Group Member, and 1 Alloy FPS RGB Refurb Keyboard For Each Group Member.";
			
			break;

		}
		case "best-solo": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Best Solo Hack";
			document.getElementById("category-description").innerHTML = "The \"Best Overall\" award will be given to a hacker or team who best demonstrates their project&rsquo;s creativity, practicality, engineering excellence, and presentation.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include 1 $30 Amazon Gift Card, 1 Cloud Stinger Headset, 1 Alloy FPS RGB Refurb Keyboard, and 1 Goliath Automation and Robotics Monster Kit.";
			break;
		}
		case "best-duo": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Best Duo Hack";
			document.getElementById("category-description").innerHTML = "Collaboration skills are super important in the programming world! The \"Best Duo Hack\" award will be given to a team of two hackers with the best project.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include 1 $30 Amazon Gift Card Each, 1 Cloud Stinger Headset Each, and 1 Alloy FPS RGB Refurb Keyboard Each.";
			break;
		}
		case "most-aesthetically-pleasing": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Most Aesthetically Pleasing";
			document.getElementById("category-description").innerHTML = "Are you a creative and artistic person? The \"Most Aesthetically Pleasing\" award will be given to the project with the most polish, best presentation, and most intuitive user experience.";
			document.getElementById("category-prizes").innerHTML = "The prize for this category is 1 $30 Amazon Gift Card.";
			break;
		}
		case "most-people-helped": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Most People Helped";
			document.getElementById("category-description").innerHTML = "At Treasure Hacks, we value teamwork and working together. The \"Most People Helped\" award will be given to the hacker who has helped the most other groups complete their projects.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include 1 $30 Amazon Gift Card Each, 1 Cloud Stinger Headset Each, and 1 Alloy FPS RGB Refurb Keyboard Each.";
			break;
		}
		case "qoom": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Best Qoom Hack";
			document.getElementById("category-description").innerHTML = "Qoom is a dream tool built to bring anything you imagine into reality with seamless development tools to create projects with HTML, CSS, and Javascript. This award will be given to the best project using Qoom.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include a 1-Year Pro Plan Package, a feature on Qoom, and an invitation to the Qoom Creator Group";
			break;
		}
		case "sashido": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "Best Sashido Hack";
			document.getElementById("category-description").innerHTML = "SashiDo is offering a special prize for the most original Image project build with SashiDo & Teachable Machine by Google.";
			document.getElementById("category-prizes").innerHTML = "Prizes for this category include a short blog post on SashiDo social media, a possible internship, and a special prize from Sashido.";
			break;
		}
		case "all-participants": {
			resetAll();
			target.style.borderBottom = "3px solid black";
			target.style.paddingBottom = "10px";
			document.getElementById("category-title").innerHTML = "All Participants";
			document.getElementById("category-description").innerHTML = "We also offer prizes for all of our participants!";
			document.getElementById("category-prizes").innerHTML = "Each participant will receive a Treasure Hacks sticker, a Hack club Sticker, an Echo3D business plan, a Replit subscription, $120 Sashido credits, an InterviewCake subscription, a Qoom subscription, and a Treasure Hacks T-shrit.";
			break;
		}
	}
}
function resetAll(){
	var list = ["best-overall","best-solo","best-duo","most-aesthetically-pleasing","most-people-helped","qoom","sashido", "all-participants"];
	for (var i = 0; i < list.length; i++){
		document.getElementById(list[i]).style.border = "none";
		document.getElementById(list[i]).style.paddingBottom = "13px";
	}
}