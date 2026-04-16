/* ============================================
   TOOLVAULT – PAGE RENDERERS (Part 3)
   Info / Legal / Support Pages
   ============================================ */

// ==================== SAFETY GUIDELINES ====================
Pages.safety = function () {
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('shield', 24) + ' Safety Guidelines</h1><p class="page-subtitle">Your safety is our top priority. Follow these guidelines for a secure experience.</p></div>' +
        '<div class="card animate-in animate-in-delay-1"><div class="card-body">' +
        '<h3 style="margin-bottom:var(--space-md)">' + Components.icon('user-check', 18) + ' For Renters</h3>' +
        '<ul style="color:var(--text-secondary);line-height:2;padding-left:var(--space-lg)">' +
        '<li>Always inspect tools before use — check for damage, wear, or missing parts.</li>' +
        '<li>Read the manufacturer\'s safety manual before operating any unfamiliar tool.</li>' +
        '<li>Wear appropriate personal protective equipment (PPE) — goggles, gloves, ear protection.</li>' +
        '<li>Never modify or disable safety guards on any power tool.</li>' +
        '<li>Return tools clean and in the same condition you received them.</li>' +
        '<li>Report any damage or malfunction immediately through the platform.</li>' +
        '</ul></div></div>' +

        '<div class="card animate-in animate-in-delay-2" style="margin-top:var(--space-lg)"><div class="card-body">' +
        '<h3 style="margin-bottom:var(--space-md)">' + Components.icon('home', 18) + ' For Hosts</h3>' +
        '<ul style="color:var(--text-secondary);line-height:2;padding-left:var(--space-lg)">' +
        '<li>Only list tools that are in safe, working condition with all guards intact.</li>' +
        '<li>Include clear operating instructions or link to the manufacturer\'s manual.</li>' +
        '<li>Disclose any known issues, quirks, or required maintenance.</li>' +
        '<li>Verify the renter understands how to safely operate the tool before handoff.</li>' +
        '<li>Regularly inspect and maintain your listed tools between rentals.</li>' +
        '<li>Provide any required accessories (chargers, blades, safety keys).</li>' +
        '</ul></div></div>' +

        '<div class="card animate-in animate-in-delay-3" style="margin-top:var(--space-lg)"><div class="card-body">' +
        '<h3 style="margin-bottom:var(--space-md)">' + Components.icon('alert-triangle', 18) + ' Emergency Procedures</h3>' +
        '<ul style="color:var(--text-secondary);line-height:2;padding-left:var(--space-lg)">' +
        '<li>In case of injury, call emergency services (911) immediately.</li>' +
        '<li>Report all incidents to ToolVault within 24 hours via the Contact page.</li>' +
        '<li>Document any tool-related damage with photos before and after use.</li>' +
        '<li>If a tool appears unsafe at pickup, refuse it and report through the platform.</li>' +
        '</ul></div></div>' +
        '</div>' + Components.footer();
};

