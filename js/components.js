/* ============================================
   TOOLVAULT – REUSABLE UI COMPONENTS
   ============================================ */
const Components = {

    // ---- Lucide Icon Helper ----
    icon(name, size) {
        var s = size || 18;
        return '<i data-lucide="' + name + '" style="width:' + s + 'px;height:' + s + 'px;display:inline-block;vertical-align:middle"></i>';
    },

    // ---- Star Rating Display ----
    stars(rating, count) {
        var html = '<div class="stars">';
        for (var i = 1; i <= 5; i++) {
            html += '<span class="star ' + (i <= Math.round(rating) ? 'filled' : '') + '">★</span>';
        }
        html += '</div>';
        if (rating === 0 && count === undefined) {
            html = '<div class="stars"><span style="color:var(--text-muted);font-size:0.8rem">No ratings yet</span></div>';
        }
        if (count !== undefined) {
            html = '<div style="display:inline-flex;align-items:center;gap:6px">' + html + '<span style="color:var(--text-muted);font-size:0.8rem">(' + count + ')</span></div>';
        }
        return html;
    },

    // ---- Interactive Star Rating Input ----
    starInput(name, current) {
        current = current || 0;
        var html = '<div class="stars star-input" data-name="' + name + '" data-value="' + current + '">';
        for (var i = 1; i <= 5; i++) {
            html += '<span class="star ' + (i <= current ? 'filled' : '') + '" data-val="' + i + '" onclick="Components.setStarValue(\'' + name + '\',' + i + ')">★</span>';
        }
        html += '</div>';
        return html;
    },

    setStarValue(name, val) {
        var el = document.querySelector('.star-input[data-name="' + name + '"]');
        if (!el) return;
        el.dataset.value = val;
        el.querySelectorAll('.star').forEach(function (s) {
            s.classList.toggle('filled', parseInt(s.dataset.val) <= val);
        });
    },

    getStarValue(name) {
        var el = document.querySelector('.star-input[data-name="' + name + '"]');
        return el ? parseInt(el.dataset.value) : 0;
    },

    // ---- Avatar ----
    avatar(user, size) {
        size = size || '';
        if (!user) return '<div class="avatar ' + size + ' avatar-placeholder" style="background:var(--bg-tertiary);color:var(--text-muted)">?</div>';
        var initials = user.name.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase();
        var badge = Store.getHostBadge(user.id);
        var title = user.name + (badge ? ' · ' + badge.label : '');
        if (user.avatar && user.avatar.length > 10) {
            return '<img class="avatar ' + size + '" src="' + user.avatar + '" alt="' + title + '" title="' + title + '" style="object-fit:cover;border-radius:50%">';
        }
        var colors = ['var(--accent-cyan)', 'var(--accent-purple)', 'var(--accent-green)', 'var(--accent-orange)', 'var(--accent-pink)'];
        var colorIdx = user.name.length % colors.length;
        var bgColor = colors[colorIdx];
        return '<div class="avatar ' + size + ' avatar-placeholder" title="' + title + '" style="background:' + bgColor + '20;color:' + bgColor + ';border:1px solid ' + bgColor + '40">' + initials + '</div>';
    },

    // ---- Host Badge ----
    hostBadge(userId) {
        var badge = Store.getHostBadge(userId);
        if (!badge) return '';
        var icons = { power: 'zap', allstar: 'star', host: 'wrench' };
        return '<span class="host-badge" style="background:' + badge.color + '20;color:' + badge.color + ';padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:600;display:inline-flex;align-items:center;gap:4px">' + Components.icon(icons[badge.level] || 'wrench', 12) + ' ' + badge.label + '</span>';
    },

    // ---- Verified Badge ----
    verifiedBadge(user) {
        if (!user || !user.verified) return '';
        return '<span class="verified-badge" title="ID Verified" style="color:var(--accent-cyan);font-size:0.85rem;display:inline-flex;align-items:center;gap:3px">' + Components.icon('badge-check', 14) + ' Verified</span>';
    },

    // ---- Badge ----
    badge(text, type) {
        return '<span class="badge badge-' + type + '">' + text + '</span>';
    },

    conditionBadge(cond) {
        var map = { 'New': 'new', 'Good': 'good', 'Fair': 'fair', 'Poor': 'poor' };
        return this.badge(cond, map[cond] || 'good');
    },

    statusBadge(status) {
        var labels = { 'available': 'Available', 'rented': 'Currently Rented', 'pending': 'Pending', 'approved': 'Approved', 'active': 'Active', 'declined': 'Declined', 'returned': 'Returned', 'cancelled': 'Cancelled' };
        var map = { 'available': 'available', 'rented': 'rented', 'pending': 'pending', 'approved': 'approved', 'active': 'approved', 'declined': 'declined', 'returned': 'returned', 'cancelled': 'declined' };
        return this.badge(labels[status] || status, map[status] || 'available');
    },

    // ---- Tool Card ----
    toolCard(tool) {
        var owner = Store.getUser(tool.ownerId);
        var discountTag = '';
        if (tool.discount5 || tool.discount20) {
            discountTag = '<div style="position:absolute;top:36px;right:8px"><span class="badge badge-new">' + Components.icon('percent', 12) + ' Discounts</span></div>';
        }
        return '<div class="tool-card" onclick="App.navigate(\'tool/' + tool.id + '\')">' +
            '<div class="tool-card-image">' +
            '<img src="' + tool.image + '" alt="' + tool.name + '" loading="lazy" onerror="this.src=\'https://placehold.co/400x300/1a1a2e/00f0ff?text=Tool\'">' +
            '<div class="tool-card-badge">' + this.statusBadge(tool.status) + '</div>' +
            (tool.deliveryAvailable ? '<div style="position:absolute;bottom:8px;left:8px"><span class="badge badge-new">' + Components.icon('truck', 12) + ' Delivery</span></div>' : '') +
            discountTag +
            '</div>' +
            '<div class="tool-card-body">' +
            '<div class="tool-card-title">' + tool.name + '</div>' +
            '<div class="tool-card-owner">' + this.avatar(owner) + ' ' + (owner ? owner.name : 'Unknown') + (owner && owner.verified ? ' ' + Components.icon('badge-check', 14) : '') + '</div>' +
            '<div style="margin-top:4px">' + this.stars(tool.rating, tool.reviewCount) + '</div>' +
            '<div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px">' + (tool.tripCount || 0) + ' rental' + (tool.tripCount !== 1 ? 's' : '') + '</div>' +
            '</div>' +
            '<div class="tool-card-footer">' +
            '<div class="tool-card-price">$' + tool.pricePerDay + '<span>/day</span></div>' +
            this.conditionBadge(tool.condition) +
            '</div></div>';
    },

    // ---- Booking Item ----
    bookingItem(booking, perspective) {
        perspective = perspective || 'renter';
        var tool = Store.getTool(booking.toolId);
        var other = perspective === 'renter' ? Store.getUser(booking.ownerId) : Store.getUser(booking.renterId);
        if (!tool) return '';
        var showActions = perspective === 'owner' && booking.status === 'pending';
        var showReturn = perspective === 'owner' && booking.status === 'active';
        var showReview = booking.status === 'returned' && perspective === 'renter';
        var planLabels = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
        // Check if already reviewed
        var user = Store.currentUser();
        var alreadyReviewed = user && Store.hasReviewed(booking.id, user.id);

        return '<div class="booking-item animate-in">' +
            '<img class="booking-item-image" src="' + tool.image + '" alt="' + tool.name + '" onerror="this.src=\'https://placehold.co/60x60/1a1a2e/00f0ff?text=T\'">' +
            '<div class="booking-item-info">' +
            '<div class="booking-item-title">' + tool.name + '</div>' +
            '<div class="booking-item-dates">' +
            Components.icon('calendar', 14) + ' ' + booking.startDate + ' → ' + booking.endDate + ' &nbsp;·&nbsp; ' + Components.icon('dollar-sign', 14) + ' $' + booking.totalPrice +
            (booking.protectionPlan ? ' &nbsp;·&nbsp; ' + Components.icon('shield', 14) + ' ' + (planLabels[booking.protectionPlan] || 'Standard') : '') +
            (booking.deliveryRequested ? ' &nbsp;·&nbsp; ' + Components.icon('truck', 14) + ' Delivery' : '') +
            '</div>' +
            '<div style="margin-top:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            (other ? '<span style="color:var(--text-muted);font-size:0.8rem">' + (perspective === 'renter' ? 'Owner' : 'Renter') + ': ' + other.name + '</span>' : '') +
            this.statusBadge(booking.status) +
            '<span style="color:var(--text-muted);font-size:0.75rem">' + Components.icon('credit-card', 12) + ' ' + (booking.paymentStatus === 'paid' ? 'Paid' : 'Pending') + '</span>' +
            '</div></div>' +
            '<div class="booking-item-actions">' +
            (showActions ? '<button class="btn btn-success btn-sm" onclick="event.stopPropagation();App.approveBooking(\'' + booking.id + '\')">' + Components.icon('check', 14) + ' Accept</button> <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();App.declineBooking(\'' + booking.id + '\')">' + Components.icon('x', 14) + ' Decline</button>' : '') +
            (showReturn ? '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();App.markReturned(\'' + booking.id + '\')">Mark Returned</button>' : '') +
            (showReview && !alreadyReviewed ? '<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();App.showReviewModal(\'' + booking.id + '\')">' + Components.icon('star', 14) + ' Review</button>' : '') +
            (showReview && alreadyReviewed ? '<span class="badge badge-available">' + Components.icon('check', 12) + ' Reviewed</span>' : '') +
            '</div></div>';
    },

    // ---- Calendar ----
    calendar(toolId, selectedStart, selectedEnd) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var firstDay = new Date(year, month, 1).getDay();
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var bookings = Store.getBookings().filter(function (b) { return b.toolId === toolId && ['active', 'approved'].includes(b.status); });
        var bookedDates = new Set();
        bookings.forEach(function (b) {
            var d = new Date(b.startDate);
            var end = new Date(b.endDate);
            while (d <= end) { bookedDates.add(d.toISOString().split('T')[0]); d.setDate(d.getDate() + 1); }
        });

        var html = '<div class="calendar"><div class="calendar-header"><h3>' + Components.icon('calendar', 18) + ' ' + monthNames[month] + ' ' + year + '</h3></div><div class="calendar-grid">';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (d) {
            html += '<div class="calendar-day-header">' + d + '</div>';
        });
        for (var i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>';
        for (var d = 1; d <= daysInMonth; d++) {
            var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            var isToday = d === now.getDate();
            var isPast = new Date(dateStr) < new Date(now.toISOString().split('T')[0]);
            var isBooked = bookedDates.has(dateStr);
            var isSelected = dateStr === selectedStart || dateStr === selectedEnd;
            var isInRange = selectedStart && selectedEnd && dateStr > selectedStart && dateStr < selectedEnd;
            var cls = 'calendar-day';
            if (isToday) cls += ' today';
            if (isPast) cls += ' disabled';
            if (isBooked) cls += ' booked';
            if (isSelected) cls += ' selected';
            if (isInRange) cls += ' in-range';
            html += '<div class="' + cls + '" data-date="' + dateStr + '"' + (!isPast && !isBooked ? ' onclick="App.selectDate(\'' + dateStr + '\')"' : '') + '>' + d + '</div>';
        }
        html += '</div></div>';
        return html;
    },

    // ---- Review Card ----
    reviewCard(review) {
        var reviewer = Store.getUser(review.reviewerId);
        var date = new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        var toolR = review.toolRating || review.rating || 0;
        var sellerR = review.sellerRating || review.rating || 0;
        return '<div class="review-card">' +
            '<div class="review-header">' +
            this.avatar(reviewer) +
            '<div><div class="review-author">' + (reviewer ? reviewer.name : 'Anonymous') + ' ' + (reviewer ? this.verifiedBadge(reviewer) : '') + '</div>' +
            '<div class="review-date">' + date + '</div></div>' +
            '<div style="margin-left:auto;text-align:right">' +
            '<div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;font-size:0.8rem;color:var(--text-muted)">' + this.icon('wrench', 12) + ' Product ' + this.stars(toolR) + '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;font-size:0.8rem;color:var(--text-muted);margin-top:2px">' + this.icon('user', 12) + ' Seller ' + this.stars(sellerR) + '</div>' +
            '</div></div>' +
            (review.text ? '<div class="review-text">' + review.text + '</div>' : '') + '</div>';
    },

    // ---- Toast ----
    toast(message, type) {
        type = type || 'info';
        var container = document.getElementById('toast-container');
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        var icons = { success: 'check-circle', error: 'x-circle', info: 'info' };
        toast.innerHTML = '<span>' + Components.icon(icons[type] || 'info', 20) + '</span><span>' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">' + Components.icon('x', 14) + '</button>';
        container.appendChild(toast);
        setTimeout(function () { if (toast.parentElement) toast.remove(); }, 4500);
    },

    // ---- Modal ----
    showModal(title, bodyHtml, footerHtml) {
        footerHtml = footerHtml || '';
        var overlay = document.getElementById('modal-overlay');
        var container = document.getElementById('modal-container');
        container.innerHTML = '<div class="modal-header"><h3>' + title + '</h3><button class="btn btn-ghost" onclick="Components.closeModal()">' + Components.icon('x', 18) + '</button></div>' +
            '<div class="modal-body">' + bodyHtml + '</div>' +
            (footerHtml ? '<div class="modal-footer">' + footerHtml + '</div>' : '');
        overlay.style.display = 'flex';
        overlay.onclick = function (e) { if (e.target === overlay) Components.closeModal(); };
        // Render lucide icons in modal
        if (window.lucide) setTimeout(function () { lucide.createIcons(); }, 50);
    },

    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    },

    // ---- Footer ----
    footer() {
        return '<footer class="footer"><div class="footer-grid">' +
            '<div class="footer-brand"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="logo-text">Tool<span class="logo-accent">Vault</span></span></div><p>Community-powered tool sharing. Save money, reduce waste, and build trust with your neighbors.</p></div>' +
            '<div class="footer-section"><h4>Platform</h4><a href="#/browse">' + Components.icon('search', 14) + ' Browse Tools</a><a href="#/register">' + Components.icon('user-plus', 14) + ' Become a Host</a><a href="#/register">' + Components.icon('key', 14) + ' Sign Up to Rent</a><a href="#/forum">' + Components.icon('message-circle', 14) + ' Community Forum</a></div>' +
            '<div class="footer-section"><h4>Support</h4><a href="#/about">' + Components.icon('info', 14) + ' About ToolVault</a><a href="#/safety">' + Components.icon('shield', 14) + ' Safety Guidelines</a><a href="#/help">' + Components.icon('help-circle', 14) + ' Help Center</a><a href="#/contact">' + Components.icon('mail', 14) + ' Contact Us</a></div>' +
            '<div class="footer-section"><h4>Legal</h4><a href="#/terms">' + Components.icon('file-text', 14) + ' Terms of Service</a><a href="#/privacy">' + Components.icon('lock', 14) + ' Privacy Policy</a><a href="#/cookies">' + Components.icon('cookie', 14) + ' Cookie Policy</a><a href="#/insurance">' + Components.icon('shield-check', 14) + ' Insurance Info</a></div>' +
            '</div><div class="footer-bottom">© 2026 ToolVault. All rights reserved. Built with ♥ for the community. | <a href="#/about">About</a> | ' + Components.icon('lock', 12) + ' HTTPS Secured</div></footer>';
    },

    // ---- Empty State ----
    emptyState(iconName, title, desc, actionHtml) {
        actionHtml = actionHtml || '';
        return '<div class="empty-state"><div class="empty-state-icon">' + Components.icon(iconName, 48) + '</div><h3>' + title + '</h3><p>' + desc + '</p>' + actionHtml + '</div>';
    },

    // ---- Protection Plan Selector ----
    protectionPlanSelector() {
        return '<div class="form-group"><label class="form-label">' + Components.icon('shield', 16) + ' Protection Plan</label>' +
            '<div style="display:flex;flex-direction:column;gap:8px">' +
            '<label class="protection-option" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);cursor:pointer"><input type="radio" name="protection" value="basic" style="accent-color:var(--accent-cyan)"><div style="flex:1"><strong>Basic</strong><br><span style="color:var(--text-muted);font-size:0.8rem">Covers up to $500 in damages. Free.</span></div><span style="color:var(--accent-green);font-weight:600">Free</span></label>' +
            '<label class="protection-option" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass);border:2px solid var(--accent-cyan);border-radius:var(--radius-md);cursor:pointer"><input type="radio" name="protection" value="standard" checked style="accent-color:var(--accent-cyan)"><div style="flex:1"><strong>Standard</strong> <span class="badge badge-new">Recommended</span><br><span style="color:var(--text-muted);font-size:0.8rem">Covers up to $2,000 in damages. $0 deductible.</span></div><span style="color:var(--accent-cyan);font-weight:600">+$3/day</span></label>' +
            '<label class="protection-option" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);cursor:pointer"><input type="radio" name="protection" value="premium" style="accent-color:var(--accent-cyan)"><div style="flex:1"><strong>Premium</strong><br><span style="color:var(--text-muted);font-size:0.8rem">Full replacement coverage. Priority support. $0 deductible.</span></div><span style="color:var(--accent-purple);font-weight:600">+$5/day</span></label>' +
            '</div></div>';
    },

    // ---- 3D Credit Card Payment UI ----
    paymentMethodUI() {
        return '<div class="form-group"><label class="form-label">' + Components.icon('credit-card', 16) + ' Payment Method</label>' +
            '<div style="display:flex;gap:8px;margin-bottom:12px">' +
            '<button type="button" class="filter-chip active" onclick="App.selectPayment(\'card\',this)" data-pay="card">' + Components.icon('credit-card', 14) + ' Credit Card</button>' +
            '<button type="button" class="filter-chip" onclick="App.selectPayment(\'paypal\',this)" data-pay="paypal">' + Components.icon('wallet', 14) + ' PayPal</button>' +
            '<button type="button" class="filter-chip" onclick="App.selectPayment(\'applepay\',this)" data-pay="applepay">' + Components.icon('smartphone', 14) + ' Apple Pay</button>' +
            '</div>' +
            '<div id="payment-form-card">' +
            // 3D Credit Card
            '<div class="credit-card-3d">' +
            '<div class="credit-card-inner" id="credit-card-inner">' +
            '<div class="credit-card-front">' +
            '<div class="cc-chip"></div>' +
            '<div class="cc-contactless">' + Components.icon('wifi', 16) + '</div>' +
            '<div class="cc-number" id="cc-display-number">•••• •••• •••• ••••</div>' +
            '<div class="cc-bottom"><div><div class="cc-label">CARDHOLDER</div><div class="cc-name" id="cc-display-name">YOUR NAME</div></div><div><div class="cc-label">EXPIRES</div><div class="cc-expiry" id="cc-display-expiry">MM/YY</div></div></div>' +
            '<div class="cc-brand">' + Components.icon('credit-card', 28) + '</div>' +
            '</div>' +
            '<div class="credit-card-back"><div class="cc-stripe"></div><div class="cc-cvv-box"><div class="cc-label">CVV</div><div class="cc-cvv" id="cc-display-cvv">***</div></div></div>' +
            '</div></div>' +
            // Input fields
            '<div style="margin-top:16px">' +
            '<div class="form-group" style="margin-bottom:8px"><input type="text" class="form-input" id="cc-number" placeholder="4242 4242 4242 4242" maxlength="19" oninput="Components.updateCardDisplay()" onfocus="Components.flipCard(false)"></div>' +
            '<div class="form-group" style="margin-bottom:8px"><input type="text" class="form-input" id="cc-name" placeholder="Cardholder Name" oninput="Components.updateCardDisplay()" onfocus="Components.flipCard(false)"></div>' +
            '<div style="display:flex;gap:8px">' +
            '<div class="form-group" style="margin-bottom:8px;flex:1"><input type="text" class="form-input" id="cc-expiry" placeholder="MM/YY" maxlength="5" oninput="Components.updateCardDisplay()" onfocus="Components.flipCard(false)"></div>' +
            '<div class="form-group" style="margin-bottom:8px;flex:1"><input type="text" class="form-input" id="cc-cvv" placeholder="CVC" maxlength="4" oninput="Components.updateCardDisplay()" onfocus="Components.flipCard(true)"></div>' +
            '</div></div>' +
            '<p style="color:var(--text-muted);font-size:0.75rem">' + Components.icon('lock', 12) + ' Test mode – no real charges. Payments secured via HTTPS.</p>' +
            '</div></div>';
    },

    updateCardDisplay() {
        var num = document.getElementById('cc-number');
        var name = document.getElementById('cc-name');
        var exp = document.getElementById('cc-expiry');
        var cvv = document.getElementById('cc-cvv');
        if (num) {
            var dn = document.getElementById('cc-display-number');
            if (dn) dn.textContent = num.value || '•••• •••• •••• ••••';
        }
        if (name) {
            var dname = document.getElementById('cc-display-name');
            if (dname) dname.textContent = name.value.toUpperCase() || 'YOUR NAME';
        }
        if (exp) {
            var de = document.getElementById('cc-display-expiry');
            if (de) de.textContent = exp.value || 'MM/YY';
        }
        if (cvv) {
            var dc = document.getElementById('cc-display-cvv');
            if (dc) dc.textContent = cvv.value || '***';
        }
    },

    flipCard(toBack) {
        var inner = document.getElementById('credit-card-inner');
        if (inner) {
            if (toBack) { inner.style.transform = 'rotateY(180deg)'; }
            else { inner.style.transform = 'rotateY(0deg)'; }
        }
    },

    // ---- Map Widget ----
    mapWidget(lat, lng, height) {
        height = height || 250;
        if (!lat || !lng) return '<div style="background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-xl);text-align:center;color:var(--text-muted)">' + Components.icon('map-pin', 24) + '<br>Location not available</div>';
        // Offset for privacy (~500m random)
        var oLat = lat + (Math.random() - 0.5) * 0.009;
        var oLng = lng + (Math.random() - 0.5) * 0.009;
        var mapId = 'map-' + Date.now();
        setTimeout(function () {
            var el = document.getElementById(mapId);
            if (el && window.L) {
                var map = L.map(mapId).setView([oLat, oLng], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                L.circle([oLat, oLng], { color: '#00f0ff', fillColor: '#00f0ff', fillOpacity: 0.15, radius: 500 }).addTo(map);
                // Fix map tiles not loading
                setTimeout(function () { map.invalidateSize(); }, 200);
            }
        }, 100);
        return '<div id="' + mapId + '" style="height:' + height + 'px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border-color)"></div>';
    },

    // ---- Image Upload Preview ----
    imageUpload(inputId, previewId) {
        return '<div class="image-upload-container">' +
            '<div class="image-upload-preview" id="' + previewId + '" onclick="document.getElementById(\'' + inputId + '\').click()">' +
            '<div class="image-upload-placeholder">' + Components.icon('camera', 32) + '<br><span>Click to upload image</span><br><span style="font-size:0.75rem;color:var(--text-muted)">PNG, JPG up to 5MB</span></div>' +
            '</div>' +
            '<input type="file" id="' + inputId + '" accept="image/*" style="display:none" onchange="Components.handleImageUpload(\'' + inputId + '\',\'' + previewId + '\')">' +
            '</div>';
    },

    handleImageUpload(inputId, previewId) {
        var input = document.getElementById(inputId);
        var preview = document.getElementById(previewId);
        if (!input || !input.files || !input.files[0]) return;
        var file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            Components.toast('Image must be under 5MB', 'error');
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md)">';
            preview.dataset.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    getUploadedImage(previewId) {
        var preview = document.getElementById(previewId);
        return preview ? preview.dataset.imageData || '' : '';
    },

    // ---- Discount Display ----
    discountInfo(tool) {
        if (!tool.discount5 && !tool.discount20) return '';
        var html = '<div class="discount-info" style="background:var(--bg-glass);border:1px solid var(--accent-green);border-radius:var(--radius-md);padding:var(--space-sm) var(--space-md);margin-top:var(--space-sm)">';
        html += '<div style="font-size:0.85rem;font-weight:600;color:var(--accent-green);margin-bottom:4px">' + Components.icon('tag', 14) + ' Volume Discounts</div>';
        if (tool.discount5) html += '<div style="font-size:0.8rem;color:var(--text-secondary)">' + Components.icon('check', 12) + ' ' + tool.discount5 + '% off for 5+ day rentals</div>';
        if (tool.discount20) html += '<div style="font-size:0.8rem;color:var(--text-secondary)">' + Components.icon('check', 12) + ' ' + tool.discount20 + '% off for 20+ day rentals</div>';
        html += '</div>';
        return html;
    }
};
