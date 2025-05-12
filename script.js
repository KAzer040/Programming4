// 全局变量
let currentPage = 1;
const itemsPerPage = 12;
let totalPages = 1;
let allRestaurants = [];
let originalRestaurants = []; // 添加一个变量来存储原始数据

// 餐厅数据加载和渲染
async function loadRestaurants() {
    try {
        const response = await fetch('restaurants.json');
        const data = await response.json();
        allRestaurants = data.restaurants;
        originalRestaurants = [...data.restaurants]; // 保存原始数据
        totalPages = Math.ceil(allRestaurants.length / itemsPerPage);
        
        renderRestaurants();
        renderPagination();
        
        // 添加卡片动画效果
        animateCards();
        // 添加阅读更多按钮事件
        addReadMoreEvents();
        // 添加详情按钮事件
        addDetailsEvents();
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

// 渲染餐厅卡片
function renderRestaurants() {
    const container = document.getElementById('restaurantContainer');
    container.innerHTML = ''; // 清空容器
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRestaurants = allRestaurants.slice(startIndex, endIndex);
    
    currentRestaurants.forEach(restaurant => {
        const article = document.createElement('article');
        article.className = 'restaurant-card';
        article.innerHTML = `
            <div class="card-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${restaurant.name}</h3>
                <p><strong>Location:</strong> ${restaurant.location}</p>
                <p><strong>Specialty:</strong> ${restaurant.specialty}</p>
                <p class="features"><strong>Features:</strong> ${restaurant.features}</p>
                <div class="card-buttons">
                    <button class="read-more-btn">Read More</button>
                    <button class="details-btn" data-id="${restaurant.id}">Reserve</button>
                </div>
            </div>
        `;
        container.appendChild(article);
    });
}

// 渲染分页导航
function renderPagination() {
    const container = document.getElementById('restaurantContainer');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-btn';
    prevButton.textContent = '<';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderRestaurants();
            renderPagination();
            // 添加事件监听
            addReadMoreEvents();
            addDetailsEvents();
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // 页码按钮
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderRestaurants();
            renderPagination();
            // 添加事件监听
            addReadMoreEvents();
            addDetailsEvents();
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pageButtons.push(pageButton);
    }
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-btn';
    nextButton.textContent = '>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderRestaurants();
            renderPagination();
            // 添加事件监听
            addReadMoreEvents();
            addDetailsEvents();
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // 添加页码信息
    const pageInfo = document.createElement('span');
    pageInfo.className = 'pagination-info';
    pageInfo.textContent = `Page ${currentPage} , total of ${totalPages} pages`;
    
    // 组装分页导航
    paginationDiv.appendChild(prevButton);
    pageButtons.forEach(btn => paginationDiv.appendChild(btn));
    paginationDiv.appendChild(nextButton);
    paginationDiv.appendChild(pageInfo);
    
    // 移除已存在的分页导航
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // 添加新的分页导航
    container.parentNode.insertBefore(paginationDiv, container.nextSibling);
}

// 卡片动画效果
function animateCards() {
    const cards = document.querySelectorAll('.restaurant-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
}

// 阅读更多按钮功能
function addReadMoreEvents() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.restaurant-card');
            const features = card.querySelector('.features');
            
            if (features.style.maxHeight) {
                features.style.maxHeight = null;
                this.textContent = 'Read More';
            } else {
                features.style.maxHeight = features.scrollHeight + 'px';
                this.textContent = 'Read Less';
            }
        });
    });
}

