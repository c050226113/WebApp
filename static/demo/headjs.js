/*! head.core - v1.0.2 */
(function(n, t) {
    "use strict";

    function r(n) {
        a[a.length] = n
    }
    function k(n) {
        var t = new RegExp(" ?\\b" + n + "\\b");
        c.className = c.className.replace(t, "")
    }
    function p(n, t) {
        for (var i = 0, r = n.length; i < r; i++) t.call(n, n[i], i)
    }
    function tt() {
        var t, e, f, o;
        c.className = c.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g, ""), t = n.innerWidth || c.clientWidth, e = n.outerWidth || n.screen.width, u.screen.innerWidth = t, u.screen.outerWidth = e, r("w-" + t), p(i.screens, function(n) {
            t > n ? (i.screensCss.gt && r("gt-" + n), i.screensCss.gte && r("gte-" + n)) : t < n ? (i.screensCss.lt && r("lt-" + n), i.screensCss.lte && r("lte-" + n)) : t === n && (i.screensCss.lte && r("lte-" + n), i.screensCss.eq && r("e-q" + n), i.screensCss.gte && r("gte-" + n))
        }), f = n.innerHeight || c.clientHeight, o = n.outerHeight || n.screen.height, u.screen.innerHeight = f, u.screen.outerHeight = o, u.feature("portrait", f > t), u.feature("landscape", f < t)
    }
    function it() {
        n.clearTimeout(b), b = n.setTimeout(tt, 50)
    }
    var y = n.document,
        rt = n.navigator,
        ut = n.location,
        c = y.documentElement,
        a = [],
        i = {
            screens: [240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920],
            screensCss: {
                gt: !0,
                gte: !1,
                lt: !0,
                lte: !1,
                eq: !1
            },
            browsers: [{
                ie: {
                    min: 6,
                    max: 11
                }
            }],
            browserCss: {
                gt: !0,
                gte: !1,
                lt: !0,
                lte: !1,
                eq: !0
            },
            html5: !0,
            page: "-page",
            section: "-section",
            head: "head"
        },
        v, u, s, w, o, h, l, d, f, g, nt, e, b;
    if (n.head_conf) for (v in n.head_conf) n.head_conf[v] !== t && (i[v] = n.head_conf[v]);
    u = n[i.head] = function() {
        u.ready.apply(null, arguments)
    }, u.feature = function(n, t, i) {
        return n ? (Object.prototype.toString.call(t) === "[object Function]" && (t = t.call()), r((t ? "" : "no-") + n), u[n] = !! t, i || (k("no-" + n), k(n), u.feature()), u) : (c.className += " " + a.join(" "), a = [], u)
    }, u.feature("js", !0), s = rt.userAgent.toLowerCase(), w = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(s), u.feature("mobile", w, !0), u.feature("desktop", !w, !0), s = /(chrome|firefox)[ \/]([\w.]+)/.exec(s) || /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(s) || /(android)(?:.*version)?[ \/]([\w.]+)/.exec(s) || /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || /(trident).+rv:(\w.)+/.exec(s) || [], o = s[1], h = parseFloat(s[2]);
    switch (o) {
        case "msie":
        case "trident":
            o = "ie", h = y.documentMode || h;
            break;
        case "firefox":
            o = "ff";
            break;
        case "ipod":
        case "ipad":
        case "iphone":
            o = "ios";
            break;
        case "webkit":
            o = "safari"
    }
    for (u.browser = {
        name: o,
        version: h
    }, u.browser[o] = !0, l = 0, d = i.browsers.length; l < d; l++) for (f in i.browsers[l]) if (o === f) for (r(f), g = i.browsers[l][f].min, nt = i.browsers[l][f].max, e = g; e <= nt; e++) h > e ? (i.browserCss.gt && r("gt-" + f + e), i.browserCss.gte && r("gte-" + f + e)) : h < e ? (i.browserCss.lt && r("lt-" + f + e), i.browserCss.lte && r("lte-" + f + e)) : h === e && (i.browserCss.lte && r("lte-" + f + e), i.browserCss.eq && r("eq-" + f + e), i.browserCss.gte && r("gte-" + f + e));
    else r("no-" + f);
    r(o), r(o + parseInt(h, 10)), i.html5 && o === "ie" && h < 9 && p("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(n) {
        y.createElement(n)
    }), p(ut.pathname.split("/"), function(n, u) {
        if (this.length > 2 && this[u + 1] !== t) u && r(this.slice(u, u + 1).join("-").toLowerCase() + i.section);
        else {
            var f = n || "index",
                e = f.indexOf(".");
            e > 0 && (f = f.substring(0, e)), c.id = f.toLowerCase() + i.page, u || r("root" + i.section)
        }
    }), u.screen = {
        height: n.screen.height,
        width: n.screen.width
    }, tt(), b = 0, n.addEventListener ? n.addEventListener("resize", it, !1) : n.attachEvent("onresize", it)
})(window);
//# sourceMappingURL=head.core.min.js.map