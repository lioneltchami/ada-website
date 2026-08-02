/**
 * PostHog bootstrap (external file so CSP can keep script-src without unsafe-inline).
 * Expects data-key / optional data-host on the loading <script> tag.
 */
(() => {
	var script = document.currentScript;
	if (!script) return;

	var key = script.getAttribute("data-key");
	if (!key) return;

	var apiHost = script.getAttribute("data-host") || "https://us.i.posthog.com";
	var uiHost = script.getAttribute("data-ui-host") || "https://us.posthog.com";

	!((t, e) => {
		var o, n, p, r;
		e.__SV ||
			(window.posthog && window.posthog.__loaded) ||
			((window.posthog = e),
			(e._i = []),
			(e.init = (i, s, a) => {
				function g(t, e) {
					var o = e.split(".");
					2 == o.length && ((t = t[o[0]]), (e = o[1])),
						(t[e] = function () {
							t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
						});
				}
				((p = t.createElement("script")).type = "text/javascript"),
					(p.crossOrigin = "anonymous"),
					(p.async = !0),
					(p.src =
						s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
						"/static/array.js"),
					(r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
						p,
						r,
					);
				var u = e;
				for (
					void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
						u.people = u.people || [],
						u.toString = (t) => {
							var e = "posthog";
							return (
								"posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
							);
						},
						u.people.toString = () => u.toString(1) + ".people (stub)",
						o =
							"init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
								" ",
							),
						n = 0;
					n < o.length;
					n++
				)
					g(u, o[n]);
				e._i.push([i, s, a]);
			}),
			(e.__SV = 1));
	})(document, window.posthog || []);

	window.posthog.init(key, {
		api_host: apiHost,
		ui_host: uiHost,
		person_profiles: "identified_only",
		capture_pageview: true,
		capture_pageleave: true,
		persistence: "localStorage+cookie",
	});
})();