// 搜索功能
function setupSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for the restaurant number, name, location or features...';
    searchInput.className = 'search-input';
    
    const reservationsBtn = document.createElement('button');
    reservationsBtn.className = 'my-reservations-btn';
    reservationsBtn.textContent = 'My Reservations';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(reservationsBtn);
    
    const restaurantsSection = document.getElementById('restaurants');
    restaurantsSection.insertBefore(searchContainer, document.querySelector('.restaurant-container'));
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm === '') {
            // 如果搜索框为空，恢复原始数据
            allRestaurants = [...originalRestaurants];
        } else {
            // 从原始数据中过滤
            allRestaurants = originalRestaurants.filter(restaurant => {
                const text = `${restaurant.id} ${restaurant.name} ${restaurant.location} ${restaurant.specialty} ${restaurant.features}`.toLowerCase();
                return text.includes(searchTerm);
            });
        }
        
        currentPage = 1;
        totalPages = Math.ceil(allRestaurants.length / itemsPerPage);
        renderRestaurants();
        renderPagination();
        addReadMoreEvents();
        addDetailsEvents();
    });
    
    // 添加预定按钮事件
    reservationsBtn.addEventListener('click', () => {
        const reservationsOverlay = document.getElementById('reservationsOverlay');
        reservationsOverlay.style.display = 'flex';
        loadReservations();
    });
}

// 滚动到顶部按钮
function setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 添加加载动画
function showLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation';
    loadingDiv.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingDiv);
    
    window.addEventListener('load', () => {
        loadingDiv.style.display = 'none';
    });
}

// 详情按钮功能
function addDetailsEvents() {
    const detailsBtns = document.querySelectorAll('.details-btn');
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const restaurantId = this.getAttribute('data-id');
            showRestaurantDetails(restaurantId);
        });
    });
}

