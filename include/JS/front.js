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
/**
 * [oderForm DOM-訂單表格]
 */
const oderForm = document.querySelector(".orderInfo-form");
/**
 * [querySelectorAll DOM-所有的填寫訂單欄位]
 */
const oderInput = document.querySelectorAll(".orderInfo-input");
/**
 * [subOderBtn DOM-送出訂單按鈕]
 */
const subOderBtn = document.querySelector(".orderInfo-btn");
/**
 * [constraints 驗證格式規範]
 */
const constraints = {
	姓名: {
		presence: {
			message: "是必填欄位",
		},
	},
	電話: {
		presence: {
			message: "是必填欄位",
		},
		length: {
			minimum: 8,
			message: "至少要8碼以上",
		},
	},
	Email: {
		presence: {
			message: "是必填欄位",
		},
		email: {
			email: true,
			message: "格式不正確",
		},
	},
	寄送地址: {
		presence: {
			message: "是必填欄位",
		},
	},
	交易方式: {
		presence: {
			message: "是必填欄位",
		},
	},
};

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
			getCartList();
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

/**
 * [createOrder api-建立訂單]
 *
 * @param   {[object]}  user  [user 訂單資料]
 */
function createOrder(user) {
	axios
		.post(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
			{
				data: {
					user: user,
				},
			}
		)
		.then(function (response) {
			console.log(response.data);
			alert("訂單已送出");
			getCartList();
			oderForm.reset();
		})
		.catch(function (error) {
			console.log(error.response.data);
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
	productSelect.addEventListener("change", (e) => {
		let target = e.target.value;
		let filterData = allData.filter((item) => {
			return target == item.category;
		});
		if (target == "全部") filterData = allData;
		renderProduct(filterData);
	});
}

/**
 * [addEventListener calc-點擊商品加入購物車]
 */
productWrap.addEventListener("click", (e) => {
	let productId = e.target.dataset.id;
	let productTitle = e.target.dataset.title;
	if (productId != undefined && productTitle != undefined) {
		addCartItem(productId, productTitle);
	}
});

/**
 * [addEventListener calc-點擊購物車]
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
		if (editNum == 0) {
			deleteCartItem(editId, editTitle);
		}
		editCartNum(editId, editNum);
	}
});

/**
 * [subOder calc-送出訂單]
 */
function subOder() {
	subOderBtn.addEventListener("click", () => {
		let success = 0
		// 驗證格式並將報錯選染畫面
		oderInput.forEach((item) => {
			item.nextElementSibling.textContent = "";
			let errors = validate(oderForm, constraints);
			if (errors) {
				Object.keys(errors).forEach((keys) => {
					document.querySelector(`[data-message= "${keys}"]`).textContent =
						errors[keys];
				});
			} 
			else {
				success++
			}
		});

		// 送出訂單
		// 所有欄位皆填寫
		if(success == 5) {
			let user = {};
			const name = document.querySelector("#customerName").value.trim().toLowerCase();
			const phone = document.querySelector("#customerPhone").value.trim().toLowerCase();
			const email = document.querySelector("#customerEmail").value.trim().toLowerCase();
			const address = document.querySelector("#customerAddress").value.trim().toLowerCase();
			const tradeWay = document.querySelector("#tradeWay").value.trim().toLowerCase();

			user.name = name;
			user.tel = phone;
			user.email = email;
			user.address = address;
			user.payment = tradeWay;

			// 判斷購物車裡是否有商品
			if(shoppingCart.dataset.haveproduct == 0) {
				alert(`當前購物車內沒有產品，所以無法送出訂單 RRR ((((；゜Д゜)))`);
				return
			}
			// 送出訂單
			createOrder(user);
		}
	});
}

// render function ----------------------------------------------------
/**
 * [renderProduct render-選染商品]
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
 * [renderProductSelect render-渲染篩選分類]
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
 * [renderCartList render-渲染購物車]
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
				<a href="javascript: void(0);" class="material-icons" data-editid="${
					item.id
				}" data-editnum="${item.quantity - 1}" data-edittitle="${
			item.product.title
		}">remove</a>
				${item.quantity}
				<a href="javascript: void(0);" class="material-icons" data-editid="${
					item.id
				}" data-editnum="${item.quantity + 1}" data-edittitle="${
			item.product.title
		}">add</a>
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

	if (cartList.length == 0) {
		template =
			"<div style='display: flex; justify-content: center; align-items: center; gap: 10px; flex-direction: column;'><p>購物車是空的？ 是在哈囉？ 還不快逛起來買起來！</p><a class='discardAllBtn scroll' href='#productList'>現在就去逛逛！</a></div>";
		// 讓渲染出來的按鈕可以吃到scrollTo()
		shoppingCart.innerHTML = "";
		shoppingCart.insertAdjacentHTML("beforeend", template);
		scrollTo();
		shoppingCart.setAttribute("data-haveproduct", "0");
	} else {
		shoppingCart.innerHTML = template;
		shoppingCart.setAttribute("data-haveproduct", "1");
	}
}


/**
 * [init 初始化]
 */
function init() {
	getProductList();
	getCartList();
	subOder();
}

/**
 * [onload 畫面loading完後執行]
 */
window.onload = function () {
	init();
};
