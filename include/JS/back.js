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
const orderTable = document.querySelector('.orderPage-table');

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
            let product = {}
            let category = {}
			productList.forEach((item) => {
                // 品項名稱
                if (!product[item.title]) {
                    product[item.title] = 0;
                } 
                // 分類
                if (!category[item.category]) {
                    category[item.category] = 0;
                } 
            })
            calcChart(product, category, allData)
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
            renderOderList(allData)
            getProductList(allData);
		});
}

// calc function ------------------------------------------------------
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
            product[item.title] += parseInt(item.quantity)
        })
    })
    // console.log(Object.entries(product))
    renderChart('#chart2', Object.entries(product))

    // 算分類數量
    allData.forEach((item) => {
        item.products.forEach((item) => {
            // console.log(item.category)
            category[item.category] += parseInt(item.quantity)
        })
    })
    // console.log(Object.entries(category))
    renderChart('#chart1', Object.entries(category))
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
		let productsInfo = ``
        item.products.forEach((item) => {
            productsInfo += `<li>${item.title} ${item.quantity} 個</li>`
        })
        let date = new Date(item.createdAt* 1000).toLocaleDateString();

        template += `<tr>
        <td>${item.createdAt}</td>
        <td>
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
        <p><ul>${productsInfo}</ul></p>
        </td>
        <td>${date}</td>
        <td class="orderStatus"><a href="#">未處理</a></td>
        <td>
        <input class="delSingleOrder-Btn" type="button" value="刪除">
        </td></tr>`;
	});
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
            pattern: ['#5a189a', '#7b2cbf', '#9d4edd', '#c77dff', '#ffc4d6', '#ffa6c1', '#ff87ab', '#ff5d8f', ]
        }
        
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
	scrollTo();
	init();
    getProductList()
};



