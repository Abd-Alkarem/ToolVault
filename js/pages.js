/* ============================================
   TOOLVAULT – PAGE RENDERERS (Part 1)
   Landing, Auth, About, Dashboard, Sidebar
   ============================================ */
const Pages = {

    // ==================== LANDING PAGE ====================
    landing() {
        return `
        <section class="hero">
            <div class="hero-tag">${Components.icon('wrench', 16)} Community-Powered Tool Sharing</div>
            <h1 class="hero-title">Share Tools.<br><span class="gradient-text">Build Community.</span></h1>
            <p class="hero-desc">Why buy tools you'll only use once? ToolVault connects you with neighbors who have exactly what you need – at a fraction of the cost.</p>
            <div class="hero-actions">
                <a href="#/register" class="btn btn-primary btn-lg">Get Started Free</a>
                <a href="#/browse" class="btn btn-secondary btn-lg">Browse Tools</a>
            </div>
            <div class="hero-stats">
                <div><div class="hero-stat-value" data-count="2,847">0</div><div class="hero-stat-label">Tools Listed</div></div>
                <div><div class="hero-stat-value" data-count="1,203">0</div><div class="hero-stat-label">Active Members</div></div>
                <div><div class="hero-stat-value" data-count="$52K">0</div><div class="hero-stat-label">Saved by Community</div></div>
            </div>
        </section>

        <section class="page-section">
            <div class="section-header">
                <div class="section-tag">Why ToolVault</div>
                <h2 class="section-title">Everything You Need, Nothing You Don't</h2>
                <p class="section-subtitle">Stop cluttering your garage with tools you'll use once a year. Share with your community instead.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card animate-in"><div class="feature-icon">${Components.icon('search', 28)}</div><h3>Find Any Tool</h3><p>Search hundreds of tools available in your neighborhood. From power drills to lawn mowers.</p></div>
                <div class="feature-card animate-in animate-in-delay-1"><div class="feature-icon">${Components.icon('calendar-check', 28)}</div><h3>Book Instantly</h3><p>Check availability, pick your dates, and send a booking request. Owners approve in minutes.</p></div>
                <div class="feature-card animate-in animate-in-delay-2"><div class="feature-icon">${Components.icon('star', 28)}</div><h3>Trusted Community</h3><p>Every user is rated. See reviews from real neighbors before you rent or lend.</p></div>
                <div class="feature-card animate-in animate-in-delay-3"><div class="feature-icon">${Components.icon('piggy-bank', 28)}</div><h3>Save Money</h3><p>Rent for a fraction of the purchase price. Earn passive income from tools sitting in your shed.</p></div>
                <div class="feature-card animate-in animate-in-delay-4"><div class="feature-icon">${Components.icon('shield-check', 28)}</div><h3>Protection Plans</h3><p>Choose from Basic, Standard, or Premium protection. Damage coverage with $0 deductible options.</p></div>
                <div class="feature-card animate-in"><div class="feature-icon">${Components.icon('truck', 28)}</div><h3>Delivery Available</h3><p>Many hosts offer delivery right to your door. No truck needed for large tools!</p></div>
            </div>
        </section>

        <section class="page-section">
            <div class="section-header">
                <div class="section-tag">How It Works</div>
                <h2 class="section-title">Three Simple Steps</h2>
            </div>
            <div class="steps-container">
                <div class="step-item animate-in"><div class="step-number">01</div><h3>Create Your Account</h3><p>Sign up as a Host to list tools, or a Renter to browse and book. Or both!</p></div>
                <div class="step-item animate-in animate-in-delay-1"><div class="step-number">02</div><h3>List or Browse</h3><p>Hosts add photos, set prices, and manage availability. Renters search, filter, and book.</p></div>
                <div class="step-item animate-in animate-in-delay-2"><div class="step-number">03</div><h3>Rent & Review</h3><p>Book with secure payment, get protected, complete your project, and leave a review.</p></div>
            </div>
        </section>

        <section class="page-section">
            <div class="section-header">
                <div class="section-tag">Popular Tools</div>
                <h2 class="section-title">Trending in Your Area</h2>
            </div>
            <div class="grid-4">${Store.getTools().slice(0, 4).map(t => Components.toolCard(t)).join('')}</div>
            <div style="text-align:center;margin-top:var(--space-xl)"><a href="#/browse" class="btn btn-secondary btn-lg">View All Tools →</a></div>
        </section>

        <section class="page-section" style="text-align:center">
            <div class="glass-card" style="padding:var(--space-3xl);max-width:800px;margin:0 auto">
                <div class="grid-2" style="gap:var(--space-2xl);text-align:left">
                    <div>
                        <h2 class="section-title" style="font-size:1.6rem">Become a Host</h2>
                        <p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">Turn your idle tools into income. Set your own prices, manage your schedule, earn badges.</p>
                        <a href="#/register?type=host" class="btn btn-primary">Start Hosting</a>
                    </div>
                    <div>
                        <h2 class="section-title" style="font-size:1.6rem">Rent a Tool</h2>
                        <p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">Save money on tools you only need once. Browse by category, book instantly, get protection.</p>
                        <a href="#/register?type=renter" class="btn btn-secondary">Sign Up to Rent</a>
                    </div>
                </div>
            </div>
        </section>
        ${Components.footer()}`;
    },

    // ==================== LOGIN ====================
    login() {
        return `
        <div class="auth-container">
            <div class="auth-card animate-in">
                <h2>Welcome Back</h2>
                <p class="auth-subtitle">Sign in to your ToolVault account</p>
                <form id="login-form" onsubmit="App.handleLogin(event)">
                    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="login-email" placeholder="you@email.com" required></div>
                    <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="login-password" placeholder="••••••••" required></div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Sign In</button>
                </form>
                <div class="auth-divider">or</div>
                <div style="text-align:center;color:var(--text-muted);font-size:0.8rem;margin-bottom:var(--space-md)">
                    <strong>Demo Accounts:</strong><br>
                    Admin: admin@toolvault.com / admin123<br>
                    Host: mike@email.com / pass123<br>
                    Renter: david@email.com / pass123
                </div>
                <div class="auth-footer">Don't have an account? <a href="#/register">Sign up</a></div>
            </div>
        </div>`;
    },

    // ==================== REGISTER (HOST / RENTER) ====================
    register() {
        const hash = window.location.hash;
        const preselect = hash.includes('type=host') ? 'host' : hash.includes('type=renter') ? 'renter' : '';
        return `
        <div class="auth-container">
            <div class="auth-card animate-in" style="max-width:480px">
                <h2>Join ToolVault</h2>
                <p class="auth-subtitle">Choose how you want to participate</p>
                <div style="display:flex;gap:8px;margin-bottom:var(--space-xl)" id="account-type-selector">
                    <button type="button" class="account-type-btn ${preselect === 'renter' || !preselect ? 'active' : ''}" onclick="App.selectAccountType('renter',this)" data-type="renter">
                        <span style="display:block;margin-bottom:4px">${Components.icon('search', 24)}</span>
                        <strong>I want to Rent</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted);display:block">Browse & book tools</span>
                    </button>
                    <button type="button" class="account-type-btn ${preselect === 'host' ? 'active' : ''}" onclick="App.selectAccountType('host',this)" data-type="host">
                        <span style="display:block;margin-bottom:4px">${Components.icon('wrench', 24)}</span>
                        <strong>I want to Host</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted);display:block">List tools & earn</span>
                    </button>
                    <button type="button" class="account-type-btn" onclick="App.selectAccountType('both',this)" data-type="both">
                        <span style="display:block;margin-bottom:4px">${Components.icon('repeat', 24)}</span>
                        <strong>Both</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted);display:block">Rent & host tools</span>
                    </button>
                </div>
                <form id="register-form" onsubmit="App.handleRegister(event)">
                    <input type="hidden" id="reg-account-type" value="${preselect || 'renter'}">
                    <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" id="reg-name" placeholder="John Doe" required></div>
                    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="reg-email" placeholder="you@email.com" required></div>
                    <div class="grid-2">
                        <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="reg-location" placeholder="Ottawa, ON" required></div>
                        <div class="form-group"><label class="form-label">Phone (optional)</label><input type="tel" class="form-input" id="reg-phone" placeholder="613-555-0000"></div>
                    </div>
                    <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="reg-password" placeholder="Min 6 characters" required minlength="6"></div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Create Account</button>
                </form>
                <div class="auth-footer">Already have an account? <a href="#/login">Sign in</a></div>
            </div>
        </div>`;
    },

    // ==================== ABOUT PAGE ====================
    about() {
        return `
        <div class="page-section" style="max-width:800px;margin:0 auto">
            <div class="page-header animate-in" style="text-align:center">
                <div class="section-tag">About Us</div>
                <h1 class="section-title">About ToolVault</h1>
                <p class="section-subtitle">Building community through sharing</p>
            </div>
            <div class="card animate-in animate-in-delay-1"><div class="card-body" style="line-height:1.9;color:var(--text-secondary)">
                <h3 style="color:var(--text-primary);margin-bottom:var(--space-md)">Our Mission</h3>
                <p>ToolVault was born from a simple idea: most tools sit unused 95% of the time. We connect neighbors who have tools with neighbors who need them – creating a sharing economy that saves money, reduces waste, and builds community trust.</p>
                <h3 style="color:var(--text-primary);margin:var(--space-xl) 0 var(--space-md)">How It Works</h3>
                <p><strong>For Hosts:</strong> List your tools with photos, set your daily rate, choose whether to offer delivery, and start earning. You maintain full control over approving bookings and setting availability. Earn badges like ⭐ All-Star Host and ⚡ Power Host as you build your reputation.</p>
                <p><strong>For Renters:</strong> Browse tools in your area, check availability, and book with confidence. Choose a protection plan that fits your needs. Pay securely online and coordinate pickup or delivery with your host.</p>
                <h3 style="color:var(--text-primary);margin:var(--space-xl) 0 var(--space-md)">Safety & Trust</h3>
                <p>All users can verify their identity for a ✓ Verified badge. Every transaction includes a protection plan. Our rating system ensures accountability. Admins moderate the platform to maintain quality and safety.</p>
                <h3 style="color:var(--text-primary);margin:var(--space-xl) 0 var(--space-md)">Protection Plans</h3>
                <div class="grid-3" style="margin-top:var(--space-md)">
                    <div class="glass-card" style="text-align:center"><h4>Basic</h4><p style="font-size:0.85rem;color:var(--text-muted)">Up to $500 coverage<br>Free</p></div>
                    <div class="glass-card" style="text-align:center;border-color:var(--accent-cyan)"><h4>Standard ★</h4><p style="font-size:0.85rem;color:var(--text-muted)">Up to $2,000 coverage<br>$3/day</p></div>
                    <div class="glass-card" style="text-align:center"><h4>Premium</h4><p style="font-size:0.85rem;color:var(--text-muted)">Full replacement<br>$5/day</p></div>
                </div>
            </div></div>
        </div>
        ${Components.footer()}`;
    },

    // ==================== DASHBOARD SIDEBAR ====================
    _dashboardSidebar(active) {
        var user = Store.currentUser();
        var pendingCount = user ? Store.getBookingsByOwner(user.id).filter(function (b) { return b.status === 'pending'; }).length : 0;
        var unreadNotifs = user ? Store.getUnreadCount(user.id) : 0;
        var items = [
            { icon: 'layout-dashboard', label: 'Dashboard', href: '#/dashboard', id: 'dashboard' },
        ];
        if (Store.isHost()) {
            items.push({ icon: 'wrench', label: 'My Tools', href: '#/my-tools', id: 'my-tools' });
            items.push({ icon: 'plus-circle', label: 'Add Tool', href: '#/add-tool', id: 'add-tool' });
        }
        items.push({ icon: 'calendar', label: 'Bookings', href: '#/bookings', id: 'bookings', badge: pendingCount });
        items.push({ icon: 'bell', label: 'Notifications', href: '#/notifications', id: 'notifications', badge: unreadNotifs });
        var ticketCount = user ? Store.getUserTickets(user.id).filter(function(t) { return t.status === 'replied'; }).length : 0;
        items.push({ icon: 'mail', label: 'My Tickets', href: '#/my-tickets', id: 'my-tickets', badge: ticketCount });
        items.push({ icon: 'user', label: 'Profile', href: '#/profile', id: 'profile' });
        if (Store.isAdmin()) items.push({ icon: 'shield', label: 'Admin Panel', href: '#/admin', id: 'admin' });

        var badge = Store.getHostBadge(user ? user.id : null);
        var sidebarItems = items.map(function (i) {
            return '<a href="' + i.href + '" class="sidebar-link ' + (active === i.id ? 'active' : '') + '"><span>' + Components.icon(i.icon, 18) + '</span> ' + i.label + (i.badge ? '<span class="badge badge-pending" style="margin-left:auto">' + i.badge + '</span>' : '') + '</a>';
        }).join('');
        return '<aside class="dashboard-sidebar">' +
            '<div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg)">' + Components.avatar(user, 'avatar-lg') + '<div><div style="font-weight:600">' + (user ? user.name : '') + '</div><div style="font-size:0.8rem;color:var(--text-muted)">' + (user ? user.location : '') + '</div>' + (badge ? '<div style="margin-top:4px">' + Components.hostBadge(user.id) + '</div>' : '') + '</div></div>' +
            (user && user.accountType ? '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:var(--space-md);text-transform:uppercase;letter-spacing:1px">' + (user.accountType === 'both' ? 'Host & Renter' : user.accountType === 'host' ? 'Host Account' : 'Renter Account') + '</div>' : '') +
            '<nav class="sidebar-nav">' + sidebarItems + '</nav>' +
            '<div class="sidebar-section-title" style="margin-top:var(--space-xl)">Explore</div>' +
            '<nav class="sidebar-nav"><a href="#/browse" class="sidebar-link"><span>' + Components.icon('search', 18) + '</span> Browse Tools</a><a href="#/forum" class="sidebar-link"><span>' + Components.icon('message-circle', 18) + '</span> Community Forum</a></nav>' +
            (!Store.isHost() ? '<div class="glass-card" style="margin-top:var(--space-xl);text-align:center;padding:var(--space-md)"><p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px">Want to earn by sharing tools?</p><button class="btn btn-primary btn-sm" onclick="App.upgradeToHost()">Become a Host</button></div>' : '') +
            '</aside>';
    },

    // ==================== DASHBOARD ====================
    dashboard() {
        var user = Store.currentUser();
        if (!user) return Pages.login();
        var myTools = Store.getToolsByUser(user.id);
        var asRenter = Store.getBookingsByRenter(user.id);
        var asOwner = Store.getBookingsByOwner(user.id);
        var pending = asOwner.filter(function (b) { return b.status === 'pending'; });
        var activeRentals = asRenter.filter(function (b) { return b.status === 'active' || b.status === 'approved'; });
        var earnings = Store.getUserEarnings(user.id);
        var spent = Store.getUserSpent(user.id);
        var rating = Store.getUserRating(user.id);

        var pendingHtml = '';
        if (pending.length > 0) {
            pendingHtml = '<div style="margin-top:var(--space-xl)" class="animate-in animate-in-delay-2"><h3 style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:8px">Pending Requests <span class="badge badge-pending">' + pending.length + '</span></h3><div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + pending.map(function (b) { return Components.bookingItem(b, 'owner'); }).join('') + '</div></div>';
        }
        var activeHtml = '';
        if (activeRentals.length > 0) {
            activeHtml = '<div style="margin-top:var(--space-xl)" class="animate-in animate-in-delay-3"><h3 style="margin-bottom:var(--space-md)">Your Active Rentals</h3><div style="display:flex;flex-direction:column;gap:var(--space-sm)">' + activeRentals.map(function (b) { return Components.bookingItem(b, 'renter'); }).join('') + '</div></div>';
        }

        return '<div class="dashboard-layout">' + Pages._dashboardSidebar('dashboard') +
            '<div class="dashboard-content">' +
            '<div class="page-header animate-in"><h1 class="page-title">Welcome back, ' + user.name.split(' ')[0] + '!</h1><p class="page-subtitle">Here\'s what\'s happening with your ' + (Store.isHost() ? 'tools and ' : '') + 'rentals</p></div>' +
            '<div class="grid-4 animate-in animate-in-delay-1">' +
            (Store.isHost() ? '<div class="stat-card"><div class="stat-value">' + myTools.length + '</div><div class="stat-label">' + Components.icon('wrench', 14) + ' Tools Listed</div></div>' : '') +
            '<div class="stat-card"><div class="stat-value">' + activeRentals.length + '</div><div class="stat-label">' + Components.icon('repeat', 14) + ' Active Rentals</div></div>' +
            (Store.isHost() ? '<div class="stat-card"><div class="stat-value">$' + earnings + '</div><div class="stat-label">' + Components.icon('dollar-sign', 14) + ' Total Earnings</div></div>' : '<div class="stat-card"><div class="stat-value">$' + spent + '</div><div class="stat-label">' + Components.icon('dollar-sign', 14) + ' Total Spent</div></div>') +
            '<div class="stat-card"><div class="stat-value">' + (rating > 0 ? rating : '—') + '</div><div class="stat-label">' + Components.icon('star', 14) + ' Your Rating</div></div>' +
            '</div>' + pendingHtml + activeHtml +
            '<div style="margin-top:var(--space-xl)" class="animate-in animate-in-delay-4"><h3 style="margin-bottom:var(--space-md)">Quick Actions</h3><div style="display:flex;gap:var(--space-md);flex-wrap:wrap">' +
            (Store.isHost() ? '<a href="#/add-tool" class="btn btn-primary">' + Components.icon('plus', 14) + ' List a Tool</a>' : '') +
            '<a href="#/browse" class="btn btn-secondary">' + Components.icon('search', 14) + ' Browse Tools</a>' +
            (Store.isHost() ? '<a href="#/my-tools" class="btn btn-secondary">' + Components.icon('package', 14) + ' My Inventory</a>' : '') +
            '<a href="#/bookings" class="btn btn-secondary">' + Components.icon('calendar', 14) + ' All Bookings</a>' +
            '</div></div></div></div>';
    },

    // ==================== NOTIFICATIONS ====================
    notifications() {
        if (!Store.isLoggedIn()) return Pages.login();
        const user = Store.currentUser();
        const notifs = Store.getNotifications(user.id);
        Store.markNotificationsRead(user.id);
        return `
        <div class="dashboard-layout">
            ${Pages._dashboardSidebar('notifications')}
            <div class="dashboard-content">
                <div class="page-header animate-in"><h1 class="page-title">Notifications</h1></div>
                ${notifs.length === 0 ? Components.emptyState('bell', 'No notifications', 'You\'re all caught up!') :
                `<div style="display:flex;flex-direction:column;gap:var(--space-sm)">${notifs.map(n => {
                    const time = new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                    return `<div class="card" style="${!n.read ? 'border-left:3px solid var(--accent-cyan)' : ''}"><div class="card-body" style="display:flex;align-items:center;gap:var(--space-md)"><span>${n.type === 'booking' ? Components.icon('calendar', 20) : Components.icon('bell', 20)}</span><div style="flex:1"><div>${n.message}</div><div style="color:var(--text-muted);font-size:0.8rem">${time}</div></div></div></div>`;
                }).join('')}</div>`}
            </div>
        </div>`;
    }
};
