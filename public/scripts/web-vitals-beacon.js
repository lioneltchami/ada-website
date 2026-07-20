(() => {
	const sampleRate = Number(
		document.currentScript?.getAttribute("data-sample-rate") || "1",
	);
	if (!("PerformanceObserver" in window)) return;
	if (Number.isFinite(sampleRate) && Math.random() > sampleRate) return;

	const thresholds = {
		CLS: [0.1, 0.25],
		FCP: [1800, 3000],
		INP: [200, 500],
		LCP: [2500, 4000],
		TTFB: [800, 1800],
	};
	const connection =
		navigator.connection?.effectiveType ||
		navigator.mozConnection?.effectiveType ||
		navigator.webkitConnection?.effectiveType ||
		"unknown";
	const device = matchMedia("(max-width: 767px)").matches
		? "mobile"
		: "desktop";
	const sent = new Set();

	function rating(name, value) {
		const [good, poor] = thresholds[name] || [0, 0];
		if (value <= good) return "good";
		if (value <= poor) return "needs-improvement";
		return "poor";
	}

	function send(name, value, once = false) {
		if (!Number.isFinite(value)) return;
		if (once && sent.has(name)) return;
		sent.add(name);

		const body = JSON.stringify({
			name,
			value,
			rating: rating(name, value),
			path: location.pathname,
			device,
			connection,
		});
		const blob = new Blob([body], { type: "application/json" });
		if (navigator.sendBeacon?.("/api/performance-metrics", blob)) return;
		fetch("/api/performance-metrics", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
			keepalive: true,
		}).catch(() => {});
	}

	try {
		const navigation = performance.getEntriesByType("navigation")[0];
		if (navigation?.responseStart) send("TTFB", navigation.responseStart, true);
	} catch {}

	try {
		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.name === "first-contentful-paint") {
					send("FCP", entry.startTime, true);
				}
			}
		}).observe({ type: "paint", buffered: true });
	} catch {}

	let lcp = 0;
	let cls = 0;
	let inp = 0;

	try {
		new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const last = entries[entries.length - 1];
			if (last) lcp = last.startTime;
		}).observe({ type: "largest-contentful-paint", buffered: true });
	} catch {}

	try {
		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!entry.hadRecentInput) cls += entry.value || 0;
			}
		}).observe({ type: "layout-shift", buffered: true });
	} catch {}

	try {
		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				inp = Math.max(inp, entry.duration || 0);
			}
		}).observe({ type: "event", buffered: true, durationThreshold: 40 });
	} catch {}

	addEventListener("pagehide", () => {
		send("LCP", lcp, true);
		send("CLS", cls, true);
		if (inp) send("INP", inp, true);
	});
})();