// 显示餐厅详情
async function showRestaurantDetails(restaurantId) {
    try {
        const response = await fetch('restaurants.json');
        const data = await response.json();
        const restaurant = data.restaurants.find(r => r.id === parseInt(restaurantId));
        
        if (!restaurant) return;

        // 创建详情页面
        const detailsOverlay = document.createElement('div');
        detailsOverlay.className = 'details-overlay';
        detailsOverlay.innerHTML = `
            <div class="details-container">
                <div class="details-header">
                    <h2>${restaurant.name}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="details-content">
                    <div class="details-image-container">
                        <div class="details-image">
                            <img src="${restaurant.image}" alt="${restaurant.name}">
                        </div>
                        <div id="map" class="restaurant-map"></div>
                        <button class="reserve-btn">Reserve Now</button>
                    </div>
                    <div class="details-info">
                        <div class="info-section">
                            <h3>Location</h3>
                            <p>${restaurant.location}</p>
                        </div>
                        <div class="info-section">
                            <h3>Specialty</h3>
                            <p>${restaurant.specialty}</p>
                        </div>
                        <div class="info-section">
                            <h3>Features</h3>
                            <p>${restaurant.features}</p>
                        </div>
                        <div class="info-section">
                            <h3>Menu Highlights</h3>
                            <ul class="menu-list">
                                <li>${restaurant.specialty}</li>
                                <li>Dim Sum Selection</li>
                                <li>Traditional Chinese Tea</li>
                                <li>Seasonal Specialties</li>
                            </ul>
                        </div>
                        <div class="info-section">
                            <h3>Opening Hours</h3>
                            <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                            <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(detailsOverlay);
        document.body.style.overflow = 'hidden';

        // 初始化地图
        const mapElement = document.getElementById('map'); // 确保地图容器的 ID 是 'map'
        
        // 根据餐厅位置设置地图中心点
        let mapCenter;
        if (restaurant.location.includes('China')) {
            mapCenter = new BMap.Point(104.1954, 35.8617); // 中国
        } else if (restaurant.location.includes('Japan')) {
            mapCenter = new BMap.Point(138.2529, 36.2048); // 日本
        } else if (restaurant.location.includes('Korea')) {
            mapCenter = new BMap.Point(127.7669, 35.9078); // 韩国
        } else if (restaurant.location.includes('Singapore')) {
            mapCenter = new BMap.Point(103.8198, 1.3521); // 新加坡
        } else if (restaurant.location.includes('USA') || restaurant.location.includes('United States')) {
            mapCenter = new BMap.Point(-95.7129, 37.0902); // 美国
        } else if (restaurant.location.includes('UK') || restaurant.location.includes('United Kingdom')) {
            mapCenter = new BMap.Point(-3.4360, 55.3781); // 英国
        } else if (restaurant.location.includes('Australia')) {
            mapCenter = new BMap.Point(133.7751, -25.2744); // 澳大利亚
        } else if (restaurant.location.includes('Canada')) {
            mapCenter = new BMap.Point(-106.3468, 56.1304); // 加拿大
        } else {
            mapCenter = new BMap.Point(-80, -80); // 默认中国
        }
        
        // 创建地图
        const map = new BMap.Map(mapElement); // 创建地图实例
        map.centerAndZoom(mapCenter, 4); // 设置中心点和初始缩放级别
        
        // 添加标记
        const marker = new BMap.Marker(mapCenter); // 创建标记
        map.addOverlay(marker); // 将标记添加到地图上
        
        // 绑定弹窗
        const popupContent = `<b>${restaurant.name}</b><br>${restaurant.location}`;
        const infoWindow = new BMap.InfoWindow(popupContent, {
            width: 200, // 信息窗口宽度
            height: 100, // 信息窗口高度
            title: "餐厅信息" // 信息窗口标题
        });
        marker.addEventListener("click", function () {
            map.openInfoWindow(infoWindow, mapCenter); // 点击标记时打开信息窗口
        });
        
        // 开启鼠标滚轮缩放功能
        map.enableScrollWheelZoom(true);

        // 添加关闭按钮事件
        const closeBtn = detailsOverlay.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(detailsOverlay);
            document.body.style.overflow = '';
        });

        // 点击遮罩层关闭
        detailsOverlay.addEventListener('click', (e) => {
            if (e.target === detailsOverlay) {
                document.body.removeChild(detailsOverlay);
                document.body.style.overflow = '';
            }
        });

        // 添加预定按钮事件
        const reserveBtn = detailsOverlay.querySelector('.reserve-btn');
        reserveBtn.addEventListener('click', () => {
            showReservationForm(restaurant);
        });
    } catch (error) {
        console.error('Error showing restaurant details:', error);
    }
}

// 显示预定表单
function showReservationForm(restaurant) {
    const reservationOverlay = document.createElement('div');
    reservationOverlay.className = 'reservation-overlay';
    reservationOverlay.innerHTML = `
        <div class="reservation-container">
            <div class="reservation-header">
                <h2>Reserve ${restaurant.name}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form class="reservation-form" id="reservationForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date" required>
                </div>
                <div class="form-group">
                    <label for="time">Time</label>
                    <input type="time" id="time" name="time" required>
                </div>
                <div class="form-group">
                    <label for="guests">Number of Guests</label>
                    <input type="number" id="guests" name="guests" min="1" max="10" required>
                </div>
                <div class="form-group">
                    <label for="notes">Special Requests</label>
                    <textarea id="notes" name="notes" rows="3"></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Reservation</button>
            </form>
        </div>
    `;

    document.body.appendChild(reservationOverlay);

    // 添加关闭按钮事件
    const closeBtn = reservationOverlay.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(reservationOverlay);
    });

    // 点击遮罩层关闭
    reservationOverlay.addEventListener('click', (e) => {
        if (e.target === reservationOverlay) {
            document.body.removeChild(reservationOverlay);
        }
    });

    // 处理表单提交
    const form = reservationOverlay.querySelector('#reservationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(form);
        const reservation = {
            id: Date.now(),
            restaurantName: restaurant.name,
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            date: formData.get('date'),
            time: formData.get('time'),
            guests: formData.get('guests'),
            requests: formData.get('notes')
        };

        // 保存预定数据
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        
        // 检查是否存在相同的预订
        const isDuplicate = reservations.some(r => 
            r.restaurantName === reservation.restaurantName &&
            r.date === reservation.date &&
            r.time === reservation.time &&
            r.name === reservation.name &&
            r.phone === reservation.phone
        );

        if (!isDuplicate) {
            reservations.push(reservation);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            // 显示成功消息
            showSuccessMessage(restaurant);
        } else {
            // 显示重复预订提示
            alert('You have reserved the restaurant at the same time. Please choose another time or restaurant.');
        }
        document.body.removeChild(reservationOverlay);
    });
}

// 显示预定成功消息
function showSuccessMessage(restaurant) {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
        <div class="success-container">
            <div class="success-icon">✅</div>
            <h2>Reserving Successful!</h2>
            <p>Thank you for reserveng ${restaurant.name}!</p>
            <p>We have received your reservation and will contact you via phone or email to confirm.</p>
            <button class="success-close">OK</button>
        </div>
    `;

    document.body.appendChild(successOverlay);

    // 添加关闭按钮事件
    const closeBtn = successOverlay.querySelector('.success-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(successOverlay);
    });
}

