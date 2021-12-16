/**
 * [addEventListener 推薦牆]
 */
 document.addEventListener("DOMContentLoaded", function () {
	const ele = document.querySelector(".recommendation-wall");
	ele.style.cursor = "grab";
	let pos = { top: 0, left: 0, x: 0, y: 0 };
	const mouseDownHandler = function (e) {
		ele.style.cursor = "grabbing";
		ele.style.userSelect = "none";

		pos = {
			left: ele.scrollLeft,
			top: ele.scrollTop,
			// Get the current mouse position
			x: e.clientX,
			y: e.clientY,
		};

		document.addEventListener("mousemove", mouseMoveHandler);
		document.addEventListener("mouseup", mouseUpHandler);
	};
	const mouseMoveHandler = function (e) {
		// How far the mouse has been moved
		const dx = e.clientX - pos.x;
		const dy = e.clientY - pos.y;

		// Scroll the element
		ele.scrollTop = pos.top - dy;
		ele.scrollLeft = pos.left - dx;
	};
	const mouseUpHandler = function () {
		ele.style.cursor = "grab";
		ele.style.removeProperty("user-select");

		document.removeEventListener("mousemove", mouseMoveHandler);
		document.removeEventListener("mouseup", mouseUpHandler);
	};
	// Attach the handler
	ele.addEventListener("mousedown", mouseDownHandler);
});

/**
 * [querySelector menu切換]
 */
let menuOpenBtn = document.querySelector(".menuToggle");
let linkBtn = document.querySelectorAll(".topBar-menu a");
let menu = document.querySelector(".topBar-menu");
menuOpenBtn.addEventListener("click", menuToggle);
linkBtn.forEach((item) => {
	item.addEventListener("click", closeMenu);
});
function menuToggle() {
	if (menu.classList.contains("openMenu")) {
		menu.classList.remove("openMenu");
	} else {
		menu.classList.add("openMenu");
	}
}
function closeMenu() {
	menu.classList.remove("openMenu");
}

/**
 * [scrollTo 平緩滾動]
 */
function scrollTo() {
	const links = document.querySelectorAll(".scroll");
	links.forEach((each) => (each.onclick = scrollAnchors));
}

function scrollAnchors(e, respond = null) {
	e.preventDefault();
	const time = 1000; // you can change this value

	const distanceToTop = (el) => Math.floor(el.getBoundingClientRect().top);
	var targetID = respond
		? respond.getAttribute("href")
		: this.getAttribute("href");
	const targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
	var eTop = distanceToTop(targetAnchor) - 20;
	var eAmt = eTop / 100;
	var curTime = 0;
	while (curTime <= time) {
		window.setTimeout(scrollSmoth, curTime, eAmt);
		curTime += time / 100;
	}
}

function scrollSmoth(eAmt) {
	window.scrollBy(0, eAmt);
}

/**
 * [onload 畫面loading完後執行]
 */
window.onload = function () {
	scrollTo();
};


