const products = [
    { id: 5, name: 'Giường đôi', type: 'Giường', price: 120, image: 'images/image1.jpg', link: 'productdetail5.html', trang_thai: 1 },
    { id: 6, name: 'Gương siêu bự', type: 'Gương', price: 90, image: 'images/mirror4.jpg', link: 'productdetail6.html', trang_thai: 1 },
    { id: 7, name: 'Sofa loại cực êm', type: 'Ghế', price: 260, image: 'images/sofa4.jpg', link: 'productdetail7.html', trang_thai: 1 },
    { id: 9, name: 'Bàn siêu cứng', type: 'Bàn', price: 75, image: 'images/table4.jpg', link: 'productdetail9.html', trang_thai: 1 },
    { id: 10, name: 'Giường gỗ bạch dương', type: 'Giường', price: 300, image: 'images/bed1.jpg', link: 'productdetail10.html', trang_thai: 1 },
    { id: 11, name: 'Giường tiện lợi', type: 'Giường', price: 290, image: 'images/bed2.jpg', link: 'productdetail11.html', trang_thai: 1 },
    { id: 12, name: 'Sofa luxury', type: 'Ghế', price: 250, image: 'images/sofa1.jpg', link: 'productdetail12.html', trang_thai: 1 },
    { id: 13, name: 'Sofa trắng tinh tế', type: 'Ghế', price: 300, image: 'images/sofa2.jpg', link: 'productdetail13.html', trang_thai: 1 },
    { id: 14, name: 'Bàn kính', type: 'Bàn', price: 200, image: 'images/table1.jpg', link: 'productdetail14.html', trang_thai: 1 },
    { id: 15, name: 'Bàn văn phòng', type: 'Bàn', price: 230, image: 'images/table2.jpg', link: 'productdetail15.html', trang_thai: 1 },
    { id: 16, name: 'Gương trang điểm', type: 'Gương', price: 120, image: 'images/mirror1.jpg', link: 'productdetail16.html', trang_thai: 1 },
    { id: 17, name: 'Gương mặt trời', type: 'Gương', price: 120, image: 'images/mirror2.jpg', link: 'productdetail17.html', trang_thai: 1 },
    { id: 18, name: 'Giường luxury', type: 'Giường', price: 1000, image: 'images/bed5.jpg', link: 'productdetail18.html', trang_thai: 1 },
    { id: 19, name: 'Sofa loại tốt', type: 'Ghế', price: 200, image: 'images/sofa5.jpg', link: 'productdetail19.html', trang_thai: 1 },
    { id: 20, name: 'Bàn gỗ sồi', type: 'Bàn', price: 900, image: 'images/table5.jpg', link: 'productdetail20.html', trang_thai: 1 }
];

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    const map = {
        'a': 'áàảãạăắằẳẵặâấầẩẫậ',
        'e': 'éèẻẽẹêếềểễệ',
        'i': 'íìỉĩị',
        'o': 'óòỏõọôốồổỗộơớờởỡợ', 
        'u': 'úùủũụưứừửữự',
        'y': 'ýỳỷỹỵ',
        'd': 'đ',
    };

    return str.split('').map(char => {
        for (let key in map) {
            if (map[key].indexOf(char) !== -1) {
                return key;
            }
        }
        return char;
    }).join('');
}

// Lấy tham số từ URL và loại bỏ khoảng trắng thừa
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const tensp = (urlParams.get('tensp') || '').trim();  // Loại bỏ khoảng trắng thừa
    const type_products = parseInt(urlParams.get('type_products')) || 0; // Chuyển loại sản phẩm thành số
    const min = parseInt(urlParams.get('min')) || 0;
    const max = parseInt(urlParams.get('max')) || Infinity;
    return { tensp, type_products, min, max };
}

// Tìm kiếm sản phẩm từ các tham số URL
function searchProductsFromURL() {
    const { tensp, type_products, min, max } = getQueryParams();

    // Loại bỏ dấu và chuyển về chữ thường
    const normalizedTensp = removeVietnameseTones(tensp.toLowerCase());

    const filteredProducts = products.filter(product => {
        // Tìm kiếm tên sản phẩm không phân biệt dấu và chữ hoa chữ thường
        const normalizedName = removeVietnameseTones(product.name.toLowerCase());
        const matchesName = normalizedName.includes(normalizedTensp);

        // So sánh loại sản phẩm, kiểm tra nếu loại sản phẩm trong URL không phải 0
        const matchesType = type_products === 0 || product.type.toLowerCase() === getProductType(type_products).toLowerCase();

        // Tìm kiếm theo giá (nếu có, nếu không sẽ bỏ qua)
        const matchesPrice = product.price >= min && product.price <= max;

        return matchesName && matchesType && matchesPrice;
    });

    displayProducts(filteredProducts);
}

// Tìm loại sản phẩm từ mã số
function getProductType(typeId) {
    const types = ["Giường", "Ghế", "Bàn", "Gương"];
    return types[typeId - 1] || "";  // Loại trả về theo loại số (1, 2, 3, 4)
}

// Hiển thị các sản phẩm đã lọc và phân trang
function displayProducts(products) {
    const resultsContainer = document.querySelector(".col-sm-8 .row");
    const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi trang
    const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;

    const totalPages = Math.ceil(products.length / itemsPerPage); // Tổng số trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedProducts = products.slice(startIndex, endIndex); // Lọc sản phẩm theo trang

    resultsContainer.innerHTML = ""; // Xóa kết quả cũ

    if (paginatedProducts.length === 0) {
        resultsContainer.innerHTML = "<p>Không có sản phẩm phù hợp.</p>";
    }

    paginatedProducts.forEach(product => {
        const productCard = `
            <div class="col-md-6">
                <div class="card mb-4 shadow-sm">
                    <a href="${product.link}">
                        <img class="bd-placeholder-img card-img-top" width="100%" height="350" src="${product.image}">
                    </a>
                    <div class="card-body">
                        <a href="${product.link}">
                            <h5>${product.name}</h5>
                        </a>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <a class="btn btn-sm btn-outline-secondary" href="${product.link}">Xem chi tiết</a>
                            </div>
                            <small class="text-muted"><b>${product.price}€</b></small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.insertAdjacentHTML("beforeend", productCard);
    });

    // Thêm phân trang
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Xóa phân trang cũ

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("li");
        pageLink.classList.add("page-item");
        pageLink.innerHTML = `<a class="page-link" href="?page=${i}&tensp=${getQueryParams().tensp}&type_products=${getQueryParams().type_products}&min=${getQueryParams().min}&max=${getQueryParams().max}">${i}</a>`;
        paginationContainer.appendChild(pageLink);
    }
}

// Khi trang tải, thực hiện tìm kiếm và hiển thị kết quả
document.addEventListener("DOMContentLoaded", function () {
    searchProductsFromURL();
});