// 初始化预定功能
function initReservations() {
    const reservationsBtn = document.querySelector('.my-reservations-btn');
    const reservationsOverlay = document.getElementById('reservationsOverlay');
    const closeReservationsBtn = document.getElementById('closeReservations');
    const reservationDetails = document.getElementById('reservationDetails');

    if (!reservationsBtn || !reservationsOverlay || !closeReservationsBtn || !reservationDetails) {
        console.error('Reservation elements not found');
        return;
    }

    // 移除现有的事件监听器
    reservationsBtn.replaceWith(reservationsBtn.cloneNode(true));
    const newReservationsBtn = document.querySelector('.my-reservations-btn');

    // 显示预定列表
    newReservationsBtn.addEventListener('click', () => {
        reservationsOverlay.style.display = 'flex';
        // 确保在显示之前清空列表
        const reservationsList = document.getElementById('reservationsList');
        if (reservationsList) {
            reservationsList.innerHTML = '';
        }
        loadReservations();
    });

    // 关闭预定列表
    closeReservationsBtn.addEventListener('click', () => {
        reservationsOverlay.style.display = 'none';
        // 清空列表
        const reservationsList = document.getElementById('reservationsList');
        if (reservationsList) {
            reservationsList.innerHTML = '';
        }
    });

    // 点击遮罩层关闭
    reservationsOverlay.addEventListener('click', (e) => {
        if (e.target === reservationsOverlay) {
            reservationsOverlay.style.display = 'none';
            // 清空列表
            const reservationsList = document.getElementById('reservationsList');
            if (reservationsList) {
                reservationsList.innerHTML = '';
            }
        }
    });

    // 初始化时清空列表
    const reservationsList = document.getElementById('reservationsList');
    if (reservationsList) {
        reservationsList.innerHTML = '';
    }
}

