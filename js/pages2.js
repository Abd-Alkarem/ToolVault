/* ============================================
   TOOLVAULT – PAGE RENDERERS (Part 2)
   Browse, Tool Detail, Add/Edit, My Tools,
   Bookings, Profile, Admin, Forum
   ============================================ */

// ==================== BROWSE TOOLS ====================
Pages.browseTools = function () {
    var tools = Store.getTools();
    var catSet = {};
    tools.forEach(function (t) { catSet[t.category] = true; });
    var categories = ['All'].concat(Object.keys(catSet));
    var filterChips = categories.map(function (c) {
        return '<button class="filter-chip ' + (c === 'All' ? 'active' : '') + '" onclick="App.filterByCategory(\'' + c + '\')" data-cat="' + c + '">' + c + '</button>';
    }).join('');

    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">Browse Tools</h1><p class="page-subtitle">Find the perfect tool for your project</p></div>' +
        '<div class="search-bar animate-in animate-in-delay-1" style="margin-bottom:var(--space-lg)"><span>' + Components.icon('search', 18) + '</span><input type="text" id="tool-search" placeholder="Search tools by name, category, or keyword..." oninput="App.filterTools()"></div>' +
        '<div class="filters-bar animate-in animate-in-delay-2" id="category-filters">' + filterChips + '</div>' +
        '<div style="display:flex;gap:var(--space-md);margin-bottom:var(--space-lg);flex-wrap:wrap;align-items:center" class="animate-in animate-in-delay-2">' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer"><input type="checkbox" id="filter-delivery" onchange="App.filterTools()" style="accent-color:var(--accent-cyan)"> ' + Components.icon('truck', 14) + ' Delivery available</label>' +
        '<select class="form-select" id="filter-sort" onchange="App.filterTools()" style="width:auto;padding:6px 12px;font-size:0.85rem"><option value="newest">Newest First</option><option value="price-low">Price: Low → High</option><option value="price-high">Price: High → Low</option><option value="rating">Highest Rated</option><option value="popular">Most Rentals</option></select>' +
        '<span id="tool-count" style="margin-left:auto;color:var(--text-muted);font-size:0.85rem">' + tools.length + ' tools</span></div>' +
        '<div class="grid-4 animate-in animate-in-delay-3" id="tools-grid">' + tools.map(function (t) { return Components.toolCard(t); }).join('') + '</div></div>' +
        Components.footer();
};

