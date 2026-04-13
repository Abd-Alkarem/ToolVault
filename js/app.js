/* ============================================
   TOOLVAULT – MAIN APP (Router + Handlers)
   ============================================ */
const App = {
    _currentFilter: 'All',
    _selectedPayment: 'card',

    // ==================== ROUTER ====================
    init() {
        this._loadTheme();
        initThreeBackground();
        window.addEventListener('hashchange', () => this.route());
        this.route();
        this._setupNav();
        this._animateCounters();

        document.getElementById('hamburger').addEventListener('click', () => {
            document.getElementById('hamburger').classList.toggle('open');
            document.getElementById('mobile-menu').classList.toggle('open');
        });
        window.addEventListener('scroll', () => {
            document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
        });

        // Request geolocation
        this._requestGeolocation();
    },

    _loadTheme() {
        var saved = localStorage.getItem('tv_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
    },

    toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('tv_theme', next);
        this._setupNav();
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 80);
    },

    _getThemeIcon() {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        return theme === 'dark' ? Components.icon('sun', 18) : Components.icon('moon', 18);
    },

    _requestGeolocation() {
        if (navigator.geolocation && !Store.getGeo()) {
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    Store.setGeo(pos.coords.latitude, pos.coords.longitude);
                },
                function () { /* Permission denied – OK */ },
                { enableHighAccuracy: false, timeout: 10000 }
            );
        }
    },

    navigate(path) { window.location.hash = '/' + path; },

    route() {
        var hash = window.location.hash.slice(2) || '';
        var parts = hash.split('/');
        var page = parts[0];
        var param = parts[1];
        var app = document.getElementById('app');

        document.getElementById('hamburger').classList.remove('open');
        document.getElementById('mobile-menu').classList.remove('open');
        window.scrollTo(0, 0);

        switch (page) {
            case '': case 'home': app.innerHTML = Pages.landing(); break;
            case 'login': app.innerHTML = Pages.login(); break;
            case 'register': app.innerHTML = Pages.register(); break;
            case 'about': app.innerHTML = Pages.about(); break;
            case 'dashboard': app.innerHTML = Pages.dashboard(); break;
            case 'browse': app.innerHTML = Pages.browseTools(); break;
            case 'tool': app.innerHTML = Pages.toolDetail(param); break;
            case 'add-tool': app.innerHTML = Pages.addTool(); break;
            case 'my-tools': app.innerHTML = Pages.myTools(); break;
            case 'bookings': app.innerHTML = Pages.bookings(); break;
            case 'profile': app.innerHTML = Pages.profile(param); break;
            case 'admin': app.innerHTML = Pages.admin(); break;
            case 'forum': app.innerHTML = Pages.forum(); break;
            case 'notifications': app.innerHTML = Pages.notifications(); break;
            default: app.innerHTML = Pages.landing();
        }
        this._setupNav();
        this._animateCounters();
        // Render Lucide icons after DOM update
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
    },

    _setupNav() {
        var nav = document.getElementById('nav-links');
        var actions = document.getElementById('nav-actions');
        var mobile = document.getElementById('mobile-menu-content');
        var user = Store.currentUser();
        var unread = user ? Store.getUnreadCount(user.id) : 0;

        if (user) {
            nav.innerHTML = '<a href="#/dashboard" class="nav-link">Dashboard</a>' +
                '<a href="#/browse" class="nav-link">Browse</a>' +
                (Store.isHost() ? '<a href="#/my-tools" class="nav-link">My Tools</a>' : '') +
                '<a href="#/bookings" class="nav-link">Bookings</a>' +
                '<a href="#/forum" class="nav-link">Forum</a>' +
                (Store.isAdmin() ? '<a href="#/admin" class="nav-link">Admin</a>' : '');
            actions.innerHTML = '<button class="theme-toggle" onclick="App.toggleTheme()" title="Toggle theme">' + this._getThemeIcon() + '</button>' +
                '<a href="#/notifications" class="btn btn-ghost" style="position:relative">' + Components.icon('bell', 18) + (unread > 0 ? '<span class="notification-dot"></span>' : '') + '</a>' +
                '<a href="#/profile" class="btn btn-ghost">' + Components.avatar(user) + ' <span style="margin-left:4px">' + user.name.split(' ')[0] + '</span></a>' +
                '<button class="btn btn-secondary btn-sm" onclick="App.handleLogout()">Logout</button>';
            mobile.innerHTML = '<a href="#/dashboard" class="nav-link">' + Components.icon('layout-dashboard', 16) + ' Dashboard</a>' +
                '<a href="#/browse" class="nav-link">' + Components.icon('search', 16) + ' Browse Tools</a>' +
                (Store.isHost() ? '<a href="#/my-tools" class="nav-link">' + Components.icon('wrench', 16) + ' My Tools</a><a href="#/add-tool" class="nav-link">' + Components.icon('plus-circle', 16) + ' Add Tool</a>' : '') +
                '<a href="#/bookings" class="nav-link">' + Components.icon('calendar', 16) + ' Bookings</a>' +
                '<a href="#/notifications" class="nav-link">' + Components.icon('bell', 16) + ' Notifications' + (unread > 0 ? ' (' + unread + ')' : '') + '</a>' +
                '<a href="#/profile" class="nav-link">' + Components.icon('user', 16) + ' Profile</a>' +
                '<a href="#/forum" class="nav-link">' + Components.icon('message-circle', 16) + ' Forum</a>' +
                (Store.isAdmin() ? '<a href="#/admin" class="nav-link">' + Components.icon('shield', 16) + ' Admin</a>' : '') +
                '<hr style="border-color:var(--border-color);margin:var(--space-md) 0">' +
                '<button class="btn btn-ghost" style="width:100%;margin-bottom:8px" onclick="App.toggleTheme()">' + this._getThemeIcon() + ' Toggle Theme</button>' +
                '<button class="btn btn-secondary" style="width:100%" onclick="App.handleLogout()">Logout</button>';
        } else {
            nav.innerHTML = '<a href="#/" class="nav-link">Home</a><a href="#/browse" class="nav-link">Browse</a><a href="#/about" class="nav-link">About</a><a href="#/forum" class="nav-link">Forum</a>';
            actions.innerHTML = '<button class="theme-toggle" onclick="App.toggleTheme()" title="Toggle theme">' + this._getThemeIcon() + '</button>' +
                '<a href="#/login" class="btn btn-ghost">Sign In</a><a href="#/register" class="btn btn-primary btn-sm">Get Started</a>';
            mobile.innerHTML = '<a href="#/" class="nav-link">' + Components.icon('home', 16) + ' Home</a><a href="#/browse" class="nav-link">' + Components.icon('search', 16) + ' Browse Tools</a><a href="#/about" class="nav-link">' + Components.icon('info', 16) + ' About</a><a href="#/forum" class="nav-link">' + Components.icon('message-circle', 16) + ' Forum</a><hr style="border-color:var(--border-color);margin:var(--space-md) 0"><button class="btn btn-ghost" style="width:100%;margin-bottom:8px" onclick="App.toggleTheme()">' + this._getThemeIcon() + ' Toggle Theme</button><a href="#/login" class="btn btn-secondary" style="width:100%;margin-bottom:8px">Sign In</a><a href="#/register" class="btn btn-primary" style="width:100%">Get Started</a>';
        }
        // Render Lucide icons in nav
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 80);
    },

    _animateCounters() {
        document.querySelectorAll('[data-count]').forEach(function (el) {
            var target = el.dataset.count;
            if (target.includes('K') || target.includes('$')) { el.textContent = target; return; }
            var num = parseInt(target.replace(/,/g, ''));
            var current = 0;
            var step = Math.ceil(num / 60);
            var interval = setInterval(function () {
                current += step;
                if (current >= num) { current = num; clearInterval(interval); }
                el.textContent = current.toLocaleString();
            }, 20);
        });
    },

    // ==================== AUTH ====================
    selectAccountType(type, btn) {
        document.getElementById('reg-account-type').value = type;
        document.querySelectorAll('.account-type-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
    },

    handleLogin(e) {
        e.preventDefault();
        var result = Store.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
        if (result && result.error) {
            // Banned or deactivated
            Components.toast(result.message, 'error');
        } else if (result) {
            Components.toast('Welcome back, ' + result.name + '!', 'success');
            this.navigate('dashboard');
        } else {
            Components.toast('Invalid email or password.', 'error');
        }
    },

    handleRegister(e) {
        e.preventDefault();
        var email = document.getElementById('reg-email').value;
        if (Store.getUsers().find(function (u) { return u.email === email; })) { Components.toast('An account with this email already exists.', 'error'); return; }
        var geo = Store.getGeo();
        var user = Store.addUser({
            name: document.getElementById('reg-name').value, email: email,
            location: document.getElementById('reg-location').value,
            password: document.getElementById('reg-password').value,
            phone: document.getElementById('reg-phone').value,
            accountType: document.getElementById('reg-account-type').value,
            lat: geo ? geo.lat : null,
            lng: geo ? geo.lng : null
        });
        Store.login(email, document.getElementById('reg-password').value);
        Components.toast('Welcome to ToolVault, ' + user.name + '!', 'success');
        this.navigate('dashboard');
    },

    handleLogout() { Store.logout(); Components.toast('Signed out.', 'info'); this.navigate(''); },

    upgradeToHost() {
        var user = Store.currentUser();
        if (user) { Store.updateUser(user.id, { accountType: 'both' }); Components.toast("You're now a Host! Start listing tools.", 'success'); this.route(); }
    },

    // ==================== TOOLS ====================
    handleAddTool(e) {
        e.preventDefault();
        var user = Store.currentUser();
        var imageData = Components.getUploadedImage('tool-image-preview');
        var defaultImages = ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1530124566582-a45a7c3fd4ba?w=400&h=300&fit=crop'];
        var delivery = document.getElementById('tool-delivery').checked;
        var geo = Store.getGeo();
        Store.addTool({
            ownerId: user.id,
            name: document.getElementById('tool-name').value,
            description: document.getElementById('tool-desc').value,
            category: document.getElementById('tool-category').value,
            condition: document.getElementById('tool-condition').value,
            pricePerDay: parseInt(document.getElementById('tool-price').value),
            depositAmount: parseInt(document.getElementById('tool-deposit').value) || 0,
            image: imageData || defaultImages[Math.floor(Math.random() * defaultImages.length)],
            deliveryAvailable: delivery,
            deliveryFee: delivery ? parseInt(document.getElementById('tool-delivery-fee').value) || 0 : 0,
            guidelines: document.getElementById('tool-guidelines').value,
            discount5: parseInt(document.getElementById('tool-discount5').value) || 0,
            discount20: parseInt(document.getElementById('tool-discount20').value) || 0,
            lat: geo ? geo.lat + (Math.random() - 0.5) * 0.01 : (user.lat || null),
            lng: geo ? geo.lng + (Math.random() - 0.5) * 0.01 : (user.lng || null),
            status: 'available'
        });
        Components.toast('Tool listed successfully!', 'success');
        this.navigate('my-tools');
    },

    showEditToolModal(toolId) {
        var tool = Store.getTool(toolId);
        if (!tool) return;
        Components.showModal('Edit Tool',
            '<div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="edit-tool-name" value="' + tool.name + '"></div>' +
            '<div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="edit-tool-desc">' + tool.description + '</textarea></div>' +
            '<div class="grid-2"><div class="form-group"><label class="form-label">Price/Day ($)</label><input type="number" class="form-input" id="edit-tool-price" value="' + tool.pricePerDay + '" min="1"></div>' +
            '<div class="form-group"><label class="form-label">Deposit ($)</label><input type="number" class="form-input" id="edit-tool-deposit" value="' + (tool.depositAmount || 0) + '" min="0"></div></div>' +
            '<div class="grid-2"><div class="form-group"><label class="form-label">5+ Day Discount (%)</label><input type="number" class="form-input" id="edit-tool-d5" value="' + (tool.discount5 || 0) + '" min="0" max="50"></div>' +
            '<div class="form-group"><label class="form-label">20+ Day Discount (%)</label><input type="number" class="form-input" id="edit-tool-d20" value="' + (tool.discount20 || 0) + '" min="0" max="70"></div></div>' +
            '<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="edit-tool-status"><option ' + (tool.status === 'available' ? 'selected' : '') + '>available</option><option ' + (tool.status === 'rented' ? 'selected' : '') + '>rented</option></select></div>' +
            '<div class="form-group"><label class="form-label">Guidelines</label><textarea class="form-textarea" id="edit-tool-guidelines" style="min-height:60px">' + (tool.guidelines || '') + '</textarea></div>',
            '<button class="btn btn-primary" onclick="App.saveToolEdit(\'' + toolId + '\')">Save Changes</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    saveToolEdit(toolId) {
        Store.updateTool(toolId, {
            name: document.getElementById('edit-tool-name').value,
            description: document.getElementById('edit-tool-desc').value,
            pricePerDay: parseInt(document.getElementById('edit-tool-price').value),
            depositAmount: parseInt(document.getElementById('edit-tool-deposit').value) || 0,
            discount5: parseInt(document.getElementById('edit-tool-d5').value) || 0,
            discount20: parseInt(document.getElementById('edit-tool-d20').value) || 0,
            status: document.getElementById('edit-tool-status').value,
            guidelines: document.getElementById('edit-tool-guidelines').value
        });
        Components.closeModal();
        Components.toast('Tool updated!', 'success');
        this.route();
    },

    confirmDeleteTool(toolId) {
        Components.showModal('Delete Tool', '<p style="color:var(--text-secondary)">Are you sure you want to remove this tool? This action cannot be undone.</p>',
            '<button class="btn btn-danger" onclick="App.deleteTool(\'' + toolId + '\')">' + Components.icon('trash-2', 14) + ' Delete</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    deleteTool(toolId) {
        Store.deleteTool(toolId);
        Components.closeModal();
        Components.toast('Tool removed.', 'info');
        this.navigate('my-tools');
    },

    filterTools() {
        var searchEl = document.getElementById('tool-search');
        var deliveryEl = document.getElementById('filter-delivery');
        var sortEl = document.getElementById('filter-sort');
        var q = (searchEl ? searchEl.value : '').toLowerCase();
        var deliveryOnly = deliveryEl ? deliveryEl.checked : false;
        var sort = sortEl ? sortEl.value : 'newest';
        var tools = Store.getTools();
        if (this._currentFilter !== 'All') tools = tools.filter(function (t) { return t.category === App._currentFilter; });
        if (q) tools = tools.filter(function (t) { return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q); });
        if (deliveryOnly) tools = tools.filter(function (t) { return t.deliveryAvailable; });
        if (sort === 'price-low') tools.sort(function (a, b) { return a.pricePerDay - b.pricePerDay; });
        else if (sort === 'price-high') tools.sort(function (a, b) { return b.pricePerDay - a.pricePerDay; });
        else if (sort === 'rating') tools.sort(function (a, b) { return b.rating - a.rating; });
        else if (sort === 'popular') tools.sort(function (a, b) { return (b.tripCount || 0) - (a.tripCount || 0); });
        else tools.sort(function (a, b) { return b.createdAt - a.createdAt; });

        var grid = document.getElementById('tools-grid');
        var count = document.getElementById('tool-count');
        if (grid) {
            grid.innerHTML = tools.length > 0 ? tools.map(function (t) { return Components.toolCard(t); }).join('') : Components.emptyState('search', 'No tools found', 'Try a different search or category.');
            if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
        }
        if (count) count.textContent = tools.length + ' tool' + (tools.length !== 1 ? 's' : '');
    },

    filterByCategory(cat) {
        this._currentFilter = cat;
        document.querySelectorAll('#category-filters .filter-chip').forEach(function (c) { c.classList.toggle('active', c.dataset.cat === cat); });
        this.filterTools();
    },

    // ==================== BOOKING ====================
    selectPayment(method, btn) {
        this._selectedPayment = method;
        btn.closest('.form-group').querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
    },

    showBookingModal(toolId) {
        var tool = Store.getTool(toolId);
        var today = new Date().toISOString().split('T')[0];
        Components.showModal(Components.icon('calendar', 18) + ' Book ' + tool.name,
            '<p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">Choose dates, protection, and payment.</p>' +
            '<div class="grid-2"><div class="form-group"><label class="form-label">Start Date</label><input type="date" class="form-input" id="booking-start" min="' + today + '" onchange="App._calcPrice(\'' + toolId + '\')"></div><div class="form-group"><label class="form-label">End Date</label><input type="date" class="form-input" id="booking-end" min="' + today + '" onchange="App._calcPrice(\'' + toolId + '\')"></div></div>' +
            (tool.deliveryAvailable ? '<div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="booking-delivery" style="accent-color:var(--accent-cyan)" onchange="App._calcPrice(\'' + toolId + '\')"> ' + Components.icon('truck', 14) + ' Request delivery (+$' + tool.deliveryFee + ')</label></div>' : '') +
            (tool.discount5 || tool.discount20 ? Components.discountInfo(tool) : '') +
            Components.protectionPlanSelector() +
            Components.paymentMethodUI() +
            '<div id="booking-summary" class="glass-card" style="text-align:center;color:var(--text-muted)">Select dates to see total</div>',
            '<button class="btn btn-primary" onclick="App.submitBooking(\'' + toolId + '\')">' + Components.icon('check', 14) + ' Confirm & Pay</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 100);
    },

    _calcPrice(toolId) {
        var tool = Store.getTool(toolId);
        if (!tool) return;
        var s = document.getElementById('booking-start');
        var e = document.getElementById('booking-end');
        var summary = document.getElementById('booking-summary');
        if (s && s.value && e && e.value && summary) {
            var days = Math.ceil((new Date(e.value) - new Date(s.value)) / 86400000) + 1;
            if (days > 0) {
                var delivery = document.getElementById('booking-delivery');
                var deliveryCost = (delivery && delivery.checked) ? (tool.deliveryFee || 0) : 0;
                var protEl = document.querySelector('input[name="protection"]:checked');
                var protection = protEl ? protEl.value : 'standard';
                var protCost = protection === 'premium' ? 5 * days : protection === 'standard' ? 3 * days : 0;
                var priceCalc = Store.calculatePrice(tool, days);
                var total = priceCalc.total + deliveryCost + protCost;
                var discountLine = priceCalc.discount > 0 ? '<div style="font-size:0.8rem;color:var(--accent-green)">' + Components.icon('tag', 12) + ' ' + priceCalc.discount + '% volume discount applied!</div>' : '';
                summary.innerHTML = '<div style="font-family:var(--font-display);font-size:1.8rem;background:var(--gradient-main);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">$' + total.toFixed(2) + '</div>' +
                    '<div style="font-size:0.85rem;color:var(--text-secondary)">' + days + ' day' + (days > 1 ? 's' : '') + ' × $' + tool.pricePerDay + ' = $' + priceCalc.base + (protCost ? ' + $' + protCost + ' protection' : '') + (deliveryCost ? ' + $' + deliveryCost + ' delivery' : '') + '</div>' + discountLine;
                if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
            } else { summary.innerHTML = '<span style="color:var(--accent-red)">End date must be after start</span>'; }
        }
    },

    submitBooking(toolId) {
        var start = document.getElementById('booking-start');
        var end = document.getElementById('booking-end');
        if (!start || !start.value || !end || !end.value) { Components.toast('Please select both dates.', 'error'); return; }
        var days = Math.ceil((new Date(end.value) - new Date(start.value)) / 86400000) + 1;
        if (days <= 0) { Components.toast('Invalid date range.', 'error'); return; }
        var tool = Store.getTool(toolId);
        var user = Store.currentUser();
        var protEl = document.querySelector('input[name="protection"]:checked');
        var protection = protEl ? protEl.value : 'standard';
        var deliveryEl = document.getElementById('booking-delivery');
        var delivery = deliveryEl ? deliveryEl.checked : false;
        var protCost = protection === 'premium' ? 5 * days : protection === 'standard' ? 3 * days : 0;
        var priceCalc = Store.calculatePrice(tool, days);
        var total = priceCalc.total + (delivery ? tool.deliveryFee || 0 : 0) + protCost;

        Store.addBooking({ toolId: toolId, renterId: user.id, ownerId: tool.ownerId, startDate: start.value, endDate: end.value, totalPrice: Math.round(total * 100) / 100, protectionPlan: protection, deliveryRequested: delivery, paymentMethod: this._selectedPayment });
        Components.closeModal();
        Components.toast('Booking request sent! The owner will review it.', 'success');
        this.navigate('bookings');
    },

    approveBooking(id) {
        Store.approveBooking(id);
        Components.toast('Booking approved!', 'success');
        this.route();
    },
    declineBooking(id) {
        Store.declineBooking(id);
        Components.toast('Booking declined.', 'info');
        this.route();
    },
    markReturned(id) {
        Store.returnBooking(id);
        Components.toast('Tool marked as returned. Leave a review!', 'success');
        this.route();
    },

    switchBookingTab(tab) {
        var user = Store.currentUser();
        var tabs = document.querySelectorAll('#booking-tabs .tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        var list = document.getElementById('booking-list');
        if (tab === 'renter') {
            tabs[0].classList.add('active');
            var bookings = Store.getBookingsByRenter(user.id);
            list.innerHTML = bookings.length === 0 ? Components.emptyState('calendar', 'No rentals yet', 'Browse tools and book!') : '<div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + bookings.map(function (b) { return Components.bookingItem(b, 'renter'); }).join('') + '</div>';
        } else {
            tabs[1].classList.add('active');
            var bookings2 = Store.getBookingsByOwner(user.id);
            list.innerHTML = bookings2.length === 0 ? Components.emptyState('inbox', 'No requests', 'Requests appear when someone books your tools.') : '<div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + bookings2.map(function (b) { return Components.bookingItem(b, 'owner'); }).join('') + '</div>';
        }
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
    },

    selectDate(dateStr) { },

    // ==================== REVIEWS ====================
    showReviewModal(bookingId) {
        var booking = Store.getBooking(bookingId);
        if (!booking) return;
        var tool = Store.getTool(booking.toolId);
        var user = Store.currentUser();
        var isOwner = user.id === booking.ownerId;
        var revieweeId = isOwner ? booking.renterId : booking.ownerId;
        var reviewee = Store.getUser(revieweeId);
        Components.showModal(Components.icon('star', 18) + ' Leave a Review',
            '<p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">Rate your experience with ' + (reviewee ? reviewee.name : 'this user') + ' for <strong>' + (tool ? tool.name : 'this tool') + '</strong></p>' +
            '<div class="form-group"><label class="form-label">Rating</label>' + Components.starInput('review-rating', 0) + '</div>' +
            '<div class="form-group"><label class="form-label">Review</label><textarea class="form-textarea" id="review-text" placeholder="Share your experience..."></textarea></div>',
            '<button class="btn btn-primary" onclick="App.submitReview(\'' + bookingId + '\',\'' + revieweeId + '\')">' + Components.icon('send', 14) + ' Submit Review</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 100);
    },

    submitReview(bookingId, revieweeId) {
        var booking = Store.getBooking(bookingId);
        var rating = Components.getStarValue('review-rating');
        var text = document.getElementById('review-text').value;
        if (!rating) { Components.toast('Please select a rating.', 'error'); return; }
        Store.addReview({ bookingId: bookingId, toolId: booking.toolId, reviewerId: Store.currentUser().id, revieweeId: revieweeId, rating: rating, text: text });
        // Mark as reviewed
        Store.updateBooking(bookingId, { reviewed: true });
        Components.closeModal(); Components.toast('Review submitted!', 'success'); this.route();
    },

    submitToolPageReview(bookingId, revieweeId) {
        var booking = Store.getBooking(bookingId);
        if (!booking) { Components.toast('Booking not found.', 'error'); return; }
        var rating = Components.getStarValue('tool-review-rating');
        var textEl = document.getElementById('tool-review-text');
        var text = textEl ? textEl.value : '';
        if (!rating) { Components.toast('Please select a rating.', 'error'); return; }
        if (!text.trim()) { Components.toast('Please write a short review.', 'error'); return; }
        Store.addReview({ bookingId: bookingId, toolId: booking.toolId, reviewerId: Store.currentUser().id, revieweeId: revieweeId, rating: rating, text: text });
        Store.updateBooking(bookingId, { reviewed: true });
        Components.toast('Review submitted! Thank you.', 'success');
        this.route();
    },

    // ==================== PROFILE ====================
    showEditProfile() {
        var user = Store.currentUser();
        Components.showModal(Components.icon('user', 18) + ' Edit Profile',
            '<div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="edit-name" value="' + user.name + '"></div>' +
            '<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="edit-email" value="' + user.email + '"></div>' +
            '<div class="grid-2"><div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="edit-location" value="' + user.location + '"></div><div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" id="edit-phone" value="' + (user.phone || '') + '"></div></div>' +
            '<div class="form-group"><label class="form-label">Bio</label><textarea class="form-textarea" id="edit-bio" style="min-height:60px">' + (user.bio || '') + '</textarea></div>',
            '<button class="btn btn-primary" onclick="App.saveProfile()">' + Components.icon('check', 14) + ' Save</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    saveProfile() {
        var user = Store.currentUser();
        Store.updateUser(user.id, { name: document.getElementById('edit-name').value, email: document.getElementById('edit-email').value, location: document.getElementById('edit-location').value, phone: document.getElementById('edit-phone').value, bio: document.getElementById('edit-bio').value });
        Components.closeModal(); Components.toast('Profile updated!', 'success'); this.route();
    },

    // ==================== VERIFICATION ====================
    submitVerification() {
        var user = Store.currentUser();
        var idImage = Components.getUploadedImage('verify-id-preview');
        if (!idImage) { Components.toast('Please upload a photo of your ID.', 'error'); return; }
        Store.submitVerification(user.id, idImage);
        Components.toast('Verification submitted! Admin will review your ID.', 'success');
        this.route();
    },

    approveVerification(userId) {
        Store.approveVerification(userId);
        Components.toast('User verified!', 'success');
        this.route();
    },

    rejectVerification(userId) {
        Store.rejectVerification(userId);
        Components.toast('Verification rejected.', 'info');
        this.route();
    },

    viewIdDocument(userId) {
        var user = Store.getUser(userId);
        if (!user || !user.idDocument) { Components.toast('No ID document found.', 'error'); return; }
        Components.showModal(Components.icon('id-card', 18) + ' ID Document – ' + user.name,
            '<img src="' + user.idDocument + '" style="width:100%;border-radius:var(--radius-md);max-height:400px;object-fit:contain" alt="ID Document">',
            '<button class="btn btn-success" onclick="App.approveVerification(\'' + userId + '\')">' + Components.icon('check', 14) + ' Approve</button><button class="btn btn-danger" onclick="App.rejectVerification(\'' + userId + '\')">' + Components.icon('x', 14) + ' Reject</button><button class="btn btn-secondary" onclick="Components.closeModal()">Close</button>');
    },

    // ==================== ADMIN ====================
    adminDeactivateUser(userId) {
        Store.deactivateUser(userId);
        Components.toast('User deactivated. Their content is now hidden.', 'info');
        this.route();
    },

    adminActivateUser(userId) {
        Store.activateUser(userId);
        Components.toast('User reactivated.', 'success');
        this.route();
    },

    switchAdminTab(tab) {
        var tabs = document.querySelectorAll('#admin-tabs .tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        var content = document.getElementById('admin-tab-content');
        var users = Store.getUsers().filter(function (u) { return u.role !== 'admin'; });
        var tools = Store.getAllTools();
        var bookings = Store.getBookings();
        var posts = Store.getAllForumPosts();

        if (tab === 'users') { tabs[0].classList.add('active'); content.innerHTML = Pages._adminUsersTab(users); }
        else if (tab === 'tools') { tabs[1].classList.add('active'); content.innerHTML = Pages._adminToolsTab(tools); }
        else if (tab === 'forum') { tabs[2].classList.add('active'); content.innerHTML = Pages._adminForumTab(posts); }
        else if (tab === 'bookings') { tabs[3].classList.add('active'); content.innerHTML = Pages._adminBookingsTab(bookings); }
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
    },

    showBanModal(userId) {
        var u = Store.getUser(userId);
        Components.showModal(Components.icon('ban', 18) + ' Ban User: ' + u.name,
            '<p style="color:var(--text-secondary);margin-bottom:var(--space-md)">This will suspend <strong>' + u.name + '</strong>\'s account. They will not be able to log in or access the platform.</p>' +
            '<div class="form-group"><label class="form-label">Reason for ban</label><select class="form-select" id="ban-reason-select" onchange="document.getElementById(\'ban-reason\').value=this.value"><option value="Violation of community guidelines">Violation of community guidelines</option><option value="Spam or fraudulent activity">Spam or fraudulent activity</option><option value="Harassment or abuse">Harassment or abuse</option><option value="Tool damage / non-return">Tool damage / non-return</option><option value="Fake listings">Fake listings</option><option value="Other">Other (specify below)</option></select></div>' +
            '<div class="form-group"><label class="form-label">Details (optional)</label><textarea class="form-textarea" id="ban-reason" style="min-height:60px">Violation of community guidelines</textarea></div>',
            '<button class="btn btn-danger" onclick="App.adminBan(\'' + userId + '\')">' + Components.icon('ban', 14) + ' Ban User</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    adminBan(userId) {
        var reason = document.getElementById('ban-reason').value;
        Store.banUser(userId, reason);
        Components.closeModal();
        Components.toast('User has been banned.', 'info');
        this.route();
    },

    adminUnban(userId) {
        Store.unbanUser(userId);
        Components.toast('User has been unbanned and reactivated.', 'success');
        this.route();
    },

    makeAdmin(userId) {
        var u = Store.getUser(userId);
        Components.showModal(Components.icon('shield', 18) + ' Make Admin',
            '<p style="color:var(--text-secondary)">Grant admin privileges to <strong>' + u.name + '</strong>? This gives full platform access.</p>',
            '<button class="btn btn-primary" onclick="Store.makeAdmin(\'' + userId + '\');Components.closeModal();Components.toast(\'Admin role granted.\',\'success\');App.route()">' + Components.icon('shield', 14) + ' Confirm</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    adminEditPost(postId) {
        var posts = Store.getAllForumPosts();
        var post = posts.find(function (p) { return p.id === postId; });
        if (!post) return;
        Components.showModal(Components.icon('edit', 18) + ' Edit Post',
            '<div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input" id="admin-edit-title" value="' + post.title + '"></div>' +
            '<div class="form-group"><label class="form-label">Body</label><textarea class="form-textarea" id="admin-edit-body">' + post.body + '</textarea></div>' +
            '<div class="form-group"><label class="form-label">Category</label><select class="form-select" id="admin-edit-cat"><option ' + (post.category === 'Tips & Tricks' ? 'selected' : '') + '>Tips & Tricks</option><option ' + (post.category === 'Tool Recommendations' ? 'selected' : '') + '>Tool Recommendations</option><option ' + (post.category === 'Project Ideas' ? 'selected' : '') + '>Project Ideas</option></select></div>',
            '<button class="btn btn-primary" onclick="App.saveAdminEditPost(\'' + postId + '\')">' + Components.icon('check', 14) + ' Save</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    saveAdminEditPost(postId) {
        Store.updateForumPost(postId, {
            title: document.getElementById('admin-edit-title').value,
            body: document.getElementById('admin-edit-body').value,
            category: document.getElementById('admin-edit-cat').value
        });
        Components.closeModal();
        Components.toast('Post updated.', 'success');
        this.route();
    },

    adminDeletePost(postId) {
        Components.showModal(Components.icon('trash-2', 18) + ' Delete Post', '<p style="color:var(--text-secondary)">Are you sure? This will permanently delete this forum post and all its replies.</p>',
            '<button class="btn btn-danger" onclick="Store.deleteForumPost(\'' + postId + '\');Components.closeModal();Components.toast(\'Post deleted.\',\'info\');App.route()">' + Components.icon('trash-2', 14) + ' Delete</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    adminDeleteReply(postId, replyId) {
        Store.deleteReply(postId, replyId);
        Components.toast('Reply deleted.', 'info');
        this.route();
    },

    adminCancelBooking(bookingId) {
        Components.showModal(Components.icon('x-circle', 18) + ' Cancel Booking', '<p style="color:var(--text-secondary)">Cancel this booking? The renter and host will be notified.</p>',
            '<button class="btn btn-danger" onclick="App._doAdminCancelBooking(\'' + bookingId + '\')">' + Components.icon('x', 14) + ' Cancel Booking</button><button class="btn btn-secondary" onclick="Components.closeModal()">Keep</button>');
    },

    _doAdminCancelBooking(bookingId) {
        var b = Store.getBooking(bookingId);
        Store.cancelBooking(bookingId);
        if (b) {
            Store.addNotification(b.renterId, 'Your booking has been cancelled by admin.', 'system', bookingId);
            Store.addNotification(b.ownerId, 'A booking for your tool has been cancelled by admin.', 'system', bookingId);
        }
        Components.closeModal();
        Components.toast('Booking cancelled.', 'info');
        this.route();
    },

    // ==================== FORUM ====================
    showNewPostModal() {
        Components.showModal(Components.icon('plus', 18) + ' New Post',
            '<div class="form-group"><label class="form-label">Category</label><select class="form-select" id="post-category"><option>Tips & Tricks</option><option>Tool Recommendations</option><option>Project Ideas</option></select></div>' +
            '<div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input" id="post-title" placeholder="What\'s on your mind?"></div>' +
            '<div class="form-group"><label class="form-label">Body</label><textarea class="form-textarea" id="post-body" placeholder="Share your thoughts..."></textarea></div>',
            '<button class="btn btn-primary" onclick="App.submitForumPost()">' + Components.icon('send', 14) + ' Post</button><button class="btn btn-secondary" onclick="Components.closeModal()">Cancel</button>');
    },

    submitForumPost() {
        var title = document.getElementById('post-title').value;
        var body = document.getElementById('post-body').value;
        var category = document.getElementById('post-category').value;
        if (!title || !body) { Components.toast('Fill in all fields.', 'error'); return; }
        Store.addForumPost({ authorId: Store.currentUser().id, title: title, body: body, category: category });
        Components.closeModal(); Components.toast('Post published!', 'success'); this.route();
    },

    showForumPost(postId) {
        var allPosts = Store.getForumPosts().concat(Store.getAllForumPosts());
        var post = null;
        for (var i = 0; i < allPosts.length; i++) {
            if (allPosts[i].id === postId) { post = allPosts[i]; break; }
        }
        if (!post) return;
        var author = Store.getUser(post.authorId);
        var date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        var user = Store.currentUser();
        var repliesHtml = post.replies.map(function (r) {
            var ra = Store.getUser(r.authorId);
            var rd = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return '<div style="padding:var(--space-md);border-top:1px solid var(--border-color);display:flex;gap:var(--space-md)">' + Components.avatar(ra) + '<div><div style="font-weight:600;font-size:0.9rem">' + (ra ? ra.name : 'Unknown') + ' <span style="color:var(--text-muted);font-weight:400;font-size:0.8rem">' + rd + '</span></div><div style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px">' + r.body + '</div></div></div>';
        }).join('');
        Components.showModal(post.title,
            '<div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)">' + Components.avatar(author) + '<div><div style="font-weight:600">' + (author ? author.name : 'Unknown') + '</div><div style="color:var(--text-muted);font-size:0.8rem">' + date + ' · ' + post.category + '</div></div></div>' +
            '<p style="color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-lg)">' + post.body + '</p>' +
            '<h4 style="margin-bottom:var(--space-sm)">' + Components.icon('message-circle', 16) + ' Replies (' + post.replies.length + ')</h4>' +
            '<div class="card" style="margin-bottom:var(--space-md)">' + (repliesHtml || '<div style="padding:var(--space-lg);text-align:center;color:var(--text-muted)">No replies yet.</div>') + '</div>' +
            (user ? '<div class="form-group" style="margin-bottom:0"><textarea class="form-textarea" id="reply-body" placeholder="Write a reply..." style="min-height:60px"></textarea></div>' : '<p style="color:var(--text-muted)">Sign in to reply.</p>'),
            user ? '<button class="btn btn-primary" onclick="App.submitReply(\'' + postId + '\')">' + Components.icon('send', 14) + ' Reply</button><button class="btn btn-secondary" onclick="Components.closeModal()">Close</button>' : '<button class="btn btn-secondary" onclick="Components.closeModal()">Close</button>');
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 100);
    },

    submitReply(postId) {
        var body = document.getElementById('reply-body').value;
        if (!body) { Components.toast('Write a reply.', 'error'); return; }
        Store.addReply(postId, { authorId: Store.currentUser().id, body: body });
        Components.closeModal(); Components.toast('Reply posted!', 'success'); this.showForumPost(postId);
    },

    filterForum(cat) {
        document.querySelectorAll('.filters-bar .filter-chip').forEach(function (c) { c.classList.toggle('active', c.textContent === cat); });
        var posts = cat === 'All' ? Store.getForumPosts() : Store.getForumPosts().filter(function (p) { return p.category === cat; });
        document.getElementById('forum-posts').innerHTML = posts.map(function (p) { return Pages._forumPostCard(p); }).join('') || Components.emptyState('message-circle', 'No posts', 'Start a discussion!');
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
    }
};

document.addEventListener('DOMContentLoaded', function () { App.init(); });
