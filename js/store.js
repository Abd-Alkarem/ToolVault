/* ============================================
   TOOLVAULT – DATA STORE (localStorage)
   ============================================ */
const Store = {
    KEYS: { USERS: 'tv_users', TOOLS: 'tv_tools', BOOKINGS: 'tv_bookings', REVIEWS: 'tv_reviews', FORUM: 'tv_forum', SESSION: 'tv_session', NOTIFICATIONS: 'tv_notifications', GEO: 'tv_geo' },

    get(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); },

    // ---- Session ----
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return null;
        // Banned users cannot login
        if (user.banned) return { error: 'banned', message: 'Your account has been suspended. Reason: ' + (user.banReason || 'Violation of community guidelines') };
        // Deactivated users cannot login
        if (!user.active) return { error: 'deactivated', message: 'Your account has been deactivated. Please contact support.' };
        this.set(this.KEYS.SESSION, { userId: user.id, loginAt: Date.now() });
        return user;
    },
    logout() { localStorage.removeItem(this.KEYS.SESSION); },
    currentUser() {
        const s = this.get(this.KEYS.SESSION);
        if (!s) return null;
        return this.getUsers().find(u => u.id === s.userId) || null;
    },
    isAdmin() { const u = this.currentUser(); return u && u.role === 'admin'; },
    isLoggedIn() { return !!this.currentUser(); },
    isHost() { const u = this.currentUser(); return u && (u.accountType === 'host' || u.accountType === 'both' || u.role === 'admin'); },

    // ---- Geolocation ----
    setGeo(lat, lng) { this.set(this.KEYS.GEO, { lat, lng }); },
    getGeo() { return this.get(this.KEYS.GEO); },

    // ---- Users ----
    getUsers() { return this.get(this.KEYS.USERS) || []; },
    getActiveUsers() { return this.getUsers().filter(u => u.active && !u.banned); },
    getUser(id) { return this.getUsers().find(u => u.id === id); },
    addUser(u) {
        const users = this.getUsers();
        u.id = this.genId(); u.joinedAt = Date.now(); u.active = true; u.role = 'user';
        u.rating = 0; u.reviewCount = 0; u.verified = false; u.phone = u.phone || '';
        u.bio = u.bio || ''; u.tripCount = 0; u.responseRate = 100; u.responseTime = 'Within an hour';
        u.verificationPending = false; u.idDocument = null;
        u.lat = u.lat || null; u.lng = u.lng || null;
        if (!u.accountType) u.accountType = 'renter';
        users.push(u);
        this.set(this.KEYS.USERS, users);
        return u;
    },
    updateUser(id, data) {
        const users = this.getUsers();
        const i = users.findIndex(u => u.id === id);
        if (i > -1) { users[i] = { ...users[i], ...data }; this.set(this.KEYS.USERS, users); }
        return users[i];
    },

    // ---- Computed User Stats ----
    getUserRating(userId) {
        const reviews = this.getReviewsForUser(userId);
        if (reviews.length === 0) return 0;
        return Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10;
    },
    getUserEarnings(userId) {
        return this.getBookingsByOwner(userId).filter(b => b.status === 'returned' || b.status === 'active').reduce((s, b) => s + (b.totalPrice || 0), 0);
    },
    getUserSpent(userId) {
        return this.getBookingsByRenter(userId).filter(b => b.status !== 'cancelled' && b.status !== 'declined').reduce((s, b) => s + (b.totalPrice || 0), 0);
    },
    getUserTripCount(userId) {
        return this.getBookingsByRenter(userId).filter(b => b.status === 'returned' || b.status === 'active').length + this.getBookingsByOwner(userId).filter(b => b.status === 'returned' || b.status === 'active').length;
    },

    // ---- Tools ----
    getTools() {
        var tools = this.get(this.KEYS.TOOLS) || [];
        // Hide tools from deactivated / banned users
        return tools.filter(function (t) {
            var owner = (Store.get(Store.KEYS.USERS) || []).find(function (u) { return u.id === t.ownerId; });
            return owner && owner.active && !owner.banned;
        });
    },
    getAllTools() { return this.get(this.KEYS.TOOLS) || []; },
    getTool(id) { return (this.get(this.KEYS.TOOLS) || []).find(t => t.id === id); },
    getToolsByUser(userId) { return (this.get(this.KEYS.TOOLS) || []).filter(t => t.ownerId === userId); },
    addTool(t) {
        const tools = this.get(this.KEYS.TOOLS) || [];
        t.id = this.genId(); t.createdAt = Date.now(); t.rating = 0; t.reviewCount = 0;
        t.tripCount = 0; t.status = 'available';
        t.deliveryAvailable = t.deliveryAvailable || false;
        t.deliveryFee = t.deliveryFee || 0; t.depositAmount = t.depositAmount || 0;
        t.guidelines = t.guidelines || '';
        t.discount5 = t.discount5 || 0; // % discount for 5+ day rentals
        t.discount20 = t.discount20 || 0; // % discount for 20+ day rentals
        t.lat = t.lat || null; t.lng = t.lng || null;
        tools.push(t);
        this.set(this.KEYS.TOOLS, tools);
        // Also update user to host if not already
        const user = this.currentUser();
        if (user && user.accountType === 'renter') {
            this.updateUser(user.id, { accountType: 'both' });
        }
        return t;
    },
    updateTool(id, data) {
        const tools = this.get(this.KEYS.TOOLS) || [];
        const i = tools.findIndex(t => t.id === id);
        if (i > -1) { tools[i] = { ...tools[i], ...data }; this.set(this.KEYS.TOOLS, tools); }
        return tools[i];
    },
    deleteTool(id) { this.set(this.KEYS.TOOLS, (this.get(this.KEYS.TOOLS) || []).filter(t => t.id !== id)); },

    // Compute tool rating from real reviews
    getToolRating(toolId) {
        const reviews = this.getReviewsForTool(toolId);
        if (reviews.length === 0) return 0;
        return Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10;
    },

    // Calculate price with discounts
    calculatePrice(tool, days) {
        var base = tool.pricePerDay * days;
        var discount = 0;
        if (days >= 20 && tool.discount20) { discount = tool.discount20; }
        else if (days >= 5 && tool.discount5) { discount = tool.discount5; }
        var discounted = base * (1 - discount / 100);
        return { base: base, discount: discount, total: Math.round(discounted * 100) / 100 };
    },

    // ---- Bookings ----
    getBookings() { return this.get(this.KEYS.BOOKINGS) || []; },
    getBooking(id) { return this.getBookings().find(b => b.id === id); },
    getBookingsByRenter(userId) { return this.getBookings().filter(b => b.renterId === userId); },
    getBookingsByOwner(userId) { return this.getBookings().filter(b => b.ownerId === userId); },
    addBooking(b) {
        const bookings = this.getBookings();
        b.id = this.genId(); b.createdAt = Date.now(); b.status = 'pending';
        b.protectionPlan = b.protectionPlan || 'standard';
        b.deliveryRequested = b.deliveryRequested || false;
        b.paymentMethod = b.paymentMethod || 'card';
        b.paymentStatus = 'paid';
        b.reviewed = false; b.hostReviewed = false;
        bookings.push(b);
        this.set(this.KEYS.BOOKINGS, bookings);
        // Notify owner
        const tool = this.getTool(b.toolId);
        this.addNotification(b.ownerId, 'New booking request for ' + (tool ? tool.name : 'your tool') + '!', 'booking', b.id);
        return b;
    },
    updateBooking(id, data) {
        const bookings = this.getBookings();
        const i = bookings.findIndex(b => b.id === id);
        if (i > -1) { bookings[i] = { ...bookings[i], ...data }; this.set(this.KEYS.BOOKINGS, bookings); }
        return bookings[i];
    },
    approveBooking(id) {
        var b = this.updateBooking(id, { status: 'active' });
        if (b) {
            // Auto-mark tool as rented
            this.updateTool(b.toolId, { status: 'rented' });
            this.addNotification(b.renterId, 'Your booking has been approved!', 'booking', id);
        }
        return b;
    },
    declineBooking(id) {
        var b = this.updateBooking(id, { status: 'declined' });
        if (b) { this.addNotification(b.renterId, 'Your booking has been declined.', 'booking', id); }
        return b;
    },
    returnBooking(id) {
        var b = this.updateBooking(id, { status: 'returned' });
        if (b) {
            // Auto-mark tool as available
            this.updateTool(b.toolId, { status: 'available' });
            // Update trip counts
            var tool = this.getTool(b.toolId);
            if (tool) this.updateTool(b.toolId, { tripCount: (tool.tripCount || 0) + 1 });
            this.addNotification(b.ownerId, 'Tool has been returned!', 'booking', id);
            this.addNotification(b.renterId, 'Return confirmed. Please leave a review!', 'booking', id);
        }
        return b;
    },
    cancelBooking(id) {
        var b = this.getBooking(id);
        if (b && (b.status === 'active' || b.status === 'approved')) {
            this.updateTool(b.toolId, { status: 'available' });
        }
        return this.updateBooking(id, { status: 'cancelled' });
    },

    // ---- Reviews ----
    getReviews() { return this.get(this.KEYS.REVIEWS) || []; },
    getReviewsForTool(toolId) { return this.getReviews().filter(r => r.toolId === toolId); },
    getReviewsForUser(userId) { return this.getReviews().filter(r => r.revieweeId === userId); },
    addReview(r) {
        const reviews = this.getReviews();
        r.id = this.genId(); r.createdAt = Date.now();
        reviews.push(r);
        this.set(this.KEYS.REVIEWS, reviews);
        this._updateRatings(r);
        return r;
    },
    _updateRatings(r) {
        if (r.toolId) {
            const toolReviews = this.getReviewsForTool(r.toolId);
            const avg = toolReviews.reduce((s, rv) => s + rv.rating, 0) / toolReviews.length;
            this.updateTool(r.toolId, { rating: Math.round(avg * 10) / 10, reviewCount: toolReviews.length });
        }
        if (r.revieweeId) {
            const userReviews = this.getReviewsForUser(r.revieweeId);
            const avg = userReviews.reduce((s, rv) => s + rv.rating, 0) / userReviews.length;
            this.updateUser(r.revieweeId, { rating: Math.round(avg * 10) / 10, reviewCount: userReviews.length });
        }
    },

    // Check if a booking has been reviewed by a specific user
    hasReviewed(bookingId, reviewerId) {
        return this.getReviews().some(r => r.bookingId === bookingId && r.reviewerId === reviewerId);
    },

    // ---- Notifications ----
    getNotifications(userId) { return (this.get(this.KEYS.NOTIFICATIONS) || []).filter(n => n.userId === userId); },
    getUnreadCount(userId) { return this.getNotifications(userId).filter(n => !n.read).length; },
    addNotification(userId, message, type, refId) {
        const notifs = this.get(this.KEYS.NOTIFICATIONS) || [];
        notifs.unshift({ id: this.genId(), userId, message, type, refId, read: false, createdAt: Date.now() });
        this.set(this.KEYS.NOTIFICATIONS, notifs);
    },
    markNotificationsRead(userId) {
        const notifs = this.get(this.KEYS.NOTIFICATIONS) || [];
        notifs.forEach(n => { if (n.userId === userId) n.read = true; });
        this.set(this.KEYS.NOTIFICATIONS, notifs);
    },

    // ---- Forum ----
    getForumPosts() {
        var posts = this.get(this.KEYS.FORUM) || [];
        // Hide posts from deactivated/banned users
        return posts.filter(function (p) {
            var author = (Store.get(Store.KEYS.USERS) || []).find(function (u) { return u.id === p.authorId; });
            return author && author.active && !author.banned;
        });
    },
    getAllForumPosts() { return this.get(this.KEYS.FORUM) || []; },
    addForumPost(p) { const posts = this.get(this.KEYS.FORUM) || []; p.id = this.genId(); p.createdAt = Date.now(); p.replies = []; posts.unshift(p); this.set(this.KEYS.FORUM, posts); return p; },
    addReply(postId, reply) {
        const posts = this.get(this.KEYS.FORUM) || [];
        const p = posts.find(x => x.id === postId);
        if (p) { reply.id = this.genId(); reply.createdAt = Date.now(); p.replies.push(reply); this.set(this.KEYS.FORUM, posts); }
    },
    deleteForumPost(postId) {
        this.set(this.KEYS.FORUM, (this.get(this.KEYS.FORUM) || []).filter(p => p.id !== postId));
    },
    deleteReply(postId, replyId) {
        const posts = this.get(this.KEYS.FORUM) || [];
        const p = posts.find(x => x.id === postId);
        if (p) { p.replies = p.replies.filter(r => r.id !== replyId); this.set(this.KEYS.FORUM, posts); }
    },
    updateForumPost(postId, data) {
        const posts = this.get(this.KEYS.FORUM) || [];
        const p = posts.find(x => x.id === postId);
        if (p) { Object.assign(p, data); this.set(this.KEYS.FORUM, posts); }
    },

    // ---- Ban/Unban ----
    banUser(userId, reason) {
        this.updateUser(userId, { active: false, banned: true, banReason: reason || 'Violation of community guidelines', bannedAt: Date.now() });
        this.addNotification(userId, 'Your account has been suspended. Reason: ' + (reason || 'Violation of community guidelines'), 'system', null);
    },
    unbanUser(userId) {
        this.updateUser(userId, { active: true, banned: false, banReason: '', bannedAt: null });
        this.addNotification(userId, 'Your account has been reactivated.', 'system', null);
    },
    // ---- Deactivate / Activate ----
    deactivateUser(userId) {
        this.updateUser(userId, { active: false });
        // Log them out if they are current user
        var s = this.get(this.KEYS.SESSION);
        if (s && s.userId === userId) this.logout();
    },
    activateUser(userId) {
        this.updateUser(userId, { active: true });
    },

    // ---- Admin Role ----
    makeAdmin(userId) {
        this.updateUser(userId, { role: 'admin' });
        this.addNotification(userId, 'You have been granted administrator privileges!', 'system', null);
    },

    // ---- Verification ----
    submitVerification(userId, idDocumentData) {
        this.updateUser(userId, { verificationPending: true, idDocument: idDocumentData });
        // Notify all admins
        var admins = this.getUsers().filter(function (u) { return u.role === 'admin'; });
        admins.forEach(function (a) {
            Store.addNotification(a.id, 'New verification request pending.', 'system', null);
        });
    },
    approveVerification(userId) {
        this.updateUser(userId, { verified: true, verificationPending: false });
        this.addNotification(userId, 'Your identity has been verified! ✓', 'system', null);
    },
    rejectVerification(userId) {
        this.updateUser(userId, { verificationPending: false, idDocument: null });
        this.addNotification(userId, 'Your verification request was not approved. Please try again with a clearer document.', 'system', null);
    },

    // ---- Host Badge ----
    getHostBadge(userId) {
        const user = this.getUser(userId);
        if (!user) return null;
        const tools = this.getToolsByUser(userId);
        const bookings = this.getBookingsByOwner(userId).filter(b => b.status === 'returned');
        if (bookings.length >= 20 && user.rating >= 4.8 && user.responseRate >= 90) return { level: 'power', label: 'Power Host', color: '#f59e0b' };
        if (bookings.length >= 5 && user.rating >= 4.5) return { level: 'allstar', label: 'All-Star Host', color: '#8b5cf6' };
        if (tools.length >= 1) return { level: 'host', label: 'Host', color: '#00f0ff' };
        return null;
    },

    // ---- Platform Stats (real) ----
    getPlatformStats() {
        var users = this.getUsers().filter(function (u) { return u.role !== 'admin'; });
        var tools = this.get(this.KEYS.TOOLS) || [];
        var bookings = this.getBookings();
        var reviews = this.getReviews();
        var revenue = bookings.filter(function (b) { return b.status === 'returned' || b.status === 'active'; }).reduce(function (s, b) { return s + (b.totalPrice || 0); }, 0);
        var activeRentals = bookings.filter(function (b) { return b.status === 'active'; }).length;
        return {
            totalUsers: users.length,
            totalTools: tools.length,
            totalBookings: bookings.length,
            platformRevenue: revenue,
            bannedUsers: users.filter(function (u) { return u.banned; }).length,
            pendingBookings: bookings.filter(function (b) { return b.status === 'pending'; }).length,
            forumPosts: (this.get(this.KEYS.FORUM) || []).length,
            verifiedUsers: users.filter(function (u) { return u.verified; }).length,
            pendingVerifications: users.filter(function (u) { return u.verificationPending; }).length,
            totalReviews: reviews.length,
            activeRentals: activeRentals
        };
    },

    // ---- Seed Data ----
    seed() {
        if (this.get('tv_seeded_v5')) return;
        // Clear old data
        Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
        localStorage.removeItem('tv_seeded');
        localStorage.removeItem('tv_seeded_v2');
        localStorage.removeItem('tv_seeded_v3');
        localStorage.removeItem('tv_seeded_v4');

        const toolImages = [
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400&h=300&fit=crop'
        ];

        const users = [
            { id: 'admin1', name: 'Steven Bulgin', email: 'admin@toolvault.com', password: 'admin123', role: 'admin', accountType: 'both', location: 'Ottawa, ON', avatar: '', joinedAt: Date.now() - 86400000 * 90, active: true, rating: 4.9, reviewCount: 2, verified: true, phone: '613-555-0100', bio: 'Platform administrator & avid DIYer.', tripCount: 2, responseRate: 100, responseTime: 'Within minutes', lat: 45.4215, lng: -75.6972 },
            { id: 'user1', name: 'Mike Henderson', email: 'mike@email.com', password: 'pass123', role: 'user', accountType: 'host', location: 'Ottawa, ON', avatar: '', joinedAt: Date.now() - 86400000 * 60, active: true, rating: 4.8, reviewCount: 5, verified: true, phone: '613-555-0101', bio: 'Contractor with 10+ years experience. I keep all my tools in top shape!', tripCount: 6, responseRate: 98, responseTime: 'Within an hour', lat: 45.4112, lng: -75.6981 },
            { id: 'user2', name: 'Sarah Chen', email: 'sarah@email.com', password: 'pass123', role: 'user', accountType: 'host', location: 'Kanata, ON', avatar: '', joinedAt: Date.now() - 86400000 * 45, active: true, rating: 4.6, reviewCount: 2, verified: false, phone: '613-555-0102', bio: 'Landscaping enthusiast. Happy to share my tool collection with the community!', tripCount: 3, responseRate: 100, responseTime: 'Within minutes', lat: 45.3088, lng: -75.8983 },
            { id: 'user3', name: 'James Wilson', email: 'james@email.com', password: 'pass123', role: 'user', accountType: 'both', location: 'Barrhaven, ON', avatar: '', joinedAt: Date.now() - 86400000 * 30, active: true, rating: 4.5, reviewCount: 1, verified: false, phone: '613-555-0103', bio: 'Weekend warrior. Love helping neighbors with their projects.', tripCount: 2, responseRate: 92, responseTime: 'Within a few hours', lat: 45.2750, lng: -75.7384 },
            { id: 'user4', name: 'Emily Brooks', email: 'emily@email.com', password: 'pass123', role: 'user', accountType: 'host', location: 'Orleans, ON', avatar: '', joinedAt: Date.now() - 86400000 * 20, active: true, rating: 4.7, reviewCount: 1, verified: false, phone: '613-555-0104', bio: 'Professional painter & home renovator.', tripCount: 1, responseRate: 95, responseTime: 'Within an hour', lat: 45.4766, lng: -75.5169 },
            { id: 'user5', name: 'David Park', email: 'david@email.com', password: 'pass123', role: 'user', accountType: 'renter', location: 'Nepean, ON', avatar: '', joinedAt: Date.now() - 86400000 * 10, active: true, rating: 4.3, reviewCount: 1, verified: false, phone: '', bio: 'Just moved in and doing lots of home projects!', tripCount: 2, responseRate: 80, responseTime: 'Within a day', lat: 45.3526, lng: -75.7277 },
            { id: 'user6', name: 'Lisa Martinez', email: 'lisa@email.com', password: 'pass123', role: 'user', accountType: 'renter', location: 'Gloucester, ON', avatar: '', joinedAt: Date.now() - 86400000 * 5, active: true, rating: 4.9, reviewCount: 1, verified: false, phone: '613-555-0106', bio: 'DIY mom of 3. Always need tools for the next home project!', tripCount: 1, responseRate: 96, responseTime: 'Within an hour', lat: 45.4305, lng: -75.5872 }
        ];

        // Only Mike Henderson's tools
        const tools = [
            { id: 'tool1', ownerId: 'user1', name: 'DeWalt Cordless Drill 20V MAX', description: 'Powerful 20V MAX cordless drill/driver kit. Includes 2 batteries, charger, and carrying case. Perfect for drilling, driving screws, and light-duty projects. Freshly maintained.', category: 'Power Tools', condition: 'New', pricePerDay: 8, image: toolImages[0], status: 'available', createdAt: Date.now() - 86400000 * 50, rating: 4.7, reviewCount: 3, tripCount: 4, deliveryAvailable: true, deliveryFee: 5, depositAmount: 50, guidelines: 'Please return with battery charged. Wipe down after use.', discount5: 10, discount20: 25, lat: 45.4112, lng: -75.6981 },
            { id: 'tool2', ownerId: 'user1', name: 'Milwaukee Circular Saw 7-1/4"', description: 'Milwaukee M18 FUEL 7-1/4" circular saw. Cuts through plywood and 2x4s with ease. Battery and charger included. Comes with extra blade.', category: 'Power Tools', condition: 'Good', pricePerDay: 12, image: toolImages[1], status: 'available', createdAt: Date.now() - 86400000 * 45, rating: 4.5, reviewCount: 2, tripCount: 3, deliveryAvailable: false, depositAmount: 75, guidelines: 'Safety glasses required. Handle with care.', discount5: 15, discount20: 30, lat: 45.4112, lng: -75.6981 },
            { id: 'tool9', ownerId: 'user1', name: 'Ryobi Paint Sprayer Kit', description: 'Ryobi ONE+ 18V cordless paint sprayer. Perfect for decks, fences, and furniture. Includes 2 nozzles, cleaning kit, and battery.', category: 'Painting', condition: 'Good', pricePerDay: 12, image: toolImages[2], status: 'available', createdAt: Date.now() - 86400000 * 8, rating: 5.0, reviewCount: 1, tripCount: 1, deliveryAvailable: false, depositAmount: 45, guidelines: 'Clean thoroughly after use with warm water.', discount5: 10, discount20: 20, lat: 45.4112, lng: -75.6981 }
        ];

        // Seed completed bookings
        const bookings = [
            { id: 'bk1', toolId: 'tool1', renterId: 'user3', ownerId: 'user1', startDate: '2026-03-01', endDate: '2026-03-04', totalPrice: 24, status: 'returned', createdAt: Date.now() - 86400000 * 40, protectionPlan: 'standard', deliveryRequested: false, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: true },
            { id: 'bk2', toolId: 'tool1', renterId: 'user5', ownerId: 'user1', startDate: '2026-03-10', endDate: '2026-03-13', totalPrice: 24, status: 'returned', createdAt: Date.now() - 86400000 * 32, protectionPlan: 'standard', deliveryRequested: true, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: true },
            { id: 'bk3', toolId: 'tool1', renterId: 'user6', ownerId: 'user1', startDate: '2026-03-20', endDate: '2026-03-22', totalPrice: 16, status: 'returned', createdAt: Date.now() - 86400000 * 25, protectionPlan: 'premium', deliveryRequested: false, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: false },
            { id: 'bk4', toolId: 'tool2', renterId: 'user3', ownerId: 'user1', startDate: '2026-03-05', endDate: '2026-03-08', totalPrice: 36, status: 'returned', createdAt: Date.now() - 86400000 * 38, protectionPlan: 'standard', deliveryRequested: false, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: true },
            { id: 'bk5', toolId: 'tool2', renterId: 'user4', ownerId: 'user1', startDate: '2026-03-15', endDate: '2026-03-18', totalPrice: 36, status: 'returned', createdAt: Date.now() - 86400000 * 28, protectionPlan: 'basic', deliveryRequested: false, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: false },
            { id: 'bk6', toolId: 'tool9', renterId: 'user5', ownerId: 'user1', startDate: '2026-04-01', endDate: '2026-04-03', totalPrice: 24, status: 'returned', createdAt: Date.now() - 86400000 * 12, protectionPlan: 'standard', deliveryRequested: false, paymentMethod: 'card', paymentStatus: 'paid', reviewed: true, hostReviewed: true }
        ];

        // Seed reviews (renter reviews tool & owner)
        const reviews = [
            { id: 'rv1', bookingId: 'bk1', toolId: 'tool1', reviewerId: 'user3', revieweeId: 'user1', rating: 5, text: 'Excellent drill! Mike had it fully charged and ready to go. Made my shelf project so much easier. Will rent again!', createdAt: Date.now() - 86400000 * 38 },
            { id: 'rv2', bookingId: 'bk2', toolId: 'tool1', reviewerId: 'user5', revieweeId: 'user1', rating: 4, text: 'Good drill, batteries lasted all day. Delivery was a nice touch. Only minor issue was a slightly worn chuck but still worked perfectly.', createdAt: Date.now() - 86400000 * 30 },
            { id: 'rv3', bookingId: 'bk3', toolId: 'tool1', reviewerId: 'user6', revieweeId: 'user1', rating: 5, text: 'Perfect condition! Mike is super responsive and the drill is top quality. Highly recommend.', createdAt: Date.now() - 86400000 * 23 },
            { id: 'rv4', bookingId: 'bk4', toolId: 'tool2', reviewerId: 'user3', revieweeId: 'user1', rating: 5, text: 'This circular saw is a beast! Cut through everything I needed. Mike even gave me tips on blade angle. Fantastic host.', createdAt: Date.now() - 86400000 * 36 },
            { id: 'rv5', bookingId: 'bk5', toolId: 'tool2', reviewerId: 'user4', revieweeId: 'user1', rating: 4, text: 'Great saw, very powerful. Came with an extra blade which was handy. Quick pickup, no hassle.', createdAt: Date.now() - 86400000 * 26 },
            { id: 'rv6', bookingId: 'bk6', toolId: 'tool9', reviewerId: 'user5', revieweeId: 'user1', rating: 5, text: 'The paint sprayer worked like a charm on my deck! Even coverage and easy cleanup. Mike included extra nozzles.', createdAt: Date.now() - 86400000 * 10 },
            // Owner reviews renters
            { id: 'rv7', bookingId: 'bk1', toolId: 'tool1', reviewerId: 'user1', revieweeId: 'user3', rating: 5, text: 'James returned the drill in perfect condition and on time. Great renter!', createdAt: Date.now() - 86400000 * 37 },
            { id: 'rv8', bookingId: 'bk2', toolId: 'tool1', reviewerId: 'user1', revieweeId: 'user5', rating: 4, text: 'David took good care of the drill. Would rent to him again.', createdAt: Date.now() - 86400000 * 29 },
            { id: 'rv9', bookingId: 'bk4', toolId: 'tool2', reviewerId: 'user1', revieweeId: 'user3', rating: 4, text: 'Returned on time and in good shape. Reliable renter.', createdAt: Date.now() - 86400000 * 35 },
            { id: 'rv10', bookingId: 'bk6', toolId: 'tool9', reviewerId: 'user1', revieweeId: 'user5', rating: 5, text: 'David cleaned the sprayer thoroughly before returning. Excellent!', createdAt: Date.now() - 86400000 * 9 }
        ];

        // Seed a forum post
        const forum = [
            { id: 'fp1', authorId: 'user3', title: 'Best way to drill into concrete?', body: 'Hey everyone! I need to mount a TV bracket on a concrete wall. Any tips on what drill bits to use? Should I rent a hammer drill?', createdAt: Date.now() - 86400000 * 15, replies: [
                { id: 'r1', authorId: 'user1', text: 'Definitely go with a hammer drill and SDS masonry bits. I have one available if you need it!', createdAt: Date.now() - 86400000 * 14 },
                { id: 'r2', authorId: 'user4', text: 'Make sure to use plastic anchors too. And go slow - let the drill do the work.', createdAt: Date.now() - 86400000 * 13 }
            ]}
        ];

        this.set(this.KEYS.USERS, users);
        this.set(this.KEYS.TOOLS, tools);
        this.set(this.KEYS.BOOKINGS, bookings);
        this.set(this.KEYS.REVIEWS, reviews);
        this.set(this.KEYS.FORUM, forum);
        this.set(this.KEYS.NOTIFICATIONS, []);
        this.set('tv_seeded_v5', true);
    }
};

Store.seed();