// ==================== TOOL DETAIL ====================
Pages.toolDetail = function (toolId) {
    var tool = Store.getTool(toolId);
    if (!tool) return '<div class="page-section">' + Components.emptyState('wrench', 'Tool Not Found', 'This tool may have been removed.') + '</div>';
    var owner = Store.getUser(tool.ownerId);
    var reviews = Store.getReviewsForTool(toolId);
    var user = Store.currentUser();
    var isOwner = user && user.id === tool.ownerId;

    var ownerRating = owner ? Store.getUserRating(owner.id) : 0;
    var ownerReviewCount = owner ? Store.getReviewsForUser(owner.id).length : 0;

    // Compute live rating from real reviews
    var liveRating = Store.getToolRating(toolId);
    if (liveRating > 0) { tool.rating = liveRating; tool.reviewCount = reviews.length; }

    // Check if user can leave a review (has a returned booking they haven't reviewed)
    var canReview = false;
    var reviewBookingId = null;
    if (user && !isOwner) {
        var userBookings = Store.getBookings().filter(function (b) {
            return b.toolId === toolId && b.renterId === user.id && b.status === 'returned';
        });
        for (var bi = 0; bi < userBookings.length; bi++) {
            if (!Store.hasReviewed(userBookings[bi].id, user.id)) {
                canReview = true;
                reviewBookingId = userBookings[bi].id;
                break;
            }
        }
    }

    // Discount display
    var discountHtml = Components.discountInfo(tool);

    // Map
    var mapHtml = '';
    if (tool.lat && tool.lng) {
        mapHtml = '<div style="margin-top:var(--space-xl)" class="animate-in"><h3 style="margin-bottom:var(--space-md)">' + Components.icon('map-pin', 18) + ' Approximate Location</h3>' + Components.mapWidget(tool.lat, tool.lng, 280) + '</div>';
    }

    var bookBtn = '';
    if (!isOwner && user) {
        bookBtn = '<button class="btn btn-primary btn-lg" style="width:100%" onclick="App.showBookingModal(\'' + tool.id + '\')">' + (tool.status === 'rented' ? Components.icon('clock', 16) + ' Join Waitlist' : Components.icon('calendar', 16) + ' Book This Tool') + '</button>';
    } else if (!user) {
        bookBtn = '<a href="#/login" class="btn btn-primary btn-lg" style="width:100%">' + Components.icon('log-in', 16) + ' Sign In to Book</a>';
    } else {
        bookBtn = '<div style="display:flex;gap:8px"><button class="btn btn-secondary" style="flex:1" onclick="App.showEditToolModal(\'' + tool.id + '\')">' + Components.icon('edit', 14) + ' Edit</button><button class="btn btn-danger" style="flex:1" onclick="App.confirmDeleteTool(\'' + tool.id + '\')">' + Components.icon('trash-2', 14) + ' Delete</button></div>';
    }
    if (Store.isAdmin() && !isOwner) {
        bookBtn += '<button class="btn btn-danger btn-sm" style="margin-top:8px;width:100%" onclick="App.confirmDeleteTool(\'' + tool.id + '\')">' + Components.icon('shield-off', 14) + ' Admin Remove</button>';
    }

    return '<div class="page-section">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);align-items:start" class="tool-detail-grid">' +
        '<div class="animate-in">' +
        '<div style="border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-tertiary);aspect-ratio:4/3"><img src="' + tool.image + '" alt="' + tool.name + '" style="width:100%;height:100%;object-fit:cover" onerror="this.src=\'https://placehold.co/600x450/1a1a2e/00f0ff?text=Tool\'"></div>' +
        (tool.guidelines ? '<div class="glass-card" style="margin-top:var(--space-md)"><h4 style="margin-bottom:8px">' + Components.icon('clipboard', 16) + ' Usage Guidelines</h4><p style="color:var(--text-secondary);font-size:0.9rem">' + tool.guidelines + '</p></div>' : '') +
        '</div>' +
        '<div class="animate-in animate-in-delay-1">' +
        '<div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-md);flex-wrap:wrap">' + Components.statusBadge(tool.status) + ' ' + Components.conditionBadge(tool.condition) +
        (tool.deliveryAvailable ? ' <span class="badge badge-new">' + Components.icon('truck', 12) + ' Delivery</span>' : '') + '</div>' +
        '<h1 style="font-size:1.8rem;font-weight:700;margin-bottom:var(--space-sm)">' + tool.name + '</h1>' +
        '<div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)">' + Components.stars(tool.rating, tool.reviewCount) + '<span style="color:var(--text-muted);font-size:0.85rem">' + tool.tripCount + ' rental' + (tool.tripCount !== 1 ? 's' : '') + '</span></div>' +
        '<p style="color:var(--text-secondary);margin-bottom:var(--space-xl);line-height:1.8">' + tool.description + '</p>' +
        '<div class="glass-card" style="margin-bottom:var(--space-lg)">' +
        '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px"><span style="font-family:var(--font-display);font-size:2rem;font-weight:700;background:var(--gradient-main);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">$' + tool.pricePerDay + '</span><span style="color:var(--text-muted)">per day</span></div>' +
        (tool.depositAmount ? '<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">' + Components.icon('lock', 12) + ' $' + tool.depositAmount + ' security deposit (refundable)</div>' : '') +
        (tool.deliveryAvailable ? '<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-md)">' + Components.icon('truck', 12) + ' Delivery available +$' + tool.deliveryFee + '</div>' : '') +
        discountHtml +
        bookBtn +
        '</div>' +
        (owner ? '<div class="glass-card" style="cursor:pointer" onclick="App.navigate(\'profile/' + owner.id + '\')"><div style="display:flex;align-items:center;gap:var(--space-md)">' + Components.avatar(owner, 'avatar-lg') + '<div><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:600">' + owner.name + '</span>' + Components.verifiedBadge(owner) + ' ' + Components.hostBadge(owner.id) + '</div><div style="font-size:0.85rem;color:var(--text-muted)">' + owner.location + '</div><div style="margin-top:4px">' + Components.stars(ownerRating, ownerReviewCount) + '</div><div style="font-size:0.8rem;color:var(--text-muted)">' + Components.icon('clock', 12) + ' ' + owner.responseTime + ' · ' + owner.responseRate + '% rate</div></div></div></div>' : '') +
        '</div></div>' +
        '<div style="margin-top:var(--space-2xl)"><h3 style="margin-bottom:var(--space-md)">' + Components.icon('calendar', 18) + ' Availability</h3>' + Components.calendar(toolId) + '</div>' +
        mapHtml +
        '<div style="margin-top:var(--space-2xl)" class="animate-in">' +
        '<h3 style="margin-bottom:var(--space-md)">' + Components.icon('message-square', 18) + ' Reviews (' + reviews.length + ')' + (tool.rating > 0 ? ' <span style="font-size:0.9rem;font-weight:400;color:var(--text-secondary);margin-left:8px">' + Components.stars(tool.rating) + ' ' + tool.rating + ' avg</span>' : '') + '</h3>' +
        (canReview ? '<div class="card" style="margin-bottom:var(--space-lg);border:1px solid var(--border-glow)"><div class="card-body"><h4 style="margin-bottom:var(--space-md)">' + Components.icon('edit-3', 16) + ' Write a Review</h4>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('wrench', 14) + ' Product Rating</label>' + Components.starInput('tool-page-product-rating', 0) + '</div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('user', 14) + ' Seller Rating</label>' + Components.starInput('tool-page-seller-rating', 0) + '</div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('message-square', 14) + ' Comment</label><textarea class="form-textarea" id="tool-review-text" rows="3" placeholder="Share your experience with this tool and the seller..."></textarea></div>' +
        '<button class="btn btn-primary" onclick="App.submitToolPageReview(\'' + reviewBookingId + '\',\'' + (owner ? owner.id : '') + '\')">' + Components.icon('send', 14) + ' Submit Review</button></div></div>' : '') +
        '<div class="card">' + (reviews.length > 0 ? reviews.map(function (r) { return Components.reviewCard(r); }).join('') : '<div class="card-body" style="text-align:center;color:var(--text-muted);padding:var(--space-2xl)">No reviews yet.' + (user && !isOwner ? ' Book this tool and be the first to review!' : '') + '</div>') + '</div></div></div>' +
        Components.footer();
};

