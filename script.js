    (function() {
        'use strict';

        /* ═══ THEME TOGGLE ═══ */
        var html = document.documentElement;
        var toggle = document.getElementById('themeToggle');
        var stored = localStorage.getItem('theme');
        if (stored) { html.setAttribute('data-theme', stored); }
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) { html.setAttribute('data-theme', 'dark'); }

        function updateIcon(theme) {
            if (theme === 'dark') {
                toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
            } else {
                toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            }
        }
        updateIcon(html.getAttribute('data-theme'));

        toggle.addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateIcon(next);
        });

        /* ═══ LOADER ═══ */
        document.body.style.overflow = 'hidden';
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.getElementById('loader').classList.add('hidden');
                document.body.style.overflow = '';
                initGSAP();
            }, 2200);
        });

        /* ═══ CURSOR FOLLOWER ═══ */
        var cursor = document.getElementById('cursor');
        var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.classList.add('visible');
        });
        document.addEventListener('mouseleave', function() { cursor.classList.remove('visible'); });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .service-card, .project-card-inner, .skill-chip, .why-card').forEach(function(el) {
            el.addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
            el.addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
        });

        /* ═══ THREE.JS HERO ═══ */
        (function initThree() {
            var canvas = document.getElementById('hero-canvas');
            if (!canvas || !window.THREE) return;

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            var geometry = new THREE.IcosahedronGeometry(1, 1);
            var shapes = [];
            for (var i = 0; i < 5; i++) {
                var material = new THREE.MeshBasicMaterial({ color: 0xFF5A1F, wireframe: true, transparent: true, opacity: Math.random() * 0.08 + 0.03 });
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 - 3);
                mesh.scale.setScalar(Math.random() * 1.5 + 0.5);
                scene.add(mesh);
                shapes.push(mesh);
            }

            var particlesGeo = new THREE.BufferGeometry();
            var count = 80;
            var pos = new Float32Array(count * 3);
            for (var j = 0; j < count * 3; j++) { pos[j] = (Math.random() - 0.5) * 20; }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            var particlesMat = new THREE.PointsMaterial({ size: 0.02, color: 0xFF5A1F, transparent: true, opacity: 0.25 });
            scene.add(new THREE.Points(particlesGeo, particlesMat));

            camera.position.z = 5;
            var mX = 0, mY = 0;
            document.addEventListener('mousemove', function(e) {
                mX = (e.clientX / window.innerWidth - 0.5) * 2;
                mY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            function animate() {
                requestAnimationFrame(animate);
                shapes.forEach(function(s, idx) {
                    s.rotation.x += 0.001 * (idx + 1);
                    s.rotation.y += 0.0015 * (idx + 1);
                    s.position.y += Math.sin(Date.now() * 0.0008 + idx) * 0.001;
                });
                camera.position.x += (mX * 0.3 - camera.position.x) * 0.02;
                camera.position.y += (-mY * 0.3 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        })();

        /* ═══ GSAP ANIMATIONS ═══ */
        function initGSAP() {
            if (!window.gsap || !window.ScrollTrigger) return;
            gsap.registerPlugin(ScrollTrigger);

            // Hero text animation
            gsap.from('.hero-heading .line span', {
                y: 120, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out', delay: 0.3
            });
            gsap.from('.hero-status', { y: 20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
            gsap.from('.hero-description', { y: 30, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
            gsap.from('.hero-ctas', { y: 30, opacity: 0, duration: 0.8, delay: 1.0, ease: 'power3.out' });
            gsap.from('.hero-stat', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 1.2, ease: 'power3.out' });

            // Counter animation
            document.querySelectorAll('.hero-stat-number, .counter-number').forEach(function(el) {
                var target = parseInt(el.getAttribute('data-count')) || 0;
                if (!target) return;
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: function() {
                        gsap.to({ val: 0 }, {
                            val: target, duration: 2, ease: 'power2.out',
                            onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + '+'; }
                        });
                    }
                });
            });

            // Reveal animations
            document.querySelectorAll('.reveal').forEach(function(el) {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: function() { el.classList.add('active'); }
                });
            });

            // Parallax on hero
            gsap.to('.hero-content', {
                y: -80,
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
            });

            // Nav background on scroll
            ScrollTrigger.create({
                start: 'top -80',
                onUpdate: function(self) {
                    document.querySelector('.nav').style.boxShadow = self.progress > 0 ? '0 1px 10px rgba(0,0,0,0.05)' : 'none';
                }
            });
        }

        /* ═══ FAQ ACCORDION ═══ */
        document.querySelectorAll('.faq-question').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var item = this.parentElement;
                var isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item.active').forEach(function(el) { el.classList.remove('active'); });
                if (!isActive) { item.classList.add('active'); }
                this.setAttribute('aria-expanded', !isActive);
            });
        });

        /* ═══ SMOOTH SCROLL ═══ */
        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        /* ═══ MOBILE MENU (Floating Pill) ═══ */
        var mobileToggle = document.getElementById('mobileToggle');
        var mobileMenu = document.getElementById('mobileMenu');
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('open');
            });
            mobileMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('open');
                });
            });
        }

        /* ═══ NAV SCROLL SHRINK (Floating Pill) ═══ */
        var navHeader = document.getElementById('navHeader');
        function _pillScroll() {
            if (!navHeader) return;
            if (window.scrollY > 8) navHeader.classList.add('scrolled');
            else navHeader.classList.remove('scrolled');
        }
        window.addEventListener('scroll', _pillScroll, { passive: true });
        _pillScroll();

        /* ═══ PIXELBLAST ABOUT BACKGROUND (Dark Mode - Click Only) ═══ */
        (function initPixelBlastAbout() {
            var container = document.getElementById('aboutPixelblastBg');
            if (!container) return;
            // Desktop only: skip PixelBlast on tablet/mobile for performance
            var _pbIsDesktop = window.matchMedia && window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)').matches;
            if (!_pbIsDesktop) { return; }

            var PBCONFIG = {
                pixelSize: 4,
                color: [0.706, 0.592, 0.812], // #B497CF in linear approx
                patternScale: 2.0,
                patternDensity: 1.0,
                pixelSizeJitter: 0.0,
                rippleSpeed: 0.4,
                rippleThickness: 0.12,
                rippleIntensityScale: 1.5,
                speed: 0.5,
                edgeFade: 0.25
            };
            var MAX_CLICKS = 10;

            // Use raw WebGL for compatibility (no Three.js GLSL3 needed)
            var pbCanvas = document.createElement('canvas');
            container.appendChild(pbCanvas);
            var gl = pbCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
            if (!gl) { console.warn('WebGL not available for PixelBlast'); return; }

            var PB_VERT = 'attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }';
            var PB_FRAG = [
                '#ifdef GL_OES_standard_derivatives',
                '#extension GL_OES_standard_derivatives : enable',
                '#endif',
                'precision highp float;',
                'uniform vec3 uColor;',
                'uniform vec2 uResolution;',
                'uniform float uTime;',
                'uniform float uPixelSize;',
                'uniform float uScale;',
                'uniform float uDensity;',
                'uniform float uPixelJitter;',
                'uniform float uRippleSpeed;',
                'uniform float uRippleThickness;',
                'uniform float uRippleIntensity;',
                'uniform float uEdgeFade;',
                'uniform vec2 uClickPos[10];',
                'uniform float uClickTimes[10];',
                '',
                'float Bayer2(vec2 a){ a=floor(a); return fract(a.x/2.0+a.y*a.y*0.75); }',
                'float Bayer4(vec2 a){ return Bayer2(0.5*a)*0.25+Bayer2(a); }',
                'float Bayer8(vec2 a){ return Bayer4(0.5*a)*0.25+Bayer2(a); }',
                '',
                'float hash11(float n){ return fract(sin(n)*43758.5453); }',
                'float vnoise(vec3 p){',
                '  vec3 ip=floor(p), fp=fract(p);',
                '  float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113)));',
                '  float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));',
                '  float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113)));',
                '  float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));',
                '  float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113)));',
                '  float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));',
                '  float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113)));',
                '  float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));',
                '  vec3 w=fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);',
                '  float x00=mix(n000,n100,w.x), x10=mix(n010,n110,w.x);',
                '  float x01=mix(n001,n101,w.x), x11=mix(n011,n111,w.x);',
                '  float y0=mix(x00,x10,w.y), y1=mix(x01,x11,w.y);',
                '  return mix(y0,y1,w.z)*2.0-1.0;',
                '}',
                'float fbm2(vec2 uv, float t){',
                '  vec3 p=vec3(uv*uScale,t);',
                '  float amp=1.0, freq=1.0, sum=1.0;',
                '  for(int i=0;i<5;i++){ sum+=amp*vnoise(p*freq); freq*=1.25; amp*=1.0; }',
                '  return sum*0.5+0.5;',
                '}',
                '',
                'void main(){',
                '  float pixelSize=uPixelSize;',
                '  vec2 fragCoord=gl_FragCoord.xy - uResolution*0.5;',
                '  float aspectRatio=uResolution.x/uResolution.y;',
                '  vec2 pixelUV=fract(fragCoord/pixelSize);',
                '  float cellPixelSize=8.0*pixelSize;',
                '  vec2 cellId=floor(fragCoord/cellPixelSize);',
                '  vec2 cellCoord=cellId*cellPixelSize;',
                '  vec2 uv=cellCoord/uResolution*vec2(aspectRatio,1.0);',
                '  float base=fbm2(uv,uTime*0.05);',
                '  base=base*0.5-0.65;',
                '  float feed=base+(uDensity-0.5)*0.3;',
                '',
                '  for(int i=0;i<10;i++){',
                '    vec2 pos=uClickPos[i];',
                '    if(pos.x<0.0) continue;',
                '    float cps=8.0*pixelSize;',
                '    vec2 cuv=(((pos - uResolution*0.5 - cps*0.5)/uResolution))*vec2(aspectRatio,1.0);',
                '    float t=max(uTime - uClickTimes[i],0.0);',
                '    float r=distance(uv,cuv);',
                '    float waveR=uRippleSpeed*t;',
                '    float ring=exp(-pow((r-waveR)/uRippleThickness,2.0));',
                '    float atten=exp(-1.0*t)*exp(-10.0*r);',
                '    feed=max(feed, ring*atten*uRippleIntensity);',
                '  }',
                '',
                '  float bayer=Bayer8(fragCoord/uPixelSize)-0.5;',
                '  float bw=step(0.5, feed+bayer);',
                '  float h=fract(sin(dot(floor(fragCoord/uPixelSize),vec2(127.1,311.7)))*43758.5453);',
                '  float jitterScale=1.0+(h-0.5)*uPixelJitter;',
                '  float M=bw*jitterScale;',
                '',
                '  if(uEdgeFade>0.0){',
                '    vec2 norm=gl_FragCoord.xy/uResolution;',
                '    float edge=min(min(norm.x,norm.y),min(1.0-norm.x,1.0-norm.y));',
                '    float fade=smoothstep(0.0,uEdgeFade,edge);',
                '    M*=fade;',
                '  }',
                '',
                '  vec3 color=uColor;',
                '  vec3 srgbColor=mix(color*12.92, 1.055*pow(color,vec3(1.0/2.4))-0.055, step(0.0031308,color));',
                '  gl_FragColor=vec4(srgbColor, M);',
                '}'
            ].join('\n');

            // Compile shaders
            function compileShader(type, src) {
                var sh = gl.createShader(type);
                gl.shaderSource(sh, src);
                gl.compileShader(sh);
                if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                    console.error('PixelBlast shader error:', gl.getShaderInfoLog(sh));
                    return null;
                }
                return sh;
            }

            // Enable derivatives extension for fwidth
            gl.getExtension('OES_standard_derivatives');

            var vs = compileShader(gl.VERTEX_SHADER, PB_VERT);
            var fs = compileShader(gl.FRAGMENT_SHADER, PB_FRAG);
            if (!vs || !fs) return;

            var prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.error('PixelBlast link error:', gl.getProgramInfoLog(prog));
                return;
            }
            gl.useProgram(prog);

            // Fullscreen triangle
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
            var posLoc = gl.getAttribLocation(prog, 'position');
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // Get uniform locations
            var U = {};
            ['uColor','uResolution','uTime','uPixelSize','uScale','uDensity','uPixelJitter',
             'uRippleSpeed','uRippleThickness','uRippleIntensity','uEdgeFade'].forEach(function(n) {
                U[n] = gl.getUniformLocation(prog, n);
            });
            var uClickPosLocs = [];
            var uClickTimeLocs = [];
            for (var i = 0; i < MAX_CLICKS; i++) {
                uClickPosLocs.push(gl.getUniformLocation(prog, 'uClickPos['+i+']'));
                uClickTimeLocs.push(gl.getUniformLocation(prog, 'uClickTimes['+i+']'));
            }

            // Set static uniforms
            gl.uniform3f(U.uColor, PBCONFIG.color[0], PBCONFIG.color[1], PBCONFIG.color[2]);
            gl.uniform1f(U.uScale, PBCONFIG.patternScale);
            gl.uniform1f(U.uDensity, PBCONFIG.patternDensity);
            gl.uniform1f(U.uPixelJitter, PBCONFIG.pixelSizeJitter);
            gl.uniform1f(U.uRippleSpeed, PBCONFIG.rippleSpeed);
            gl.uniform1f(U.uRippleThickness, PBCONFIG.rippleThickness);
            gl.uniform1f(U.uRippleIntensity, PBCONFIG.rippleIntensityScale);
            gl.uniform1f(U.uEdgeFade, PBCONFIG.edgeFade);

            // Initialize click positions to -1
            for (var j = 0; j < MAX_CLICKS; j++) {
                gl.uniform2f(uClickPosLocs[j], -1, -1);
                gl.uniform1f(uClickTimeLocs[j], 0);
            }

            var pbTimeOffset = Math.random() * 1000;
            var pbStartTime = performance.now() / 1000;
            var pbClickIx = 0;

            function pbGetTime() {
                return pbTimeOffset + (performance.now() / 1000 - pbStartTime) * PBCONFIG.speed;
            }

            function pbSetSize() {
                var dpr = Math.min(window.devicePixelRatio || 1, 2);
                var w = container.clientWidth || 1;
                var h = container.clientHeight || 1;
                pbCanvas.width = Math.floor(w * dpr);
                pbCanvas.height = Math.floor(h * dpr);
                pbCanvas.style.width = w + 'px';
                pbCanvas.style.height = h + 'px';
                gl.viewport(0, 0, pbCanvas.width, pbCanvas.height);
                gl.uniform2f(U.uResolution, pbCanvas.width, pbCanvas.height);
                gl.uniform1f(U.uPixelSize, PBCONFIG.pixelSize * dpr);
            }
            pbSetSize();
            window.addEventListener('resize', pbSetSize);
            new ResizeObserver(pbSetSize).observe(container);

            // CLICK ANYWHERE in the About section -> spawn a ripple at that point
            var aboutSection = document.getElementById('about');
            (aboutSection || container).addEventListener('pointerdown', function(e) {
                // Dark mode only (canvas is hidden otherwise)
                if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
                var rect = pbCanvas.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;
                var sx = pbCanvas.width / rect.width;
                var sy = pbCanvas.height / rect.height;
                var fx = (e.clientX - rect.left) * sx;
                var fy = (rect.height - (e.clientY - rect.top)) * sy;
                gl.uniform2f(uClickPosLocs[pbClickIx], fx, fy);
                gl.uniform1f(uClickTimeLocs[pbClickIx], pbGetTime());
                pbClickIx = (pbClickIx + 1) % MAX_CLICKS;
            });

            function pbAnimate() {
                gl.uniform1f(U.uTime, pbGetTime());
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                requestAnimationFrame(pbAnimate);
            }
            pbAnimate();
        })();

        /* ═══ PROFILE CARD INTERACTION (About Section - Dark Mode) ═══ */
        (function initProfileCardAbout() {
            var wrap = document.getElementById('pcCardWrapperAbout');
            var shell = document.getElementById('pcCardShellAbout');
            if (!wrap || !shell) return;

            var clamp = function(v, min, max) { return Math.min(Math.max(v, min || 0), max || 100); };
            var round = function(v, p) { return parseFloat(v.toFixed(p || 3)); };
            var adjust = function(v, fMin, fMax, tMin, tMax) { return round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin)); };

            var currentX = 0, currentY = 0, targetX = 0, targetY = 0;
            var running = false, lastTs = 0, rafId = null;
            var TAU = 0.14;

            function setVarsFromXY(x, y) {
                var width = shell.clientWidth || 1;
                var height = shell.clientHeight || 1;
                var px = clamp((100 / width) * x, 0, 100);
                var py = clamp((100 / height) * y, 0, 100);
                var cx = px - 50;
                var cy = py - 50;
                wrap.style.setProperty('--pointer-x', px + '%');
                wrap.style.setProperty('--pointer-y', py + '%');
                wrap.style.setProperty('--background-x', adjust(px, 0, 100, 35, 65) + '%');
                wrap.style.setProperty('--background-y', adjust(py, 0, 100, 35, 65) + '%');
                wrap.style.setProperty('--pointer-from-center', clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1));
                wrap.style.setProperty('--pointer-from-top', py / 100);
                wrap.style.setProperty('--pointer-from-left', px / 100);
                wrap.style.setProperty('--pc-rotate-x', round(-(cx / 5)) + 'deg');
                wrap.style.setProperty('--pc-rotate-y', round(cy / 4) + 'deg');
            }

            function step(ts) {
                if (!running) return;
                if (lastTs === 0) lastTs = ts;
                var dt = (ts - lastTs) / 1000;
                lastTs = ts;
                var k = 1 - Math.exp(-dt / TAU);
                currentX += (targetX - currentX) * k;
                currentY += (targetY - currentY) * k;
                setVarsFromXY(currentX, currentY);
                if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
                    rafId = requestAnimationFrame(step);
                } else {
                    running = false; lastTs = 0;
                }
            }
            function start() { if (running) return; running = true; lastTs = 0; rafId = requestAnimationFrame(step); }
            function setTarget(x, y) { targetX = x; targetY = y; start(); }
            function toCenter() { setTarget(shell.clientWidth / 2, shell.clientHeight / 2); }
            function getOffsets(evt) { var rect = shell.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }

            shell.addEventListener('pointerenter', function(e) {
                wrap.style.setProperty('--card-opacity', '1');
                var o = getOffsets(e); setTarget(o.x, o.y);
            });
            shell.addEventListener('pointermove', function(e) {
                var o = getOffsets(e); setTarget(o.x, o.y);
            });
            shell.addEventListener('pointerleave', function() {
                toCenter();
                setTimeout(function() { wrap.style.setProperty('--card-opacity', '0'); }, 600);
            });

            // Initialize centered
            var ix = (shell.clientWidth || 300) / 2;
            var iy = (shell.clientHeight || 400) / 2;
            currentX = ix; currentY = iy;
            setVarsFromXY(ix, iy);
        })();

        /* ═══ SIDE RAYS (Dark Mode Hero Background) ═══ */
        (function initSideRaysEffect() {
            var RAYS_CONFIG = {
                speed: 2.5,
                rayColor1: "#EAB308",
                rayColor2: "#96c8ff",
                intensity: 2,
                spread: 2,
                origin: "top-right",
                tilt: 0,
                saturation: 1.5,
                blend: 0.75,
                falloff: 1.6,
                opacity: 1.0
            };

            function hexToRgb(hex) {
                var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1];
            }
            function originToFlip(origin) {
                switch (origin) {
                    case "top-left": return [1, 0];
                    case "bottom-right": return [0, 1];
                    case "bottom-left": return [1, 1];
                    default: return [0, 0];
                }
            }

            var VERT_SRC = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';
            var FRAG_SRC = [
                'precision highp float;',
                'uniform float iTime;',
                'uniform vec2 iResolution;',
                'uniform float iSpeed;',
                'uniform vec3 iRayColor1;',
                'uniform vec3 iRayColor2;',
                'uniform float iIntensity;',
                'uniform float iSpread;',
                'uniform float iFlipX;',
                'uniform float iFlipY;',
                'uniform float iTilt;',
                'uniform float iSaturation;',
                'uniform float iBlend;',
                'uniform float iFalloff;',
                'uniform float iOpacity;',
                '',
                'float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {',
                '  vec2 sourceToCoord = coord - raySource;',
                '  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);',
                '  return clamp((0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) + (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)), 0.0, 1.0) * clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);',
                '}',
                '',
                'void main() {',
                '  vec2 fragCoord = gl_FragCoord.xy;',
                '  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;',
                '  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;',
                '  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);',
                '  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);',
                '  float tiltRad = iTilt * 3.14159265 / 180.0;',
                '  float cs = cos(tiltRad);',
                '  float sn = sin(tiltRad);',
                '  vec2 rel = coord - rayPos;',
                '  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;',
                '  float halfSpread = iSpread * 0.275;',
                '  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));',
                '  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));',
                '  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);',
                '  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);',
                '  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;',
                '  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;',
                '  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);',
                '  color.rgb *= brightness;',
                '  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));',
                '  color.rgb = mix(vec3(gray), color.rgb, iSaturation);',
                '  color.a = max(color.r, max(color.g, color.b)) * iOpacity;',
                '  gl_FragColor = color;',
                '}'
            ].join('\n');

            function compileShader(gl, type, src) {
                var sh = gl.createShader(type);
                gl.shaderSource(sh, src);
                gl.compileShader(sh);
                if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(sh));
                }
                return sh;
            }

            var raysContainer = document.getElementById('side-rays');
            if (!raysContainer) return;

            var raysCanvas = document.createElement('canvas');
            raysContainer.appendChild(raysCanvas);

            var gl = raysCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
            if (!gl) { console.error('WebGL unavailable for side rays'); return; }

            var prog = gl.createProgram();
            gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
            gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(prog));
            }
            gl.useProgram(prog);

            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
            var posLoc = gl.getAttribLocation(prog, 'position');
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            var U = {};
            ['iTime','iResolution','iSpeed','iRayColor1','iRayColor2','iIntensity','iSpread',
             'iFlipX','iFlipY','iTilt','iSaturation','iBlend','iFalloff','iOpacity'
            ].forEach(function(n) { U[n] = gl.getUniformLocation(prog, n); });

            var flips = originToFlip(RAYS_CONFIG.origin);
            gl.uniform1f(U.iSpeed, RAYS_CONFIG.speed);
            gl.uniform3fv(U.iRayColor1, hexToRgb(RAYS_CONFIG.rayColor1));
            gl.uniform3fv(U.iRayColor2, hexToRgb(RAYS_CONFIG.rayColor2));
            gl.uniform1f(U.iIntensity, RAYS_CONFIG.intensity);
            gl.uniform1f(U.iSpread, RAYS_CONFIG.spread);
            gl.uniform1f(U.iFlipX, flips[0]);
            gl.uniform1f(U.iFlipY, flips[1]);
            gl.uniform1f(U.iTilt, RAYS_CONFIG.tilt);
            gl.uniform1f(U.iSaturation, RAYS_CONFIG.saturation);
            gl.uniform1f(U.iBlend, RAYS_CONFIG.blend);
            gl.uniform1f(U.iFalloff, RAYS_CONFIG.falloff);
            gl.uniform1f(U.iOpacity, RAYS_CONFIG.opacity);

            function resizeRays() {
                var dpr = Math.min(window.devicePixelRatio || 1, 2);
                var w = raysContainer.clientWidth;
                var h = raysContainer.clientHeight;
                raysCanvas.width = Math.max(1, Math.floor(w * dpr));
                raysCanvas.height = Math.max(1, Math.floor(h * dpr));
                raysCanvas.style.width = w + 'px';
                raysCanvas.style.height = h + 'px';
                gl.viewport(0, 0, raysCanvas.width, raysCanvas.height);
                gl.uniform2f(U.iResolution, raysCanvas.width, raysCanvas.height);
            }
            window.addEventListener('resize', resizeRays);
            resizeRays();

            function raysLoop(t) {
                gl.uniform1f(U.iTime, t * 0.001);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                requestAnimationFrame(raysLoop);
            }
            requestAnimationFrame(raysLoop);
        })();

    })();

    (function(){
        var IFRAME_WIDTH = 1280;
        var IFRAME_HEIGHT = 3200;
        var HOVER_DELAY = 200;
        var MIN_DURATION = 8000;
        var MAX_DURATION = 12000;
        var isTouch = (window.matchMedia && window.matchMedia('(hover: none)').matches) || ('ontouchstart' in window);

        var previews = Array.prototype.slice.call(document.querySelectorAll('.project-screenshot[data-preview-url]'));
        if (!previews.length) return;

        function setup(container){
            var iframe = container.querySelector('.project-preview-iframe');
            var scroller = container.querySelector('.project-preview-scroller');
            if (!iframe || !scroller) return;
            var isImage = iframe.tagName === 'IMG';
            var nativeW = parseInt(iframe.getAttribute('data-native-width'), 10) || IFRAME_WIDTH;
            var nativeH = parseInt(iframe.getAttribute('data-native-height'), 10) || IFRAME_HEIGHT;

            var state = { scale: 1, maxScroll: 0, current: 0, target: 0, rafId: null, hoverTimer: null, loaded: false, blocked: false };

            function applyLayout(){
                var w = container.clientWidth;
                var h = container.clientHeight;
                if (!w || !h) return;
                state.scale = w / nativeW;
                var scaledHeight = nativeH * state.scale;
                state.maxScroll = Math.max(0, scaledHeight - h);
                applyTransform(state.current);
            }
            function applyTransform(y){
                iframe.style.transform = 'translateY(' + (-y) + 'px) scale(' + state.scale + ')';
            }
            function stopAnim(){
                if (state.rafId){ cancelAnimationFrame(state.rafId); state.rafId = null; }
            }
            function animateTo(target, durationOverride){
                stopAnim();
                var start = performance.now();
                var from = state.current;
                var distance = target - from;
                if (Math.abs(distance) < 0.5){ state.current = target; applyTransform(target); return; }
                var pageScale = state.maxScroll > 0 ? Math.min(1, Math.abs(distance) / state.maxScroll) : 1;
                var duration = durationOverride != null ? durationOverride : (MIN_DURATION + (MAX_DURATION - MIN_DURATION) * pageScale);
                function step(now){
                    var t = Math.min(1, (now - start) / duration);
                    var eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
                    state.current = from + distance * eased;
                    applyTransform(state.current);
                    if (t < 1){ state.rafId = requestAnimationFrame(step); }
                    else { state.rafId = null; }
                }
                state.rafId = requestAnimationFrame(step);
            }

            function loadIframe(){
                if (iframe.src) return;
                var url = iframe.getAttribute('data-src');
                if (!url) return;
                var loadTimer = setTimeout(function(){
                    if (!state.loaded){
                        container.classList.add('is-blocked');
                        state.blocked = true;
                    }
                }, 8000);
                iframe.addEventListener('load', function(){
                    clearTimeout(loadTimer);
                    state.loaded = true;
                    if (isImage){
                        if (iframe.naturalWidth) nativeW = iframe.naturalWidth;
                        if (iframe.naturalHeight) nativeH = iframe.naturalHeight;
                    } else {
                        // Best-effort blocked detection: cross-origin success throws on access
                        try {
                            var doc = iframe.contentDocument;
                            if (doc && (!doc.body || doc.body.children.length === 0)){
                                container.classList.add('is-blocked');
                                state.blocked = true;
                                return;
                            }
                        } catch(e){ /* cross-origin ok */ }
                    }
                    iframe.classList.add('is-loaded');
                    container.classList.add('is-ready');
                    applyLayout();
                }, { once: true });
                iframe.addEventListener('error', function(){
                    clearTimeout(loadTimer);
                    container.classList.add('is-blocked');
                    state.blocked = true;
                }, { once: true });
                iframe.src = url;
            }

            // Eager preload for faster previews (staggered to avoid network contention)
            if ('IntersectionObserver' in window){
                var io = new IntersectionObserver(function(entries){
                    entries.forEach(function(en){
                        if (en.isIntersecting){ loadIframe(); io.unobserve(container); }
                    });
                }, { rootMargin: '1500px 0px' });
                io.observe(container);
            } else { loadIframe(); }

            // Resize handling
            var ro;
            if ('ResizeObserver' in window){
                ro = new ResizeObserver(function(){ applyLayout(); });
                ro.observe(container);
            } else {
                window.addEventListener('resize', applyLayout);
            }

            if (!isTouch){
                container.addEventListener('mouseenter', function(){
                    if (state.blocked) return;
                    if (state.hoverTimer) clearTimeout(state.hoverTimer);
                    state.hoverTimer = setTimeout(function(){
                        if (!state.loaded){ return; }
                        applyLayout();
                        if (state.maxScroll <= 0) return;
                        animateTo(state.maxScroll);
                    }, HOVER_DELAY);
                });
                container.addEventListener('mouseleave', function(){
                    if (state.hoverTimer){ clearTimeout(state.hoverTimer); state.hoverTimer = null; }
                    animateTo(0, 600);
                });
            }
        }

        previews.forEach(setup);
        // Warm connections by prefetching preview URLs immediately
        try {
            previews.forEach(function(c){
                var u = c.getAttribute('data-preview-url');
                if (!u) return;
                var l = document.createElement('link');
                l.rel = 'preconnect'; l.href = u; l.crossOrigin = '';
                document.head.appendChild(l);
            });
        } catch(e){}
    })();
