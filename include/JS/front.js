// common component --------------------------------------------------
/**
 * [api_path 取得網址路徑]
 */
const api_path = "jameshsu";
/**
 * [token 密鑰]
 */
const token = "CAKwbIj95NgKmO5WkT345TSo3PB2";
/**
 * [productWrap DOM-商品列表外層]
 */
const productWrap = document.querySelector(".productWrap");
/**
 * [productSelect DOM-下拉選單商品分類]
 */
const productSelect = document.querySelector(".productSelect");
/**
 * [shoppingCart DOM-購物車table]
 */
const shoppingCart = document.querySelector(".shoppingCart-table");

// api function -------------------------------------------------------
/**
 * [getProductList api-取得產品列表]
 */
function getProductList() {
	axios
		.get(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
		)
		.then(function (response) {
			allData = response.data.products;
			// console.log(response.data);
			renderProduct(allData);
			filterOption(allData);
		})
		.catch(function (error) {
			// console.log(error.response.data.product);
		});
}

/**
 * [getCartList api-取得購物車列表]
 */
function getCartList() {
	axios
		.get(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
		)
		.then(function (response) {
			cartList = response.data.carts;
			renderCartList(cartList);
		});
}

/**
 * [addCartItem api-加入購物車]
 * @param   {[string]}  productId  [productId 產品ID]
 * @param   {[string]}  productTitle  [productTitle 產品名稱]
 */
function addCartItem(productId, productTitle) {
	axios
		.post(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
			{
				data: {
					productId: productId,
					quantity: 1,
				},
			}
		)
		.then(function (response) {
			alert(`${productTitle} 已成功加入購物車`);
			getCartList();
		});
}

/**
 * [deleteAllCartList api-刪除購物車所有品項]
 */
function deleteAllCartList() {
	axios
		.delete(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
		)
		.then(function (response) {
			alert(`購物車已清空`);
			shoppingCart.innerHTML = "";
		});
}

/**
 * [deleteCartItem api-刪除購物車特定商品]
 * @param   {[string]}  cartId  [cartId 單筆購物車Id]
 * @param   {[string]}  productTitle [cartTitle 商品名稱]
 */
function deleteCartItem(cartId, productTitle) {
	axios
		.delete(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
		)
		.then(function (response) {
			// console.log(response.data);
			alert(`${productTitle} 已移出購物車`);
			getCartList();
		});
}

/**
 * [editCartNum api-編輯購物車商品數量]
 * @param   {[string]}  editId   [editId 單筆購物車Id]
 * @param   {[string]}  editNum  [editNum 數量]
 */
function editCartNum(editId, editNum) {
	axios
		.patch(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
			{
				data: {
					id: editId,
					quantity: editNum,
				},
			}
		)
		.then(function (response) {
			// console.log(response.data);
			getCartList();
		});
}

// calc function ------------------------------------------------------
/**
 * [filterOption calc-篩選分類]
 */
function filterOption(allData) {
	// 選出分類
	let category = {};
	allData.forEach((item) => {
		if (!category[item.category]) {
			category[item.category] = 1;
		} else {
			category[item.category]++;
		}
	});
	category = Object.keys(category);
	category.unshift("全部");
	renderProductSelect(category);

	// 點擊productSelect
	productSelect.addEventListener("click", (e) => {
		let target = e.target.value;
		let filterData = allData.filter((item) => {
			return target == item.category;
		});
		if (target == "全部") filterData = allData;
		renderProduct(filterData);
	});
}

/**
 * [addEventListener 點擊加入購物車]
 */
productWrap.addEventListener("click", (e) => {
	let productId = e.target.dataset.id;
	let productTitle = e.target.dataset.title;
	if (productId != undefined && productTitle != undefined) {
		addCartItem(productId, productTitle);
	}
});

/**
 * [addEventListener 點擊購物車]
 */