// ==================== ADD TOOL ====================
Pages.addTool = function () {
    if (!Store.isLoggedIn()) return Pages.login();
    return '<div class="dashboard-layout">' + Pages._dashboardSidebar('add-tool') +
        '<div class="dashboard-content">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('plus-circle', 24) + ' List a New Tool</h1><p class="page-subtitle">Share your tools with the community and earn</p></div>' +
        '<div class="card animate-in animate-in-delay-1"><div class="card-body">' +
        '<form id="add-tool-form" onsubmit="App.handleAddTool(event)">' +
        '<div class="form-group"><label class="form-label">' + Components.icon('tag', 14) + ' Tool Name</label><input type="text" class="form-input" id="tool-name" placeholder="e.g. DeWalt Cordless Drill 20V" required></div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('file-text', 14) + ' Description</label><textarea class="form-textarea" id="tool-desc" placeholder="Describe the tool, what\'s included, condition details, and any tips for usage..." required></textarea></div>' +
        '<div class="grid-3">' +
        '<div class="form-group"><label class="form-label">' + Components.icon('folder', 14) + ' Category</label><select class="form-select" id="tool-category" required><option value="">Select...</option><option>Power Tools</option><option>Hand Tools</option><option>Garden</option><option>Outdoor</option><option>Automotive</option><option>Painting</option><option>Plumbing</option><option>Other</option></select></div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('activity', 14) + ' Condition</label><select class="form-select" id="tool-condition" required><option value="">Select...</option><option>New</option><option>Good</option><option>Fair</option></select></div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('dollar-sign', 14) + ' Price Per Day ($)</label><input type="number" class="form-input" id="tool-price" placeholder="10" min="1" required></div></div>' +
        '<div class="grid-2"><div class="form-group"><label class="form-label">' + Components.icon('lock', 14) + ' Security Deposit ($)</label><input type="number" class="form-input" id="tool-deposit" placeholder="50" min="0" value="50"></div>' +
        '<div></div></div>' +
        // Image upload
        '<div class="form-group"><label class="form-label">' + Components.icon('camera', 14) + ' Tool Photo</label>' + Components.imageUpload('tool-image-input', 'tool-image-preview') + '</div>' +
        // Discount fields
        '<h4 style="margin-top:var(--space-lg);margin-bottom:var(--space-sm)">' + Components.icon('tag', 16) + ' Volume Discounts (Optional)</h4>' +
        '<div class="grid-2"><div class="form-group"><label class="form-label">Discount for 5+ days (%)</label><input type="number" class="form-input" id="tool-discount5" placeholder="e.g. 10" min="0" max="50"></div>' +
        '<div class="form-group"><label class="form-label">Discount for 20+ days (%)</label><input type="number" class="form-input" id="tool-discount20" placeholder="e.g. 25" min="0" max="70"></div></div>' +
        // Delivery
        '<div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="tool-delivery" style="accent-color:var(--accent-cyan)" onchange="document.getElementById(\'delivery-fee-group\').style.display=this.checked?\'block\':\'none\'"> ' + Components.icon('truck', 14) + ' Offer delivery</label></div>' +
        '<div class="form-group" id="delivery-fee-group" style="display:none"><label class="form-label">Delivery Fee ($)</label><input type="number" class="form-input" id="tool-delivery-fee" placeholder="10" min="0"></div>' +
        '<div class="form-group"><label class="form-label">' + Components.icon('clipboard', 14) + ' Usage Guidelines (optional)</label><textarea class="form-textarea" id="tool-guidelines" placeholder="Any special instructions, safety notes, or return requirements..." style="min-height:60px"></textarea></div>' +
        '<button type="submit" class="btn btn-primary btn-lg">' + Components.icon('plus', 16) + ' List Tool</button>' +
        '</form></div></div></div></div>';
};