// 加载预定列表
function loadReservations() {
    const reservationsList = document.getElementById('reservationsList');
    // 确保列表被清空
    if (reservationsList) {
        reservationsList.innerHTML = '';
    }

    // 从本地存储获取预定数据
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p>No reservations found.</p>';
        return;
    }

    // 清除可能存在的旧事件监听器
    const oldCards = document.querySelectorAll('.reservation-card');
    oldCards.forEach(card => {
        const oldBtn = card.querySelector('.view-details-btn');
        if (oldBtn) {
            oldBtn.replaceWith(oldBtn.cloneNode(true));
        }
    });

    // 获取餐厅数据以获取图片
    fetch('restaurants.json')
        .then(response => response.json())
        .then(data => {
            // 清空现有内容
            reservationsList.innerHTML = '';
            
            reservations.forEach(reservation => {
                const restaurant = data.restaurants.find(r => r.name === reservation.restaurantName);
                const card = document.createElement('div');
                card.className = 'reservation-card';
                card.innerHTML = `
                    <div class="reservation-image">
                        <img src="${restaurant ? restaurant.image : 'default-image.jpg'}" alt="${reservation.restaurantName}">
                    </div>
                    <div class="reservation-content">
                        <div class="reservation-info">
                            <h3>${reservation.restaurantName}</h3>
                            <p><strong>Date:</strong> ${reservation.date}</p>
                            <p><strong>Time:</strong> ${reservation.time}</p>
                            <p><strong>Guests:</strong> ${reservation.guests}</p>
                        </div>
                        <button class="view-details-btn" data-id="${reservation.id}">View Details</button>
                    </div>
                `;
                reservationsList.appendChild(card);

                // 添加查看详情按钮事件
                const viewDetailsBtn = card.querySelector('.view-details-btn');
                viewDetailsBtn.addEventListener('click', () => {
                    showReservationDetails(reservation);
                });
            });
        })
        .catch(error => {
            console.error('Error loading restaurant data:', error);
            reservationsList.innerHTML = '<p>Error loading reservations. Please try again.</p>';
        });
}

