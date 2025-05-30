(() => {
	'use strict';
	var t = {
			n: (r) => {
				var e = r && r.__esModule ? () => r.default : () => r;
				return t.d(e, { a: e }), e;
			},
			d: (r, e) => {
				for (var n in e)
					t.o(e, n) &&
						!t.o(r, n) &&
						Object.defineProperty(r, n, {
							enumerable: !0,
							get: e[n],
						});
			},
			o: (t, r) => Object.prototype.hasOwnProperty.call(t, r),
			r: (t) => {
				'undefined' != typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(t, Symbol.toStringTag, {
						value: 'Module',
					}),
					Object.defineProperty(t, '__esModule', { value: !0 });
			},
		},
		r = {};
	t.r(r),
		t.d(r, {
			findBetween: () => x,
			getCurrentStageIndex: () => i,
			normalDistributionStages: () => m,
			parseDuration: () => o,
			randomIntBetween: () => d,
			randomItem: () => h,
			randomString: () => p,
			tagWithCurrentStageIndex: () => u,
			tagWithCurrentStageProfile: () => s,
			uuidv4: () => g,
		});
	const e = require('k6/execution');
	var n = t.n(e);
	function o(t) {
		if (null == t || t.length < 1) throw new Error('str is empty');
		for (var r = 0, e = '', n = {}, o = 0; o < t.length; o++)
			if (
				((a(t[o]) || '.' == t[o]) && (e += t[o]),
				null != t[o + 1] && !a(t[o + 1]) && '.' != t[o + 1])
			) {
				var i = parseFloat(e, 10),
					u = t[o + 1];
				switch (u) {
					case 'd':
						r += 24 * i * 60 * 60 * 1e3;
						break;
					case 'h':
						r += 60 * i * 60 * 1e3;
						break;
					case 'm':
						o + 2 < t.length && 's' == t[o + 2]
							? ((r += Math.trunc(i)), o++, (u = 'ms'))
							: (r += 60 * i * 1e3);
						break;
					case 's':
						r += 1e3 * i;
						break;
					default:
						throw new Error(
							''.concat(u, ' is an unsupported time unit'),
						);
				}
				if (n[u])
					throw new Error(
						''.concat(u, ' time unit is provided multiple times'),
					);
				(n[u] = !0), o++, (e = '');
			}
		return e.length > 0 && (r += parseFloat(e, 10)), r;
	}
	function a(t) {
		return t >= '0' && t <= '9';
	}
	function i() {
		if (null == n() || null == n().test || null == n().test.options)
			throw new Error(
				'k6/execution.test.options is undefined - getCurrentStageIndex requires a k6 v0.38.0 or later. Please, upgrade for getting k6/execution.test.options supported.',
			);
		var t = n().test.options.scenarios[n().scenario.name];
		if (null == t)
			throw new Error(
				"the exec.test.options object doesn't contain the current scenario ".concat(
					n().scenario.name,
				),
			);
		if (null == t.stages)
			throw new Error(
				'only ramping-vus or ramping-arravial-rate supports stages, it is not possible to get a stage index on other executors.',
			);
		if (t.stages.length < 1)
			throw new Error(
				'the current scenario '.concat(
					t.name,
					" doesn't contain any stage",
				),
			);
		for (
			var r = 0, e = new Date() - n().scenario.startTime, a = 0;
			a < t.stages.length;
			a++
		)
			if (e < (r += o(t.stages[a].duration))) return a;
		return t.stages.length - 1;
	}
	function u() {
		n().vu.tags.stage = i();
	}
	function s() {
		n().vu.tags.stage_profile = (function () {
			var t = i();
			if (t < 1) return 'ramp-up';
			var r = n().test.options.scenarios[n().scenario.name].stages,
				e = r[t],
				o = r[t - 1];
			return e.target > o.target
				? 'ramp-up'
				: o.target == e.target
					? 'steady'
					: 'ramp-down';
		})();
	}
	const l = require('k6/crypto');
	function c(t) {
		return (
			(function (t) {
				if (Array.isArray(t)) return f(t);
			})(t) ||
			(function (t) {
				if (
					('undefined' != typeof Symbol &&
						null != t[Symbol.iterator]) ||
					null != t['@@iterator']
				)
					return Array.from(t);
			})(t) ||
			(function (t, r) {
				if (!t) return;
				if ('string' == typeof t) return f(t, r);
				var e = Object.prototype.toString.call(t).slice(8, -1);
				'Object' === e && t.constructor && (e = t.constructor.name);
				if ('Map' === e || 'Set' === e) return Array.from(t);
				if (
					'Arguments' === e ||
					/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)
				)
					return f(t, r);
			})(t) ||
			(function () {
				throw new TypeError(
					'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
				);
			})()
		);
	}
	function f(t, r) {
		(null == r || r > t.length) && (r = t.length);
		for (var e = 0, n = new Array(r); e < r; e++) n[e] = t[e];
		return n;
	}
	function g() {
		var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
		return t ? y() : v();
	}
	function d(t, r) {
		return Math.floor(Math.random() * (r - t + 1) + t);
	}
	function h(t) {
		return t[Math.floor(Math.random() * t.length)];
	}
	function p(t) {
		for (
			var r =
					arguments.length > 1 && void 0 !== arguments[1]
						? arguments[1]
						: 'abcdefghijklmnopqrstuvwxyz',
				e = '';
			t--;
		)
			e += r[(Math.random() * r.length) | 0];
		return e;
	}
	function x(t, r, e) {
		for (
			var n,
				o =
					arguments.length > 3 &&
					void 0 !== arguments[3] &&
					arguments[3],
				a = [],
				i = !0,
				u = 0;
			i &&
			-1 != (n = t.indexOf(r)) &&
			((n += r.length), -1 != (u = t.indexOf(e, n)));
		) {
			var s = t.substring(n, u);
			if (!o) return s;
			a.push(s), (t = t.substring(u + e.length));
		}
		return a.length ? a : null;
	}
	function m(t, r) {
		var e =
			arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 10;
		function n(t, r, e) {
			return (
				Math.exp(-0.5 * Math.pow((e - t) / r, 2)) /
				(r * Math.sqrt(2 * Math.PI))
			);
		}
		for (
			var o = 0,
				a = 1,
				i = new Array(e + 2).fill(0),
				u = new Array(e + 2).fill(Math.ceil(r / 6)),
				s = [],
				l = 0;
			l <= e;
			l++
		)
			i[l] = n(o, a, -2 * a + (4 * a * l) / e);
		for (
			var f = Math.max.apply(Math, c(i)),
				g = i.map(function (r) {
					return Math.round((r * t) / f);
				}),
				d = 1;
			d <= e;
			d++
		)
			u[d] = Math.ceil((4 * r) / (6 * e));
		for (var h = 0; h <= e + 1; h++)
			s.push({ duration: ''.concat(u[h], 's'), target: g[h] });
		return s;
	}
	function v() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (t) {
				var r = (16 * Math.random()) | 0;
				return ('x' === t ? r : (3 & r) | 8).toString(16);
			},
		);
	}
	function y() {
		for (var t = [], r = 0; r < 256; ++r)
			t.push((r + 256).toString(16).slice(1));
		var e = new Uint8Array((0, l.randomBytes)(16));
		return (
			(e[6] = (15 & e[6]) | 64),
			(e[8] = (63 & e[8]) | 128),
			(
				t[e[0]] +
				t[e[1]] +
				t[e[2]] +
				t[e[3]] +
				'-' +
				t[e[4]] +
				t[e[5]] +
				'-' +
				t[e[6]] +
				t[e[7]] +
				'-' +
				t[e[8]] +
				t[e[9]] +
				'-' +
				t[e[10]] +
				t[e[11]] +
				t[e[12]] +
				t[e[13]] +
				t[e[14]] +
				t[e[15]]
			).toLowerCase()
		);
	}
	var w = exports;
	for (var b in r) w[b] = r[b];
	r.__esModule && Object.defineProperty(w, '__esModule', { value: !0 });
})();