// ==================== MY TOOLS ====================
Pages.myTools = function () {
    if (!Store.isLoggedIn()) return Pages.login();
    var user = Store.currentUser();
    var tools = Store.getToolsByUser(user.id);
    return '<div class="dashboard-layout">' + Pages._dashboardSidebar('my-tools') +
        '<div class="dashboard-content">' +
        '<div class="page-header animate-in" style="display:flex;align-items:center;justify-content:space-between"><div><h1 class="page-title">My Tools</h1><p class="page-subtitle">Manage your tool inventory</p></div><a href="#/add-tool" class="btn btn-primary">' + Components.icon('plus', 14) + ' Add Tool</a></div>' +
        (tools.length === 0 ? Components.emptyState('wrench', 'No tools yet', 'List your first tool and start earning!', '<a href="#/add-tool" class="btn btn-primary">List a Tool</a>') :
            '<div class="grid-3 animate-in animate-in-delay-1">' + tools.map(function (t) { return Components.toolCard(t); }).join('') + '</div>') +
        '</div></div>';
};

// ==================== BOOKINGS ====================
Pages.bookings = function () {
    if (!Store.isLoggedIn()) return Pages.login();
    var user = Store.currentUser();
    var asRenter = Store.getBookingsByRenter(user.id);
    var asOwner = Store.getBookingsByOwner(user.id);
    var pendingOwner = asOwner.filter(function (b) { return b.status === 'pending'; });
    // Default to incoming requests tab if host has pending bookings
    var defaultOwner = Store.isHost() && pendingOwner.length > 0;
    var defaultList = '';
    if (defaultOwner) {
        defaultList = asOwner.length === 0 ? Components.emptyState('inbox', 'No requests', 'Requests appear when someone books your tools.') : '<div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + asOwner.map(function (b) { return Components.bookingItem(b, 'owner'); }).join('') + '</div>';
    } else {
        defaultList = asRenter.length === 0 ? Components.emptyState('calendar', 'No rentals yet', 'Browse tools and book your first rental!', '<a href="#/browse" class="btn btn-primary">Browse Tools</a>') : '<div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + asRenter.map(function (b) { return Components.bookingItem(b, 'renter'); }).join('') + '</div>';
    }
    return '<div class="dashboard-layout">' + Pages._dashboardSidebar('bookings') +
        '<div class="dashboard-content">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('calendar', 24) + ' Bookings</h1><p class="page-subtitle">Manage your rental requests and history</p></div>' +
        '<div class="tabs" id="booking-tabs">' +
        '<button class="tab ' + (defaultOwner ? '' : 'active') + '" onclick="App.switchBookingTab(\'renter\')">' + Components.icon('shopping-bag', 14) + ' My Rentals (' + asRenter.length + ')</button>' +
        (Store.isHost() ? '<button class="tab ' + (defaultOwner ? 'active' : '') + '" onclick="App.switchBookingTab(\'owner\')">' + Components.icon('inbox', 14) + ' Incoming Requests (' + asOwner.length + ')' + (pendingOwner.length > 0 ? ' <span style="background:var(--accent-red);color:white;font-size:0.7rem;padding:2px 6px;border-radius:10px;margin-left:4px">' + pendingOwner.length + ' new</span>' : '') + '</button>' : '') +
        '</div><div id="booking-list">' + defaultList +
        '</div></div></div>';
};

