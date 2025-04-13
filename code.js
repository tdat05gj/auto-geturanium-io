// ==UserScript==
// @name         Uranium Auto Clicker (vô hạn)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tự động click 3 nút + refining (5s delay) lặp vô hạn trong uranium.io 🔁♾️🔥
// @author       Bạn
// @match        https://www.geturanium.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const buttonTitles = ['Auto Collector', 'Shard Multiplier', 'Conveyor Booster'];

    function simulateClick(element, offsetX = 0, offsetY = 0) {
        if (!element || element.disabled || element.classList.contains('opacity-50')) return false;
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2 + offsetX;
        const clientY = rect.top + rect.height / 2 + offsetY;
        const events = [
            new PointerEvent('pointerdown', { bubbles: true, clientX, clientY }),
            new MouseEvent('mousedown', { bubbles: true, clientX, clientY }),
            new MouseEvent('mouseup', { bubbles: true, clientX, clientY }),
            new MouseEvent('click', { bubbles: true, clientX, clientY }),
            new PointerEvent('pointerup', { bubbles: true, clientX, clientY })
        ];
        events.forEach(event => element.dispatchEvent(event));
        return true;
    }

    function clickMainButton(index) {
        if (window.location.pathname !== '/') return false;
        const title = buttonTitles[index];
        const buttons = document.querySelectorAll('button');
        let targetElement = null;
        buttons.forEach(button => {
            const h3 = button.querySelector('h3');
            if (h3 && h3.textContent === title) {
                const flexDiv = button.querySelector('div.flex.items-start.gap-3');
                targetElement = flexDiv || button;
            }
        });
        if (targetElement) {
            const clicked = simulateClick(targetElement);
            console.log(clicked ? `✅ Click ${title}` : `❌ Không thể click ${title}`);
            return true;
        }
        console.log(`❌ Không tìm thấy nút ${title}`);
        return false;
    }

    function clickStartRefining() {
        if (!window.location.pathname.includes('/refinery')) return false;
        const button = document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400');
        if (button) {
            const clicked = simulateClick(button);
            console.log(clicked ? '✅ Click Start Refining' : '❌ Không thể click Start Refining');
            return true;
        }
        console.log('❌ Không tìm thấy Start Refining');
        return false;
    }

    function waitForButtons() {
        return new Promise(resolve => {
            let attempts = 0;
            const observer = new MutationObserver(() => {
                if (
                    document.querySelectorAll('button h3').length > 0 ||
                    document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400') ||
                    document.querySelector('a[href="/refinery"], a[href="/"]')
                ) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            const interval = setInterval(() => {
                attempts++;
                if (
                    document.querySelectorAll('button h3').length > 0 ||
                    document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400') ||
                    document.querySelector('a[href="/refinery"], a[href="/"]') ||
                    attempts >= 20
                ) {
                    observer.disconnect();
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }

    function navigateTo(to) {
        const link = document.querySelector(`a[href="${to}"]`);
        if (link) {
            simulateClick(link);
        } else {
            window.location.href = `https://www.geturanium.io${to}`;
        }
    }

    async function startAutoClick() {
        await waitForButtons();

        let mainIndex = parseInt(localStorage.getItem('mainIndex') || '0');
        let cycleCount = parseInt(localStorage.getItem('cycleCount') || '0');
        let phase = localStorage.getItem('phase') || 'main';
        let phaseStartTime = parseInt(localStorage.getItem('phaseStartTime') || Date.now());

        if (window.autoClickInterval) clearInterval(window.autoClickInterval);

        window.autoClickInterval = setInterval(() => {
            const elapsed = (Date.now() - phaseStartTime) / 1000;
            if (phase === 'main' && window.location.pathname === '/') {
                clickMainButton(mainIndex);
                mainIndex = (mainIndex + 1) % buttonTitles.length;
                localStorage.setItem('mainIndex', mainIndex);
                if (mainIndex === 0) {
                    cycleCount++;
                    localStorage.setItem('cycleCount', cycleCount);
                    console.log(`🔁 Chu kỳ ${cycleCount}/20`);
                }
                if (cycleCount >= 66) {
                    navigateTo('/refinery');
                    phase = 'refinery';
                    phaseStartTime = Date.now();
                    cycleCount = 0;
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                    localStorage.setItem('cycleCount', cycleCount);
                }
            } else if (phase === 'refinery' && window.location.pathname.includes('/refinery')) {
                clickStartRefining();
                if (elapsed >= 5) {
                    navigateTo('/');
                    phase = 'main';
                    phaseStartTime = Date.now();
                    mainIndex = 0;
                    cycleCount = 0;
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                    localStorage.setItem('mainIndex', mainIndex);
                    localStorage.setItem('cycleCount', cycleCount);
                }
            } else {
                // Khôi phục trạng thái nếu reload hoặc lỗi
                if (window.location.pathname.includes('/refinery') && phase !== 'refinery') {
                    phase = 'refinery';
                    phaseStartTime = Date.now();
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                } else if (window.location.pathname === '/' && phase !== 'main') {
                    phase = 'main';
                    phaseStartTime = Date.now();
                    cycleCount = 0;
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                    localStorage.setItem('cycleCount', cycleCount);
                }
            }

            console.log(`⏱️ Phase: ${phase} | Chu kỳ: ${cycleCount}/20 | ${elapsed.toFixed(1)}s | Trang: ${window.location.pathname}`);
        }, 1000);
    }

    window.addEventListener('load', () => {
        console.log('♻️ Auto Clicker uranium.io đã sẵn sàng...');
        startAutoClick();
    });
})();