// 显示预定详情
function showReservationDetails(reservation) {
    const detailsContainer = document.getElementById('reservationDetails');
    const reservationInfo = document.getElementById('reservationInfo');
    
    // 获取餐厅数据以显示图片和详细信息
    fetch('restaurants.json')
        .then(response => response.json())
        .then(data => {
            const restaurant = data.restaurants.find(r => r.name === reservation.restaurantName);
            
            reservationInfo.innerHTML = `
                <div class="details-header">
                    <h2>${reservation.restaurantName}</h2>
                    <button class="close-btn" id="closeDetails">&times;</button>
                </div>
                <div class="details-content reservation-details-grid">
                    <div class="restaurant-preview">
                        <div class="restaurant-image">
                            <img src="${restaurant ? restaurant.image : 'default-image.jpg'}" alt="${reservation.restaurantName}">
                        </div>
                        <div class="restaurant-quick-info">
                            <p><strong>Location:</strong> ${restaurant ? restaurant.location : 'N/A'}</p>
                            <p><strong>Specialty:</strong> ${restaurant ? restaurant.specialty : 'N/A'}</p>
                            <p><strong>Features:</strong> ${restaurant ? restaurant.features : 'N/A'}</p>
                        </div>
                    </div>
                    <div class="details-info">
                        <div class="info-section">
                            <h3>Reservation Information</h3>
                            <p><strong>Date:</strong> ${reservation.date}</p>
                            <p><strong>Time:</strong> ${reservation.time}</p>
                            <p><strong>Number of Guests:</strong> ${reservation.guests}</p>
                            <p><strong>Booking ID:</strong> ${reservation.id}</p>
                            <p><strong>Status:</strong> <span class="status-confirmed">Confirmed</span></p>
                        </div>
                        <div class="info-section">
                            <h3>Contact Information</h3>
                            <p><strong>Name:</strong> ${reservation.name}</p>
                            <p><strong>Phone:</strong> ${reservation.phone}</p>
                            <p><strong>Email:</strong> ${reservation.email}</p>
                        </div>
                        <div class="info-section">
                            <h3>Special Requests</h3>
                            <p>${reservation.requests || 'None'}</p>
                        </div>
                    </div>
                </div>
                <div class="reservation-actions">
                    <button class="modify-reservation-btn">Modify Reservation</button>
                    <button class="delete-reservation-btn" id="deleteReservation">Cancel Reservation</button>
                </div>
            `;
            
            // 添加删除按钮事件监听
            const deleteBtn = document.getElementById('deleteReservation');
            deleteBtn.onclick = () => {
                // 创建确认对话框
                const confirmOverlay = document.createElement('div');
                confirmOverlay.className = 'confirm-dialog-overlay';
                confirmOverlay.innerHTML = `
                    <div class="confirm-dialog">
                        <h2>Are you sure to cancel the reservation?</h2>
                        <p>  Are you sure you want to cancel the order at ${reservation.restaurantName}?</p>
                        <div class="confirm-dialog-buttons">
                            <button class="confirm-dialog-btn cancel">Return</button>
                            <button class="confirm-dialog-btn confirm">Confirm cancellation</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(confirmOverlay);

                // 添加按钮事件
                const cancelBtn = confirmOverlay.querySelector('.confirm-dialog-btn.cancel');
                const confirmBtn = confirmOverlay.querySelector('.confirm-dialog-btn.confirm');

                // 取消按钮事件
                cancelBtn.addEventListener('click', () => {
                    document.body.removeChild(confirmOverlay);
                });

                // 确认按钮事件
                confirmBtn.addEventListener('click', () => {
                    // 移除确认对话框
                    document.body.removeChild(confirmOverlay);

                    // 获取现有预订
                    let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
                    // 删除预订
                    reservations = reservations.filter(r => r.id !== reservation.id);
                    // 更新本地存储
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    
                    // 关闭详情弹窗
                    detailsContainer.style.display = 'none';
                    
                    // 创建遮罩层
                    const overlay = document.createElement('div');
                    overlay.className = 'inline-success-overlay';
                    
                    // 创建页面内成功消息
                    const successMessage = document.createElement('div');
                    successMessage.className = 'inline-success-message';
                    successMessage.innerHTML = `
                        <div class="success-icon">✅</div>
                        <h2>Reservation cancelled</h2>
                        <p>Your reservation at ${reservation.restaurantName} has been successfully cancelled!</p>
                        <button class="success-close">Confirm</button>
                    `;
                    
                    // 移除可能存在的其他成功消息
                    const existingMessage = document.querySelector('.inline-success-overlay');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    // 将成功消息添加到遮罩层中
                    overlay.appendChild(successMessage);
                    document.body.appendChild(overlay);
                    
                    // 添加关闭按钮事件
                    const closeBtn = successMessage.querySelector('.success-close');
                    closeBtn.addEventListener('click', () => {
                        if (overlay.parentNode) {
                            overlay.remove();
                        }
                        // 重新加载预订列表
                        loadReservations();
                    });
                });

                // 点击遮罩层关闭
                confirmOverlay.addEventListener('click', (e) => {
                    if (e.target === confirmOverlay) {
                        document.body.removeChild(confirmOverlay);
                    }
                });
            };
            
            // 添加修改按钮事件监听
            const modifyBtn = document.querySelector('.modify-reservation-btn');
            modifyBtn.addEventListener('click', () => {
                // 关闭详情弹窗
                detailsContainer.style.display = 'none';
                
                // 显示预定表单并填充现有数据
                const reservationOverlay = document.createElement('div');
                reservationOverlay.className = 'reservation-overlay';
                reservationOverlay.innerHTML = `
                    <div class="reservation-container">
                        <div class="reservation-header">
                            <h2>Modify The Reservation - ${reservation.restaurantName}</h2>
                            <button class="close-btn">&times;</button>
                        </div>
                        <form class="reservation-form" id="modifyReservationForm">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" value="${reservation.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" value="${reservation.phone}" required>
                            </div>
                            <div class="form-group">
                                <label for="email">E-mial</label>
                                <input type="email" id="email" name="email" value="${reservation.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="date">Date</label>
                                <input type="date" id="date" name="date" value="${reservation.date}" required>
                            </div>
                            <div class="form-group">
                                <label for="time">Time</label>
                                <input type="time" id="time" name="time" value="${reservation.time}" required>
                            </div>
                            <div class="form-group">
                                <label for="guests">Number of Guests</label>
                                <input type="number" id="guests" name="guests" min="1" max="10" value="${reservation.guests}" required>
                            </div>
                            <div class="form-group">
                                <label for="notes">Special Requirements</label>
                                <textarea id="notes" name="notes" rows="3">${reservation.requests || ''}</textarea>
                            </div>
                            <button type="submit" class="submit-btn">Update the Reservation</button>
                        </form>
                    </div>
                `;

                document.body.appendChild(reservationOverlay);

                // 添加关闭按钮事件
                const closeBtn = reservationOverlay.querySelector('.close-btn');
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(reservationOverlay);
                });

                // 点击遮罩层关闭
                reservationOverlay.addEventListener('click', (e) => {
                    if (e.target === reservationOverlay) {
                        document.body.removeChild(reservationOverlay);
                    }
                });

                // 处理表单提交
                const form = reservationOverlay.querySelector('#modifyReservationForm');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // 获取表单数据
                    const formData = new FormData(form);
                    const updatedReservation = {
                        ...reservation,
                        name: formData.get('name'),
                        phone: formData.get('phone'),
                        email: formData.get('email'),
                        date: formData.get('date'),
                        time: formData.get('time'),
                        guests: formData.get('guests'),
                        requests: formData.get('notes')
                    };

                    // 更新预订数据
                    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                    const index = reservations.findIndex(r => r.id === reservation.id);
                    if (index !== -1) {
                        reservations[index] = updatedReservation;
                        localStorage.setItem('reservations', JSON.stringify(reservations));
                    }

                    // 移除修改表单
                    document.body.removeChild(reservationOverlay);

                    // 显示成功消息
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-overlay';
                    successMessage.innerHTML = `
                        <div class="success-container">
                            <div class="success-icon">✅</div>
                            <h2>Reservation has been updated!</h2>
                            <p>Your reservation information has been successfully updated!</p>
                            <button class="success-close">Confirm</button>
                        </div>
                    `;

                    document.body.appendChild(successMessage);

                    // 添加关闭按钮事件
                    const closeSuccessBtn = successMessage.querySelector('.success-close');
                    closeSuccessBtn.addEventListener('click', () => {
                        document.body.removeChild(successMessage);
                        // 重新加载预订列表
                        loadReservations();
                    });
                });
            });
            
            // 添加关闭按钮事件监听
            const closeBtn = document.getElementById('closeDetails');
            closeBtn.onclick = () => {
                detailsContainer.style.display = 'none';
            };
            
            detailsContainer.style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading restaurant data:', error);
        });
}

// 初始化帮助功能
function initHelp() {
    const helpBtn = document.querySelector('.help-btn');
    const helpOverlay = document.getElementById('helpOverlay');
    const closeHelpBtn = document.getElementById('closeHelp');

    if (!helpBtn || !helpOverlay || !closeHelpBtn) {
        console.error('Help elements not found');
        return;
    }

    // 显示帮助窗口
    helpBtn.addEventListener('click', () => {
        console.log('Help button clicked');
        helpOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // 关闭帮助窗口
    closeHelpBtn.addEventListener('click', () => {
        helpOverlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    // 点击遮罩层关闭
    helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
            helpOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('hero');          
    const slider = document.getElementById('heroSlider');
    const slides = slider.querySelectorAll('.slide');
    const total = slides.length;
    let index = 0;
    let timer;
    const carousel = document.getElementById("myCarousel");  

    function goToSlide(i) {
      const offset = (i * 100) / total;
      slider.style.transform = `translateX(-${offset}%)`;
      updateDots(i);
    }
  
    function startAutoPlay() {
      timer = setInterval(() => {
        index = (index + 1) % total;
        goToSlide(index);
      }, 5000);
    }
    hero.addEventListener('mouseleave', startAutoPlay);

    // 悬停时暂停自动播放
    carousel.addEventListener("mouseenter", function () {
      this.carousel("pause");
    });

    // 初始化
    goToSlide(0);
    startAutoPlay();
  });


// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants();
    setupSearch();
    setupScrollToTop();
    showLoadingAnimation();
    initReservations(); // 初始化预定功能
});   