// ==================== PROFILE ====================
Pages.profile = function (userId) {
    var viewingUser = userId ? Store.getUser(userId) : Store.currentUser();
    if (!viewingUser) return '<div class="page-section">' + Components.emptyState('user', 'User Not Found', "This user doesn't exist.") + '</div>';
    var isSelf = Store.currentUser() && Store.currentUser().id === viewingUser.id;
    var tools = Store.getToolsByUser(viewingUser.id);
    var reviews = Store.getReviewsForUser(viewingUser.id);
    var joined = new Date(viewingUser.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    var badge = Store.getHostBadge(viewingUser.id);
    var rating = Store.getUserRating(viewingUser.id);
    var tripCount = Store.getUserTripCount(viewingUser.id);

    // Verification section for hosts
    var verifySection = '';
    if (isSelf && Store.isHost() && !viewingUser.verified && !viewingUser.verificationPending) {
        verifySection = '<div class="glass-card" style="margin:var(--space-lg) 0;border-color:var(--accent-orange)"><h4>' + Components.icon('id-card', 16) + ' Get Verified</h4><p style="color:var(--text-secondary);font-size:0.85rem;margin:8px 0">Upload a government-issued ID to get a verified badge. Admin will review your submission.</p>' + Components.imageUpload('verify-id-input', 'verify-id-preview') + '<button class="btn btn-primary" onclick="App.submitVerification()">' + Components.icon('upload', 14) + ' Submit for Verification</button></div>';
    } else if (isSelf && viewingUser.verificationPending) {
        verifySection = '<div class="glass-card" style="margin:var(--space-lg) 0;border-color:var(--accent-orange)"><div style="display:flex;align-items:center;gap:8px">' + Components.icon('clock', 16) + ' <span style="color:var(--accent-orange);font-weight:600">Verification Pending</span></div><p style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">Your ID is being reviewed by an admin.</p></div>';
    }

    return '<div class="' + (isSelf ? 'dashboard-layout' : '') + '">' +
        (isSelf ? Pages._dashboardSidebar('profile') : '') +
        '<div class="' + (isSelf ? 'dashboard-content' : 'page-section') + '">' +
        '<div class="profile-header animate-in">' + Components.avatar(viewingUser, 'avatar-xl') +
        '<div class="profile-info">' +
        '<h2 style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + viewingUser.name + ' ' + Components.verifiedBadge(viewingUser) + ' ' + (!viewingUser.active ? '<span class="badge badge-declined">Deactivated</span>' : '') + ' ' + Components.hostBadge(viewingUser.id) + '</h2>' +
        '<div class="profile-location">' + Components.icon('map-pin', 14) + ' ' + viewingUser.location + ' · Joined ' + joined + '</div>' +
        (viewingUser.bio ? '<div style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px">' + viewingUser.bio + '</div>' : '') +
        '<div style="margin-top:var(--space-sm)">' + Components.stars(rating, reviews.length) + '</div>' +
        '<div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">' + Components.icon('clock', 12) + ' ' + viewingUser.responseTime + ' · ' + viewingUser.responseRate + '% response rate</div>' +
        '<div class="profile-stats">' +
        '<div class="profile-stat"><div class="profile-stat-value">' + tools.length + '</div><div class="profile-stat-label">Tools</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + tripCount + '</div><div class="profile-stat-label">Trips</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (rating > 0 ? rating : '\u2014') + '</div><div class="profile-stat-label">Rating</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + reviews.length + '</div><div class="profile-stat-label">Reviews</div></div>' +
        '</div></div>' +
        (isSelf ? '<button class="btn btn-secondary" style="margin-left:auto;align-self:flex-start" onclick="App.showEditProfile()">' + Components.icon('edit', 14) + ' Edit Profile</button>' : '') +
        '</div>' +
        verifySection +
        (tools.length > 0 ? '<h3 style="margin-bottom:var(--space-md)" class="animate-in animate-in-delay-1">' + (isSelf ? 'Your' : viewingUser.name.split(' ')[0] + "'s") + ' Tools</h3><div class="grid-3 animate-in animate-in-delay-2">' + tools.map(function (t) { return Components.toolCard(t); }).join('') + '</div>' : '') +
        (reviews.length > 0 ? '<h3 style="margin:var(--space-xl) 0 var(--space-md)" class="animate-in">Reviews</h3><div class="card animate-in">' + reviews.map(function (r) { return Components.reviewCard(r); }).join('') + '</div>' : '') +
        '</div></div>' + (!isSelf ? Components.footer() : '');
};

// ==================== ADMIN ====================
Pages.admin = function () {
    if (!Store.isAdmin()) return '<div class="page-section">' + Components.emptyState('shield', 'Access Denied', 'Admin access required.') + '</div>';
    var stats = Store.getPlatformStats();
    var users = Store.getUsers().filter(function (u) { return u.role !== 'admin'; });
    var tools = Store.getAllTools();
    var bookings = Store.getBookings();
    var posts = Store.getAllForumPosts();

    return '<div class="dashboard-layout">' + Pages._dashboardSidebar('admin') +
        '<div class="dashboard-content">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('shield', 24) + ' Admin Dashboard</h1><p class="page-subtitle">Platform overview and moderation</p></div>' +
        '<div class="grid-4 animate-in animate-in-delay-1">' +
        '<div class="stat-card"><div class="stat-value">' + stats.totalUsers + '</div><div class="stat-label">' + Components.icon('users', 14) + ' Total Users</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.totalTools + '</div><div class="stat-label">' + Components.icon('wrench', 14) + ' Total Tools</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.totalBookings + '</div><div class="stat-label">' + Components.icon('calendar', 14) + ' Total Bookings</div></div>' +
        '<div class="stat-card"><div class="stat-value">$' + stats.platformRevenue + '</div><div class="stat-label">' + Components.icon('dollar-sign', 14) + ' Revenue</div></div></div>' +
        '<div class="grid-4 animate-in animate-in-delay-1" style="margin-top:var(--space-sm)">' +
        '<div class="stat-card" style="border-color:var(--accent-red)"><div class="stat-value" style="color:var(--accent-red)">' + stats.bannedUsers + '</div><div class="stat-label">' + Components.icon('user-x', 14) + ' Banned</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.pendingBookings + '</div><div class="stat-label">' + Components.icon('clock', 14) + ' Pending</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.forumPosts + '</div><div class="stat-label">' + Components.icon('message-circle', 14) + ' Posts</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.verifiedUsers + '</div><div class="stat-label">' + Components.icon('badge-check', 14) + ' Verified</div></div></div>' +
        (stats.pendingVerifications > 0 ? '<div class="glass-card animate-in" style="margin-top:var(--space-md);border-color:var(--accent-orange)"><span style="color:var(--accent-orange);font-weight:600">' + Components.icon('alert-circle', 16) + ' ' + stats.pendingVerifications + ' pending verification request(s)</span></div>' : '') +
        '<div class="tabs animate-in animate-in-delay-2" id="admin-tabs" style="margin-top:var(--space-xl)">' +
        '<button class="tab active" onclick="App.switchAdminTab(\'users\')">' + Components.icon('users', 14) + ' Users (' + users.length + ')</button>' +
        '<button class="tab" onclick="App.switchAdminTab(\'tools\')">' + Components.icon('wrench', 14) + ' Tools (' + tools.length + ')</button>' +
        '<button class="tab" onclick="App.switchAdminTab(\'forum\')">' + Components.icon('message-circle', 14) + ' Forum (' + posts.length + ')</button>' +
        '<button class="tab" onclick="App.switchAdminTab(\'bookings\')">' + Components.icon('calendar', 14) + ' Bookings (' + bookings.length + ')</button></div>' +
        '<div id="admin-tab-content" class="animate-in animate-in-delay-3">' + Pages._adminUsersTab(users) + '</div></div></div>';
};

Pages._adminUsersTab = function (users) {
    var rows = users.map(function (u) {
        var banInfo = u.banned ? '<div style="font-size:0.7rem;color:var(--accent-red)">Banned: ' + (u.banReason || '') + '</div>' : '';
        var verifyCell = u.verified ? '<span style="color:var(--accent-green)">' + Components.icon('badge-check', 16) + '</span>' : (u.verificationPending ? '<button class="btn btn-sm btn-success" onclick="App.approveVerification(\'' + u.id + '\')">' + Components.icon('check', 12) + ' Approve</button> <button class="btn btn-sm btn-ghost" onclick="App.viewIdDocument(\'' + u.id + '\')">View ID</button>' : '<span style="color:var(--text-muted)">—</span>');
        var statusCell = u.banned ? Components.badge('Banned', 'declined') : u.active ? Components.badge('Active', 'available') : Components.badge('Inactive', 'pending');
        var actions = '';
        if (u.banned) {
            actions = '<button class="btn btn-sm btn-success" onclick="App.adminUnban(\'' + u.id + '\')">' + Components.icon('unlock', 12) + ' Unban</button>';
        } else {
            actions = '<button class="btn btn-sm btn-danger" onclick="App.showBanModal(\'' + u.id + '\')">' + Components.icon('ban', 12) + ' Ban</button>';
            if (u.active) {
                actions += ' <button class="btn btn-sm btn-secondary" onclick="App.adminDeactivateUser(\'' + u.id + '\')">' + Components.icon('user-minus', 12) + '</button>';
            } else {
                actions += ' <button class="btn btn-sm btn-ghost" onclick="App.adminActivateUser(\'' + u.id + '\')">' + Components.icon('user-plus', 12) + '</button>';
            }
        }
        actions += ' <button class="btn btn-sm btn-ghost" onclick="App.makeAdmin(\'' + u.id + '\')" title="Make Admin">' + Components.icon('shield', 12) + '</button>';
        return '<tr><td><div style="display:flex;align-items:center;gap:8px">' + Components.avatar(u) + ' <div>' + u.name + banInfo + '</div></div></td>' +
            '<td><span style="font-size:0.8rem;text-transform:capitalize">' + (u.accountType || 'renter') + '</span></td>' +
            '<td style="color:var(--text-secondary);font-size:0.85rem">' + u.email + '</td>' +
            '<td style="color:var(--text-secondary);font-size:0.85rem">' + u.location + '</td>' +
            '<td>' + Components.stars(Store.getUserRating(u.id)) + '</td>' +
            '<td>' + verifyCell + '</td>' +
            '<td>' + statusCell + '</td>' +
            '<td style="white-space:nowrap">' + actions + '</td></tr>';
    }).join('');
    return '<div class="card"><div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>User</th><th>Type</th><th>Email</th><th>Location</th><th>Rating</th><th>Verified</th><th>Status</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
};

Pages._adminToolsTab = function (tools) {
    var toolRows = tools.map(function (t) {
        var owner = Store.getUser(t.ownerId);
        var imgTag = '<img src="' + t.image + '" alt="" style="width:40px;height:40px;border-radius:6px;object-fit:cover" onerror="this.src=\'https://placehold.co/40x40/1a1a2e/00f0ff?text=T\'">';
        return '<tr>' +
            '<td><div style="display:flex;align-items:center;gap:8px">' + imgTag + ' <a href="#/tool/' + t.id + '" style="color:var(--text-primary)">' + t.name + '</a></div></td>' +
            '<td style="font-size:0.85rem">' + (owner ? owner.name : 'Unknown') + '</td>' +
            '<td style="font-size:0.85rem">' + t.category + '</td>' +
            '<td>$' + t.pricePerDay + '/day</td>' +
            '<td>' + Components.statusBadge(t.status) + '</td>' +
            '<td>' + Components.stars(Store.getToolRating(t.id)) + '</td>' +
            '<td>' + t.tripCount + '</td>' +
            '<td style="white-space:nowrap"><button class="btn btn-sm btn-secondary" onclick="App.showEditToolModal(\'' + t.id + '\')">' + Components.icon('edit', 12) + '</button> <button class="btn btn-sm btn-danger" onclick="App.confirmDeleteTool(\'' + t.id + '\')">' + Components.icon('trash-2', 12) + '</button></td></tr>';
    }).join('');
    return '<div class="card"><div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Tool</th><th>Owner</th><th>Category</th><th>Price</th><th>Status</th><th>Rating</th><th>Rentals</th><th>Actions</th></tr></thead><tbody>' + toolRows + '</tbody></table></div></div>';
};

Pages._adminForumTab = function (posts) {
    if (posts.length === 0) return Components.emptyState('message-circle', 'No forum posts', 'The forum is empty.');
    var cards = posts.map(function (p) {
        var author = Store.getUser(p.authorId);
        var date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        var repliesHtml = '';
        if (p.replies && p.replies.length > 0) {
            var replyItems = p.replies.map(function (r) {
                var ra = Store.getUser(r.authorId);
                return '<div style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:0.8rem"><span style="color:var(--text-secondary)">' + (ra ? ra.name : 'Unknown') + ':</span><span style="color:var(--text-muted);flex:1">' + r.body.substring(0, 80) + (r.body.length > 80 ? '...' : '') + '</span><button class="btn btn-sm btn-ghost" style="font-size:0.7rem;padding:2px 6px;color:var(--accent-red)" onclick="App.adminDeleteReply(\'' + p.id + '\',\'' + r.id + '\')">' + Components.icon('x', 10) + '</button></div>';
            }).join('');
            repliesHtml = '<div style="margin-top:var(--space-sm);padding-top:var(--space-sm);border-top:1px solid var(--border-color)"><span style="font-size:0.8rem;color:var(--text-muted)">' + p.replies.length + ' replies</span>' + replyItems + '</div>';
        }
        return '<div class="card"><div class="card-body">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">' +
            '<div style="display:flex;align-items:center;gap:var(--space-sm)">' + Components.avatar(author) + '<div><div style="font-weight:600;font-size:0.9rem">' + (author ? author.name : 'Unknown') + '</div><div style="font-size:0.75rem;color:var(--text-muted)">' + date + ' · ' + p.category + '</div></div></div>' +
            '<div style="display:flex;gap:6px"><button class="btn btn-sm btn-secondary" onclick="App.adminEditPost(\'' + p.id + '\')">' + Components.icon('edit', 12) + '</button><button class="btn btn-sm btn-danger" onclick="App.adminDeletePost(\'' + p.id + '\')">' + Components.icon('trash-2', 12) + '</button></div></div>' +
            '<h4 style="margin-bottom:4px">' + p.title + '</h4>' +
            '<p style="color:var(--text-secondary);font-size:0.85rem">' + p.body.substring(0, 150) + (p.body.length > 150 ? '...' : '') + '</p>' +
            repliesHtml + '</div></div>';
    }).join('');
    return '<div style="display:flex;flex-direction:column;gap:var(--space-md)">' + cards + '</div>';
};

Pages._adminBookingsTab = function (bookings) {
    if (bookings.length === 0) return Components.emptyState('calendar', 'No bookings yet', 'No bookings have been made on the platform.');
    var bRows = bookings.map(function (b) {
        var tool = Store.getTool(b.toolId);
        var renter = Store.getUser(b.renterId);
        var owner = Store.getUser(b.ownerId);
        var statusBadge = Components.badge(b.status, b.status === 'active' ? 'available' : b.status === 'pending' ? 'pending' : b.status === 'returned' ? 'available' : 'declined');
        var actionCell = (b.status === 'pending' || b.status === 'active') ? '<button class="btn btn-sm btn-danger" onclick="App.adminCancelBooking(\'' + b.id + '\')">' + Components.icon('x', 12) + ' Cancel</button>' : '\u2014';
        return '<tr>' +
            '<td style="font-size:0.8rem;color:var(--text-muted)">' + b.id.substring(0, 8) + '</td>' +
            '<td style="font-size:0.85rem">' + (tool ? tool.name : 'Deleted') + '</td>' +
            '<td style="font-size:0.85rem">' + (renter ? renter.name : 'Unknown') + '</td>' +
            '<td style="font-size:0.85rem">' + (owner ? owner.name : 'Unknown') + '</td>' +
            '<td style="font-size:0.8rem;color:var(--text-secondary)">' + b.startDate + ' → ' + b.endDate + '</td>' +
            '<td>$' + b.totalPrice + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td>' + actionCell + '</td></tr>';
    }).join('');
    return '<div class="card"><div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Booking</th><th>Tool</th><th>Renter</th><th>Owner</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>' + bRows + '</tbody></table></div></div>';
};

// ==================== FORUM ====================
Pages.forum = function () {
    var posts = Store.getForumPosts();
    var user = Store.currentUser();
    var categories = ['All', 'Tips & Tricks', 'Tool Recommendations', 'Project Ideas'];
    var filterChips = categories.map(function (c) {
        return '<button class="filter-chip ' + (c === 'All' ? 'active' : '') + '" onclick="App.filterForum(\'' + c + '\')">' + c + '</button>';
    }).join('');
    var postCards = posts.map(function (p) { return Pages._forumPostCard(p); }).join('');
    return '<div class="page-section">' +
        '<div class="page-header animate-in" style="display:flex;align-items:center;justify-content:space-between"><div><h1 class="page-title">' + Components.icon('message-circle', 24) + ' Community Forum</h1><p class="page-subtitle">Share tips, ask questions, and connect with neighbors</p></div>' + (user ? '<button class="btn btn-primary" onclick="App.showNewPostModal()">' + Components.icon('plus', 14) + ' New Post</button>' : '') + '</div>' +
        '<div class="filters-bar animate-in animate-in-delay-1">' + filterChips + '</div>' +
        '<div id="forum-posts" class="animate-in animate-in-delay-2">' + (postCards || Components.emptyState('message-circle', 'No posts yet', 'Be the first to start a discussion!')) + '</div>' +
        '</div>' + Components.footer();
};

Pages._forumPostCard = function (post) {
    var author = Store.getUser(post.authorId);
    var date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return '<div class="card" style="margin-bottom:var(--space-md);cursor:pointer" onclick="App.showForumPost(\'' + post.id + '\')">' +
        '<div class="card-body">' +
        '<div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)"><span class="badge badge-pending">' + post.category + '</span><span style="color:var(--text-muted);font-size:0.8rem">' + date + '</span></div>' +
        '<h3 style="font-size:1.05rem;margin-bottom:var(--space-sm)">' + post.title + '</h3>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + post.body + '</p>' +
        '<div style="display:flex;align-items:center;gap:var(--space-md);margin-top:var(--space-md)"><div style="display:flex;align-items:center;gap:6px">' + Components.avatar(author) + ' <span style="font-size:0.85rem">' + (author ? author.name : 'Unknown') + '</span></div><span style="color:var(--text-muted);font-size:0.85rem;margin-left:auto">' + Components.icon('message-circle', 14) + ' ' + post.replies.length + ' replies</span></div>' +
        '</div></div>';
};
