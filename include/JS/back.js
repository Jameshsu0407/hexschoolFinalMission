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
 * [orderTable DOM-訂單表格]
 */
const orderTable = document.querySelector(".orderPage-table");
/**
 * [querySelector DOM-刪除所有訂單按鈕]
 */
const delAllOderBtn = document.querySelector(".delAllOderBtn");
/**
 * [querySelector DOM-訂單狀態按鈕]
 */
const orderStatusBtn = document.querySelector(".orderStatusBtn")

// api function -------------------------------------------------------
/**
 * [getProductList api-取得產品列表]
 */
function getProductList(allData) {
	axios
		.get(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
		)
		.then(function (response) {
			productList = response.data.products;
			let product = {};
			let category = {};
			productList.forEach((item) => {
				// 品項名稱
				if (!product[item.title]) {
					product[item.title] = 0;
				}
				// 分類
				if (!category[item.category]) {
					category[item.category] = 0;
				}
			});
			calcChart(product, category, allData);
		})
		.catch(function (error) {
			// console.log(error.response.data.product);
		});
}

/**
 * [getOrderList api-取得訂單列表]
 */
function getOrderList() {
	axios
		.get(
			`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
			{
				headers: {
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			let allData = response.data.orders;
			// console.log(allData)
			renderOderList(allData);
			getProductList(allData);
		});
}

/**
 * [deleteAllOrder api-刪除全部訂單]
 */
function deleteAllOrder() {
	axios
		.delete(
			`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
			{
				headers: {
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			console.log(response.data);
			alert(`所有的訂單已刪除`);
			getOrderList();
		});
}

/**
 * [deleteOrderItem api-刪除特定訂單]
 * @param   {[type]}  orderId  [orderId 訂單編號]
 */
function deleteOrderItem(orderId) {
	axios
		.delete(
			`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
			{
				headers: {
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			console.log(response.data);
			alert(`訂單 ${orderId} 已刪除`);
			getOrderList();
		});
}

// 
/**
 * [editOrderList api-修改訂單狀態]
 * @param   {[string]}  orderId  [orderId 訂單編號]
 * @param   {[boolean]}  paid  [paid 付款狀態]
 */
function editOrderList(orderId, paid) {
	axios
		.put(
			`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
			{
				data: {
					id: orderId,
					paid: paid,
				},
			},
			{
				headers: {
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			console.log(response.data);
			getOrderList();
		});
}

// calc function ------------------------------------------------------

/**
 * [addEventListener 刪除整筆訂單]
 */
delAllOderBtn.addEventListener("click", (e) => {
	deleteAllOrder();
});

/**
 * [addEventListener calc-點擊渲染後的訂單表格]
 */
orderTable.addEventListener("click", (e) => {
	// 刪除特定訂單
	let orderId = e.target.dataset.orderid;
	if (orderId != undefined) {
		deleteOrderItem(orderId);
	}

	// 修改訂單狀態
	let paidStatus = (e.target.dataset.paid) === "true";
	let paidId = e.target.dataset.paidid;
	console.log(paidStatus)
	if(paidStatus != undefined && paidId != undefined){
		editOrderList(paidId, paidStatus)
	}
});

/**
 * [calcChart calc-計算圖表]
 *
 * @param   {[object]}  product   [product 商品列表]
 * @param   {[object]}  category  [category 分類列表]
 * @param   {[object]}  allData   [allData 所有訂單資訊]
 */
function calcChart(product, category, allData) {
	// 算商品數量
	allData.forEach((item) => {
		item.products.forEach((item) => {
			product[item.title] += parseInt(item.quantity);
		});
	});
	// console.log(Object.entries(product))
	product = Object.entries(product);
	product = product.filter((item) => {
		return item[1] > 0;
	});
	renderChart("#chart2", product);

	// 算分類數量
	allData.forEach((item) => {
		item.products.forEach((item) => {
			// console.log(item.category)
			category[item.category] += parseInt(item.quantity);
		});
	});
	// console.log(Object.entries(category))
	category = Object.entries(category);
	category = category.filter((item) => {
		return item[1] > 0;
	});
	renderChart("#chart1", category);
}

// render function ----------------------------------------------------
/**
 * [renderOderList 渲染訂單表格]
 * @param   {[object]}  oderList  [oderList 訂單資料]
 */
function renderOderList(oderList) {
	let template = `<thead><tr>
    <th>訂單編號</th>
    <th>聯絡人</th>
    <th>聯絡地址</th>
    <th>電子郵件</th>
    <th>訂單品項</th>
    <th>訂單日期</th>
    <th>訂單狀態</th>
    <th>操作</th>
    </tr></thead>`;
	oderList.forEach((item) => {
		// 計算該訂單有幾個商品
		let productsInfo = ``;
		item.products.forEach((item) => {
			productsInfo += `<li>${item.title} ${item.quantity} 個</li>`;
		});
		// 日期
		let date = new Date(item.createdAt * 1000).toLocaleDateString();
		let time = new Date(item.createdAt * 1000).toLocaleTimeString([], {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
		// 付款狀態
		let paidText = ""
		if(item.paid == true) {
			paidText = '已付款';
			item.paid = false;
		}
		else if (item.paid == false){
			paidText = '未處理';
			item.paid = true;
		}
		console.log(item.paid)
		template += `<tr>
        <td>${item.id}</td>
        <td>
        <p>${item.user.name}</p>
        <p><a href="tel: ${item.user.tel}">${item.user.tel}</a></p>
        </td>
        <td>${item.user.address}</td>
        <td><a href="mailto:${item.user.email}">${item.user.email}</a></td>
        <td>
        <p><ul>${productsInfo}</ul></p>
        </td>
        <td><p>${date}</p><p>${time}</p></td>
        <td class="orderStatus"><a href="javascript: void(0)" class="orderStatusBtn"  data-paid="${item.paid}" data-paidid="${item.id}">${paidText}</a></td>
        <td>
        <input class="delSingleOrder-Btn" type="button" value="刪除" data-orderid="${item.id}">
        </td></tr>`;
	});
	// 沒有訂單
	if (oderList.length == 0) {
		delAllOderBtn.style.display = "none";
		template = `<thead><tr><th>沒有訂單資料</th></tr></thead>`;
	} else {
		delAllOderBtn.style.display = "block";
	}
	orderTable.innerHTML = template;
}

/**
 * [renderChart 渲染圖表]
 * @param   {[type]}  bindId  [bindId 要綁定的DOM]
 * @param   {[type]}  data    [data 圖表要的資料]
 */
function renderChart(bindId, data) {
	c3.generate({
		bindto: bindId,
		data: {
			type: "pie",
			columns: data,
		},
		color: {
			pattern: [
				"#5a189a",
				"#7b2cbf",
				"#9d4edd",
				"#c77dff",
				"#ffc4d6",
				"#ffa6c1",
				"#ff87ab",
				"#ff5d8f",
			],
		},
	});
}

/**
 * [init 初始化]
 */
function init() {
	getOrderList();
	
}

/**
 * [onload 畫面loading完後執行]
 */
window.onload = function () {
	init();
};