shoppingCart.addEventListener("click", (e) => {
	// 清空購物車
	let target = e.target.dataset.clearall;
	if (target == true) {
		deleteAllCartList();
	}

	// 移除特定商品
	let clearId = e.target.dataset.clearid;
	let clearTitle = e.target.dataset.cleartitle;
	if (clearId != undefined && clearTitle != undefined) {
		deleteCartItem(clearId, clearTitle);
	}

	// 修改數量
	let editId = e.target.dataset.editid;
	let editNum = parseInt(e.target.dataset.editnum);
	let editTitle = e.target.dataset.edittitle;
	if (editId != undefined && editNum != undefined && editTitle != undefined) {
		if(editNum == 0){
			deleteCartItem(editId, editTitle);
		}
		editCartNum(editId, editNum);
	}
});

// render function ----------------------------------------------------
/**
 * [renderProduct 選染商品]
 * @param   {[object]}  product  [要渲染的商品]
 */
function renderProduct(product) {
	let template = "";
	product.forEach((item) => {
		template += `<li class="productCard">
        <h4 class="productType">${item.category}</h4>
        <img src="${item.images}" alt="">
        <a class="addCardBtn" href="javascript: void(0);" data-id="${item.id}" data-title="${item.title}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
        </li>`;
	});
	productWrap.innerHTML = template;
}

/**
 * [renderProductSelect 渲染篩選分類]
 * @param   {[array]}  category  [category 篩選過的商品]
 */
function renderProductSelect(category) {
	let template = "";
	category.forEach((item) => {
		template += `<option value="${item}">${item}</option>`;
	});
	productSelect.innerHTML = template;
}

/**
 * [renderCartList 渲染購物車]
 * @param   {[object}  cartList  [cartList 購物車商品]
 */
function renderCartList(cartList) {
	let template = `<tr>
	<th width="40%">品項</th>
	<th width="15%">單價</th>
	<th width="15%">數量</th>
	<th width="15%">金額</th>
	<th width="15%"></th>
	</tr>`;
	let total = 0;
	cartList.forEach((item) => {
		template += `
		<tr>
		<td><div class="cardItem-title">
		<img src="${item.product.images}" alt="">
		<p>${item.product.title}</p>
		</div></td>
		<td>${item.product.price}</td>
		<td>
			<div class="cartAmount">
				<a href="javascript: void(0);" class="material-icons" data-editid="${item.id}" data-editnum="${item.quantity - 1}" data-edittitle="${item.product.title}">remove</a>
				${item.quantity}
				<a href="javascript: void(0);" class="material-icons" data-editid="${item.id}" data-editnum="${
					item.quantity + 1
				}" data-edittitle="${item.product.title}">add</a>
			</div>
		</td>
		<td>NT$${item.product.price * item.quantity}</td>
		<td class="discardBtn"><a class="material-icons" href="javascript: void(0);" data-clearid='${
			item.id
		}' data-cleartitle='${item.product.title}'>clear</a></td>
		</tr>`;
		total += parseInt(item.product.price * item.quantity);
	});
	template += `<tr>
		<td><a class="discardAllBtn" href="javascript: void(0);" data-clearall='1' >刪除所有品項</a></td>
		<td></td>
		<td></td>
		<td>
		<p>總金額</p>
		</td>
		<td>NT$${total}</td></tr>`;
	// console.log(cartList);
	if (cartList.length == 0) template = "";
	shoppingCart.innerHTML = template;
}

/**
 * [init 初始化]
 */
function init() {
	getProductList();
	getCartList();
}

/**
 * [onload 畫面loading完後執行]
 */
window.onload = function () {
	scrollTo();
	init();
};

/**
 * [scrollTo 平緩滾動]
 */
function scrollTo() {
	const links = document.querySelectorAll(".scroll");
	links.forEach((each) => (each.onclick = scrollAnchors));
}
function scrollAnchors(e, respond = null) {
	const distanceToTop = (el) => Math.floor(el.getBoundingClientRect().top);
	e.preventDefault();
	var targetID = respond
		? respond.getAttribute("href")
		: this.getAttribute("href");
	const targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
	const originalTop = distanceToTop(targetAnchor);
	window.scrollBy({ top: originalTop - 120, left: 0, behavior: "smooth" });
	const checkIfDone = setInterval(function () {}, 500);
}

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