// ==================== HELP CENTER ====================
Pages.help = function () {
    var faqs = [
        { q: 'How do I list a tool?', a: 'Go to your Dashboard and click "Add Tool." Fill in the details including photos, pricing, and availability. Your listing goes live immediately.' },
        { q: 'How does payment work?', a: 'Renters pay through the platform when a booking is approved. Hosts receive payment after the rental is completed. We support credit/debit cards and PayPal.' },
        { q: 'What if a tool gets damaged?', a: 'All rentals include basic protection. If damage occurs, report it within 24 hours. Our team will review the claim and process reimbursement based on your protection plan.' },
        { q: 'How do I cancel a booking?', a: 'Go to your Bookings page and click the cancel button. Cancellations made 24+ hours before the rental start are fully refunded. Late cancellations may incur a fee.' },
        { q: 'How does verification work?', a: 'Hosts can get verified by uploading a government-issued ID. Our admin team reviews it within 48 hours. Verified hosts get a badge and appear higher in search results.' },
        { q: 'Can I be both a host and a renter?', a: 'Yes! When registering, select "Both" as your account type. You can list tools and rent from others with the same account.' },
        { q: 'How are ratings calculated?', a: 'After each rental, both parties can leave a review. Ratings are averaged across all completed transactions. Tool ratings and seller ratings are tracked separately.' },
        { q: 'What if the owner doesn\'t respond?', a: 'If a host doesn\'t respond to a booking request within 48 hours, the request is automatically cancelled and you\'re fully refunded.' }
    ];
    var faqHtml = faqs.map(function (f, i) {
        return '<div class="card" style="margin-bottom:var(--space-sm)"><div class="card-body" style="cursor:pointer" onclick="this.querySelector(\'.faq-answer\').style.display=this.querySelector(\'.faq-answer\').style.display===\'none\'?\'block\':\'none\'">' +
            '<div style="display:flex;align-items:center;justify-content:space-between"><h4 style="font-size:0.95rem">' + Components.icon('help-circle', 16) + ' ' + f.q + '</h4><span style="color:var(--text-muted)">' + Components.icon('chevron-down', 16) + '</span></div>' +
            '<div class="faq-answer" style="display:none;margin-top:var(--space-sm);color:var(--text-secondary);font-size:0.9rem;line-height:1.7">' + f.a + '</div>' +
            '</div></div>';
    }).join('');

    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('help-circle', 24) + ' Help Center</h1><p class="page-subtitle">Find answers to common questions or reach out to our support team.</p></div>' +
        '<h3 class="animate-in animate-in-delay-1" style="margin-bottom:var(--space-md)">Frequently Asked Questions</h3>' +
        '<div class="animate-in animate-in-delay-2">' + faqHtml + '</div>' +
        '<div class="card animate-in animate-in-delay-3" style="margin-top:var(--space-xl)"><div class="card-body" style="text-align:center;padding:var(--space-xl)">' +
        '<h3>' + Components.icon('message-circle', 20) + ' Still Need Help?</h3>' +
        '<p style="color:var(--text-secondary);margin:var(--space-sm) 0 var(--space-md)">Our support team is available Monday–Friday, 9 AM – 6 PM EST.</p>' +
        '<a href="#/contact" class="btn btn-primary">' + Components.icon('mail', 14) + ' Contact Support</a>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== CONTACT US ====================
Pages.contact = function () {
    var user = Store.currentUser();
    var nameVal = user ? user.name : '';
    var emailVal = user ? user.email : '';
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('mail', 24) + ' Contact Us</h1><p class="page-subtitle">We\'d love to hear from you. Send us a message and we\'ll respond within 24 hours.</p></div>' +
        (user ? '<div class="animate-in" style="margin-bottom:var(--space-md)"><a href="#/my-tickets" style="color:var(--accent-primary);font-size:0.9rem">' + Components.icon('inbox', 14) + ' View My Tickets</a></div>' : '') +
        '<div class="grid-2 animate-in animate-in-delay-1">' +
        '<div class="card"><div class="card-body">' +
        '<h3 style="margin-bottom:var(--space-lg)">Send a Message</h3>' +
        '<div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="contact-name" placeholder="Your full name" value="' + nameVal + '"></div>' +
        '<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="contact-email" placeholder="you@example.com" value="' + emailVal + '"></div>' +
        '<div class="form-group"><label class="form-label">Subject</label><select class="form-select" id="contact-subject"><option>General Inquiry</option><option>Booking Issue</option><option>Report a Problem</option><option>Damage Claim</option><option>Account Issue</option><option>Feature Request</option></select></div>' +
        '<div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" id="contact-message" placeholder="Tell us how we can help..." style="min-height:120px"></textarea></div>' +
        '<button class="btn btn-primary" onclick="App.submitContactForm()">' + Components.icon('send', 14) + ' Send Message</button>' +
        '</div></div>' +

        '<div>' +
        '<div class="card" style="margin-bottom:var(--space-md)"><div class="card-body">' +
        '<h4 style="margin-bottom:var(--space-md)">' + Components.icon('clock', 16) + ' Business Hours</h4>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.8">Monday – Friday: 9:00 AM – 6:00 PM EST<br>Saturday: 10:00 AM – 4:00 PM EST<br>Sunday: Closed</p>' +
        '</div></div>' +

        '<div class="card" style="margin-bottom:var(--space-md)"><div class="card-body">' +
        '<h4 style="margin-bottom:var(--space-md)">' + Components.icon('mail', 16) + ' Email Us</h4>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem">support@toolvault.com</p>' +
        '</div></div>' +

        '<div class="card"><div class="card-body">' +
        '<h4 style="margin-bottom:var(--space-md)">' + Components.icon('map-pin', 16) + ' Office</h4>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.8">ToolVault HQ<br>123 Innovation Drive<br>Ottawa, ON K1A 0B1<br>Canada</p>' +
        '</div></div>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== TERMS OF SERVICE ====================
Pages.terms = function () {
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('file-text', 24) + ' Terms of Service</h1><p class="page-subtitle">Last updated: January 15, 2026</p></div>' +
        '<div class="card animate-in animate-in-delay-1"><div class="card-body" style="line-height:1.9;color:var(--text-secondary)">' +
        '<h3 style="color:var(--text-primary)">1. Acceptance of Terms</h3>' +
        '<p>By accessing or using ToolVault, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">2. User Accounts</h3>' +
        '<p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Users must be at least 18 years old.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">3. Tool Listings</h3>' +
        '<p>Hosts are responsible for the accuracy of their listings, including descriptions, pricing, availability, and condition. All tools listed must be legal to own and operate in your jurisdiction. ToolVault reserves the right to remove any listing at our discretion.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">4. Bookings & Payments</h3>' +
        '<p>All bookings are agreements between the host and renter. ToolVault facilitates the transaction but is not a party to the rental agreement. Payment is processed at the time of booking approval. Cancellation policies are as stated on each listing.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">5. Liability & Damage</h3>' +
        '<p>Renters are responsible for any damage to tools during the rental period. Hosts must accurately represent the condition of tools at the time of handoff. ToolVault offers optional protection plans but is not an insurer. See our Insurance Info page for coverage details.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">6. Prohibited Conduct</h3>' +
        '<p>Users may not: list stolen or unsafe tools; misrepresent tool condition; engage in fraudulent transactions; harass other users; circumvent platform payments; or violate any applicable laws.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">7. Termination</h3>' +
        '<p>ToolVault may suspend or terminate accounts that violate these terms. Users may delete their account at any time through account settings.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">8. Changes to Terms</h3>' +
        '<p>We may update these terms from time to time. Continued use of ToolVault after changes constitutes acceptance of the new terms.</p>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== PRIVACY POLICY ====================
Pages.privacy = function () {
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('lock', 24) + ' Privacy Policy</h1><p class="page-subtitle">Last updated: January 15, 2026</p></div>' +
        '<div class="card animate-in animate-in-delay-1"><div class="card-body" style="line-height:1.9;color:var(--text-secondary)">' +
        '<h3 style="color:var(--text-primary)">1. Information We Collect</h3>' +
        '<p>We collect information you provide directly: name, email, phone, location, profile photo, and government ID (for verification). We also collect usage data including browsing activity, booking history, and device information.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">2. How We Use Your Information</h3>' +
        '<p>Your information is used to: operate and improve the platform; process transactions; verify identities; communicate about bookings; send platform updates; prevent fraud and enforce our terms; and personalize your experience.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">3. Information Sharing</h3>' +
        '<p>We share limited information with: other users (name, location, ratings) to facilitate rentals; payment processors to complete transactions; law enforcement when legally required. We never sell your personal data to third parties.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">4. Data Security</h3>' +
        '<p>We use industry-standard encryption (HTTPS/TLS) to protect data in transit. Passwords are hashed and salted. Government IDs submitted for verification are encrypted at rest and deleted after review.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">5. Your Rights</h3>' +
        '<p>You may: access your personal data; correct inaccurate information; request deletion of your account and data; opt out of marketing communications; and export your data in a portable format.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">6. Cookies</h3>' +
        '<p>We use essential cookies for authentication and preferences (like theme). See our Cookie Policy for full details.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">7. Contact</h3>' +
        '<p>For privacy-related questions, email us at privacy@toolvault.com or visit our <a href="#/contact" style="color:var(--accent-primary)">Contact page</a>.</p>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== COOKIE POLICY ====================
Pages.cookies = function () {
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('cookie', 24) + ' Cookie Policy</h1><p class="page-subtitle">Last updated: January 15, 2026</p></div>' +
        '<div class="card animate-in animate-in-delay-1"><div class="card-body" style="line-height:1.9;color:var(--text-secondary)">' +
        '<h3 style="color:var(--text-primary)">What Are Cookies?</h3>' +
        '<p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">Cookies We Use</h3>' +
        '<table class="admin-table" style="margin:var(--space-md) 0"><thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>' +
        '<tr><td>tv_session</td><td>Keeps you logged in</td><td>Session</td></tr>' +
        '<tr><td>tv_theme</td><td>Remembers your theme preference (light/dark)</td><td>Persistent</td></tr>' +
        '<tr><td>tv_geo</td><td>Caches your approximate location for nearby tool search</td><td>Persistent</td></tr>' +
        '</tbody></table>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">Third-Party Cookies</h3>' +
        '<p>ToolVault does not use any third-party advertising or analytics cookies. We only use essential cookies required for the platform to function.</p>' +

        '<h3 style="color:var(--text-primary);margin-top:var(--space-lg)">Managing Cookies</h3>' +
        '<p>You can clear or block cookies through your browser settings. Note that blocking essential cookies may prevent you from logging in or using certain features.</p>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== INSURANCE INFO ====================
Pages.insurance = function () {
    return '<div class="page-section">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('shield-check', 24) + ' Insurance & Protection</h1><p class="page-subtitle">Every rental includes protection. Choose the plan that fits your needs.</p></div>' +
        '<div class="grid-3 animate-in animate-in-delay-1">' +

        '<div class="card" style="border-color:var(--border-color)"><div class="card-body" style="text-align:center;padding:var(--space-xl) var(--space-lg)">' +
        '<div style="font-size:2rem;margin-bottom:var(--space-sm)">' + Components.icon('shield', 32) + '</div>' +
        '<h3>Basic</h3>' +
        '<div style="font-size:1.5rem;font-weight:700;color:var(--accent-primary);margin:var(--space-sm) 0">Free</div>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:var(--space-md)">Included with every rental</p>' +
        '<ul style="text-align:left;color:var(--text-secondary);font-size:0.9rem;line-height:2;padding-left:var(--space-md)">' +
        '<li>Up to $500 damage coverage</li>' +
        '<li>$150 deductible</li>' +
        '<li>Theft reporting support</li>' +
        '<li>24-hour claim window</li>' +
        '</ul></div></div>' +

        '<div class="card" style="border-color:var(--accent-primary);box-shadow:0 0 20px rgba(0,240,255,0.1)"><div class="card-body" style="text-align:center;padding:var(--space-xl) var(--space-lg)">' +
        '<span class="badge badge-available" style="margin-bottom:var(--space-sm)">Most Popular</span>' +
        '<div style="font-size:2rem;margin-bottom:var(--space-sm)">' + Components.icon('shield-check', 32) + '</div>' +
        '<h3>Standard</h3>' +
        '<div style="font-size:1.5rem;font-weight:700;color:var(--accent-primary);margin:var(--space-sm) 0">$4.99<span style="font-size:0.8rem;font-weight:400">/rental</span></div>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:var(--space-md)">Enhanced protection for peace of mind</p>' +
        '<ul style="text-align:left;color:var(--text-secondary);font-size:0.9rem;line-height:2;padding-left:var(--space-md)">' +
        '<li>Up to $2,000 damage coverage</li>' +
        '<li>$50 deductible</li>' +
        '<li>Theft protection included</li>' +
        '<li>72-hour claim window</li>' +
        '<li>Priority support</li>' +
        '</ul></div></div>' +

        '<div class="card" style="border-color:var(--accent-green)"><div class="card-body" style="text-align:center;padding:var(--space-xl) var(--space-lg)">' +
        '<div style="font-size:2rem;margin-bottom:var(--space-sm)">' + Components.icon('shield-plus', 32) + '</div>' +
        '<h3>Premium</h3>' +
        '<div style="font-size:1.5rem;font-weight:700;color:var(--accent-green);margin:var(--space-sm) 0">$9.99<span style="font-size:0.8rem;font-weight:400">/rental</span></div>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:var(--space-md)">Maximum coverage for high-value tools</p>' +
        '<ul style="text-align:left;color:var(--text-secondary);font-size:0.9rem;line-height:2;padding-left:var(--space-md)">' +
        '<li>Up to $10,000 damage coverage</li>' +
        '<li>$0 deductible</li>' +
        '<li>Full theft replacement</li>' +
        '<li>7-day claim window</li>' +
        '<li>Dedicated claims agent</li>' +
        '<li>Liability protection</li>' +
        '</ul></div></div>' +

        '</div>' +
        '<div class="card animate-in animate-in-delay-2" style="margin-top:var(--space-xl)"><div class="card-body" style="line-height:1.9;color:var(--text-secondary)">' +
        '<h3 style="color:var(--text-primary);margin-bottom:var(--space-md)">How Claims Work</h3>' +
        '<ol style="padding-left:var(--space-lg)">' +
        '<li style="margin-bottom:var(--space-sm)"><strong>Document the damage</strong> — Take photos and describe what happened.</li>' +
        '<li style="margin-bottom:var(--space-sm)"><strong>File a claim</strong> — Submit through the booking page within your plan\'s claim window.</li>' +
        '<li style="margin-bottom:var(--space-sm)"><strong>Review</strong> — Our team reviews the claim within 2 business days.</li>' +
        '<li style="margin-bottom:var(--space-sm)"><strong>Resolution</strong> — Approved claims are paid out within 5 business days.</li>' +
        '</ol>' +
        '</div></div>' +
        '</div>' + Components.footer();
};

// ==================== ADMIN TICKETS TAB ====================
Pages._adminTicketsTab = function (tickets) {
    if (tickets.length === 0) return Components.emptyState('mail', 'No tickets', 'No support tickets have been submitted.');
    var cards = tickets.map(function (t) {
        var user = t.userId ? Store.getUser(t.userId) : null;
        var date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        var statusBadge = t.status === 'open' ? Components.badge('Open', 'pending') : t.status === 'replied' ? Components.badge('Replied', 'available') : Components.badge('Closed', 'declined');
        var repliesHtml = '';
        if (t.replies && t.replies.length > 0) {
            repliesHtml = t.replies.map(function (r) {
                var isAdmin = !!r.adminId;
                var ra = isAdmin ? Store.getUser(r.adminId) : (r.userId ? Store.getUser(r.userId) : user);
                var rd = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                var borderColor = isAdmin ? 'var(--accent-primary)' : 'var(--accent-green)';
                var label = isAdmin ? (ra ? ra.name : 'Admin') : (ra ? ra.name : 'User');
                return '<div style="display:flex;gap:8px;margin-top:8px;padding:8px;background:var(--bg-glass);border-radius:var(--radius-sm);font-size:0.85rem;border-left:3px solid ' + borderColor + '">' +
                    '<div style="flex-shrink:0">' + Components.avatar(ra) + '</div>' +
                    '<div><div style="font-weight:600;font-size:0.8rem">' + label + ' <span style="color:var(--text-muted);font-weight:400">' + rd + '</span></div>' +
                    '<div style="color:var(--text-secondary);margin-top:2px">' + r.body + '</div></div></div>';
            }).join('');
            repliesHtml = '<div style="margin-top:var(--space-sm);padding-top:var(--space-sm);border-top:1px solid var(--border-color)">' +
                '<span style="font-size:0.8rem;color:var(--text-muted)">' + t.replies.length + ' reply(ies)</span>' + repliesHtml + '</div>';
        }
        return '<div class="card" style="margin-bottom:var(--space-md)"><div class="card-body">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm);flex-wrap:wrap;gap:8px">' +
            '<div style="display:flex;align-items:center;gap:var(--space-sm)">' + Components.avatar(user) +
            '<div><div style="font-weight:600;font-size:0.9rem">' + (user ? user.name : t.name) + '</div>' +
            '<div style="font-size:0.75rem;color:var(--text-muted)">' + t.email + ' &middot; ' + date + '</div></div></div>' +
            '<div style="display:flex;align-items:center;gap:8px">' + statusBadge +
            (t.status !== 'closed' ? ' <button class="btn btn-sm btn-secondary" onclick="App.adminReplyTicket(\'' + t.id + '\')">' + Components.icon('reply', 12) + ' Reply</button>' : '') +
            (t.status !== 'closed' ? ' <button class="btn btn-sm btn-ghost" onclick="App.adminCloseTicket(\'' + t.id + '\')" style="color:var(--accent-red)" title="Close ticket">' + Components.icon('x-circle', 12) + '</button>' : '') +
            '</div></div>' +
            '<div style="margin-bottom:4px"><span class="badge badge-pending" style="font-size:0.7rem">' + t.subject + '</span></div>' +
            '<p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6">' + t.message + '</p>' +
            repliesHtml +
            '</div></div>';
    }).join('');
    return '<div>' + cards + '</div>';
};

// ==================== MY TICKETS (User view) ====================
Pages.myTickets = function () {
    var user = Store.currentUser();
    if (!user) return '<div class="page-section">' + Components.emptyState('lock', 'Sign In Required', 'Please sign in to view your tickets.') + '</div>';
    var tickets = Store.getUserTickets(user.id);

    var ticketCards = tickets.length > 0 ? tickets.map(function (t) {
        var date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        var statusBadge = t.status === 'open' ? Components.badge('Open', 'pending') : t.status === 'replied' ? Components.badge('Replied', 'available') : Components.badge('Closed', 'declined');
        var repliesHtml = '';
        if (t.replies && t.replies.length > 0) {
            repliesHtml = t.replies.map(function (r) {
                var isAdmin = !!r.adminId;
                var ra = isAdmin ? Store.getUser(r.adminId) : user;
                var rd = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                var borderColor = isAdmin ? 'var(--accent-primary)' : 'var(--accent-green)';
                var label = isAdmin ? (ra ? ra.name : 'Support Team') : 'You';
                return '<div style="display:flex;gap:8px;margin-top:8px;padding:var(--space-sm) var(--space-md);background:var(--bg-glass);border-radius:var(--radius-sm);border-left:3px solid ' + borderColor + '">' +
                    '<div style="flex-shrink:0">' + Components.avatar(ra) + '</div>' +
                    '<div><div style="font-weight:600;font-size:0.85rem">' + label + ' <span style="color:var(--text-muted);font-weight:400;font-size:0.8rem">' + rd + '</span></div>' +
                    '<div style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;line-height:1.6">' + r.body + '</div></div></div>';
            }).join('');
        }
        var actionsHtml = '';
        if (t.status !== 'closed') {
            actionsHtml = '<div style="margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-color)">' +
                '<div class="form-group" style="margin-bottom:var(--space-sm)"><textarea class="form-textarea" id="user-reply-' + t.id + '" placeholder="Write a reply..." style="min-height:60px"></textarea></div>' +
                '<div style="display:flex;gap:8px">' +
                '<button class="btn btn-primary btn-sm" onclick="App.userReplyTicket(\'' + t.id + '\')">' + Components.icon('send', 12) + ' Reply</button>' +
                '<button class="btn btn-ghost btn-sm" onclick="App.userCloseTicket(\'' + t.id + '\')" style="color:var(--text-muted)">' + Components.icon('x-circle', 12) + ' Close Ticket</button>' +
                '</div></div>';
        } else {
            actionsHtml = '<div style="margin-top:var(--space-md);padding-top:var(--space-sm);border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem">' + Components.icon('check-circle', 14) + ' This ticket has been closed.</div>';
        }
        return '<div class="card" style="margin-bottom:var(--space-md)"><div class="card-body">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">' +
            '<div><span class="badge badge-pending" style="font-size:0.75rem">' + t.subject + '</span> ' + statusBadge + '</div>' +
            '<span style="color:var(--text-muted);font-size:0.8rem">' + date + '</span></div>' +
            '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;margin-bottom:var(--space-sm)">' + t.message + '</p>' +
            repliesHtml + actionsHtml +
            '</div></div>';
    }).join('') : Components.emptyState('mail', 'No tickets yet', 'Submit a question via the <a href="#/contact" style="color:var(--accent-primary)">Contact page</a>.');

    return '<div class="dashboard-layout">' + Pages._dashboardSidebar('my-tickets') +
        '<div class="dashboard-content">' +
        '<div class="page-header animate-in"><h1 class="page-title">' + Components.icon('mail', 24) + ' My Tickets</h1><p class="page-subtitle">Your support conversations</p></div>' +
        '<div class="animate-in animate-in-delay-1">' + ticketCards + '</div>' +
        '</div></div>';
};
